import request from '@/utils/request';

const apiPre = '';

// 获取版本列表
export function getSysVersionList(params) {
  return request({
    url: apiPre + '/expert/inf/SysVersion/list',
    method: 'get',
    params,
  });
}

// 获取版本详情
export function getSysVersionDetail(params) {
  return request({
    url: apiPre + '/expert/inf/SysVersion',
    method: 'get',
    params,
  });
}

// 版本 - 新增
export function addVersion(data) {
  return request({
    url: apiPre + '/expert/inf/SysVersion',
    method: 'post',
    data,
  });
}

// 版本 - 编辑
export function editVersion(data) {
  return request({
    url: apiPre + '/expert/inf/SysVersion',
    method: 'put',
    data,
  });
}
