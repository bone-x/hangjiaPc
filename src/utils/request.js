import axios from 'axios';
import {
  Message,
  MessageBox,
  Loading,
} from 'element-ui';
import store from '@/store';
import {
  getToken,
} from '@/utils/auth';

let requestNum = 0;
let loading;

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 1000 * 60 * 30, // request timeout
  withCredentials: true,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    requestNum++;
    if (!loading) {
      loading = Loading.service({
        background: 'rgba(0,0,0,0)',
      });
    }

    const newConfig = {
      ...config,
    };

    if (!newConfig.params) newConfig.params = {};
    newConfig.params._t = Date.parse(new Date()) / 1000;

    // 去除RAP2路径后缀
    if (newConfig.url.indexOf('/RAP') !== -1 && process.env.NODE_ENV !== 'development') {
      newConfig.url = String(newConfig.url).replace('/RAP', '');
    } else {
      newConfig.url = String(newConfig.url).replace(/\${.*}/, '');
    }

    // Do something before request is sent
    if (store.getters.token) {
      const token = getToken();
      // 让每个请求携带token-- ['token']为自定义key 请根据实际情况自行修改
      if (!newConfig.headers) newConfig.headers = {};
      if (!newConfig.headers.token) newConfig.headers.token = getToken();
      if (!newConfig.headers['Access-Control-Allow-Origin']) newConfig.headers['Access-Control-Allow-Origin'] = '*';
      if (!newConfig.headers['Access-Control-Max-Age']) newConfig.headers['Access-Control-Max-Age'] = 2000;
      if (!newConfig.headers['Content-Type']) newConfig.headers['Content-Type'] = 'application/json;charset=UTF-8';

      if (newConfig.url.indexOf('/RAP') !== -1 && process.env.NODE_ENV === 'development') {
        newConfig.params.token = getToken();
        if (!newConfig.data) newConfig.data = {};
        newConfig.data.token = token;
      }
    }
    return newConfig;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  },
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    requestNum--;
    if (requestNum <= 0) {
      loading.close();
      loading = null;
    }

    const res = response.data;
    if (res.code !== undefined && res.code !== 200) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000,
      });
      const goLoginToken = [
        1002,
        1130,
        1131,
        1132,
        1114,
        1115,
      ];
      // 1002:非法的token; 50012:其他客户端登录了;  1130:Token 过期了; 1132: 未登陆
      if (goLoginToken.indexOf(res.code) !== -1) {
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            window.location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        });
      }
      return Promise.reject();
    }
    // return response.data;
    if (response.data && response.data.result && response.data.result.totalCount) response.data.result.totalCount = Number(response.data.result.totalCount);
    return response.data;
  },
  (error) => {
    requestNum--;
    if (requestNum <= 0) {
      loading.close();
      loading = null;
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
