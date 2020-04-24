import request from '@/utils/request';

//  服务协议修改列表
// eslint-disable-next-line import/prefer-default-export
export function getServiceagreement(params) {
  return request({
    url: '/expert/ag/webagreementhistory/webagreementhistory',
    method: 'get',
    params,
  });
}

// 服务协议回显
export function getServiceagreementdata(params) {
  return request({
    url: '/expert/ag/webagreementhistory/agreement',
    method: 'get',
    params,
  });
}

// 版权说明回显
export function getServiceversion(params) {
  return request({
    url: '/expert/ag/webcopyrighthistory/copyright',
    method: 'get',
    params,
  });
}

// 保存修改协议
export function submitServiceagreement(data) {
  return request({
    url: '/expert/ag/webagreementhistory/webagreementhistory',
    method: 'post',
    data,
  });
}

// 版权说明列表
export function getServicelist(params) {
  return request({
    url: '/expert/ag/webcopyrighthistory/webcopyrighthistory',
    method: 'get',
    params,
  });
}

// 保存修改版权说明
export function changeServicelist(data) {
  return request({
    url: '/expert/ag/webcopyrighthistory/webcopyrighthistory',
    method: 'post',
    data,
  });
}

//  新手指南列表
export function getList(params) {
  return request({
    url: '/expert/ag/webguide/listPage',
    method: 'get',
    params,
  });
}

//  新建操作
export function createdList(data) {
  return request({
    url: '/expert/ag/webguide/webguide',
    method: 'post',
    data,
  });
}

//  删除操作
export function deleteList(params) {
  return request({
    url: `/expert/ag/webguide/webguide/${params.id}`,
    method: 'DELETE',
  });
}

//  修改操作
export function changeList(data) {
  return request({
    url: '/expert/ag/webguide/webguide',
    method: 'put',
    data,
  });
}

//  系统文案列表
export function systemDocumentList(params) {
  return request({
    url: '/expert/ag/copywriting/getList',
    method: 'get',
    params,
  });
}

//  系统文案修改历史列表
export function systemDocumentEdit(params) {
  return request({
    url: '/expert/ag/copywritingHistory/getList',
    method: 'get',
    params,
  });
}

//  系统文案查看
export function systemDocumentCheck(params) {
  return request({
    url: '/expert/ag/copywriting/getCopywritingById',
    method: 'get',
    params,
  });
}

//  系统文案更新
export function systemDocumentUpdate(data) {
  return request({
    url: '/expert/ag/copywriting/updateCopywriting',
    method: 'put',
    data,
  });
}
