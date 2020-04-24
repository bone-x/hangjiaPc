import request from '@/utils/request';

// 学员管理列表&点击查询搜索
export function studentList(params) {
  return request({
    url: '/expert/stu/student/listPage',
    method: 'get',
    params,
  });
}

// 点击查看单条数据
export function studentDetail(userId = String) {
  return request({
    url: `/expert/stu/stuStudentGoods/listPage/${userId}`,
    method: 'get',
  });
}

// 点击导出
export function exportStudent(params = Object) {
  return request({
    url: '/expert/stu/student/exportList',
    method: 'get',
    params,
  });
}

// 获取学员听课卡详情列表
export function getStudentCourseCardDetailsList(params) {
  return request({
    url: '/expert/operate/opCourseStudent/getCourseStudentCardListByParams',
    method: 'get',
    params,
  });
}

// 通讯录列表查询
export function getAddressList(params) {
  return request({
    url: '/expert/stu/student/contacts',
    method: 'get',
    params,
  });
}

// 导出
export function getAddressListExportExcel(params) {
  return request({
    url: 'expert/stu/student/contacts/export',
    method: 'get',
    params,
  });
}

// 学员笔记列表
export function getNotesList(params) {
  return request({
    url: '/expert/stu/stuNote/list',
    method: 'get',
    params,
  });
}

// 笔记详情列表
export function getNotesDetailsList(params) {
  return request({
    url: '/expert/stu/stuNote/detail',
    method: 'get',
    params,
  });
}

// 获取所有章节
export function getAllChapters(params) {
  return request({
    url: '/expert/goods/admin/courseChapter/querySectionList',
    method: 'get',
    params,
  });
}

// 导出笔记详情
export function exportNotesDetails(data) {
  return request({
    url: '/expert/stu/stuNote/export',
    method: 'post',
    data,
  });
}

// 导出通讯录
export function exportStudentAddress(params) {
  return request({
    url: '/expert/stu/student/exportContacts',
    method: 'get',
    params,
  });
}

export default {
  studentList,
  studentDetail,
  exportStudent,
};
