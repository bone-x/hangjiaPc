import request from '@/utils/request';

const apiPre = '';

// 查看 已经拒绝 和待处理的机构列表 支持分页 高级查询
export function getOrganizationList(params) {
  return request({
    url: apiPre + '/expert/organization/OrgBasicInfo/getOrgAuditList',
    method: 'get',
    params,
  });
}

// 审核机构
export function getCheckoutOrg(params) {
  return request({
    url: apiPre + '/expert/organization/OrgBasicInfo/orgAuditById',
    method: 'get',
    params,
  });
}


// 删除已经拒绝的申请机构
export function delOrganization(params) {
  return request({
    url: apiPre + '/expert/organization/OrgBasicInfo/deleteOrgAudit',
    method: 'delete',
    params,
  });
}

// 根据id查看机构详情
export function getOrgDetails(params) {
  return request({
    url: apiPre + '/expert/organization/OrgBasicInfo/getOrgById',
    method: 'get',
    params,
  });
}

// 查看 已经审核通过的机构列表 支持分页 高级查询
export function getPassOrganization(params) {
  return request({
    url: apiPre + '/expert/organization/OrgBasicInfo/getOrgEndAuditList',
    method: 'get',
    params,
  });
}

// 后台修改已经审核通过的机构信息
export function changePassOrg(data) {
  return request({
    url: apiPre + '/expert/organization/OrgBasicInfo/updateOrgAuditById',
    method: 'post',
    data,
  });
}


// 获得机构协议内容
export function getAgreement() {
  return request({
    url: apiPre + '/expert/organization/OrgAgreement',
    method: 'get',
  });
}


// 更新机构协议内容
export function updateAgreement(data) {
  return request({
    url: apiPre + '/expert/organization/OrgAgreement',
    method: 'post',
    data,
  });
}
