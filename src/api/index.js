import request from '@/utils/request';

const rootDir = 'hangjia/v2';

// oss 签名
export default function getUploadSign({ dir = '', key = '' }) {
  return request({
    url: '//hq-storage.hqjy.com/api/signMapLog/expert',
    method: 'post',
    data: {
      dir: `${rootDir}/${dir}`,
      key,
    },
  });
}

export function downloadFiledata(url) {
  return request({
    url,
    method: 'get',
    responseType: "blob",
    // withCredentials: false,
  });
}
