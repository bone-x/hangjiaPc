import request from '@/utils/request';

export function loginByUsername(username, password) {
  const data = {
    phone: username,
    password,
  };
  return request({
    url: '/expert/sys/login',
    method: 'post',
    data,
  });
}

export function getUserInfo() {
  return request({
    url: '/expert/sys/userInfo',
    method: 'get',
  });
}

export function getUserPerm() {
  return request({
    url: '/expert/sys/userPerm',
    method: 'get',
  });
}

export default {
  loginByUsername,
  getUserInfo,
  getUserPerm,
};
