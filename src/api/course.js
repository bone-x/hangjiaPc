import request from '@/utils/request';


//  获取课程列表
export function getCourseList(params) {
  return request({
    url: '/expert/goods/admin/courses/listPage',
    method: 'get',
    params,
  });
}


//  新增课程列表
export function addCourse(data) {
  return request({
    url: '/expert/goods/admin/courses/save',
    method: 'post',
    data,
  });
}

// 删除课程
export function deleteCourse(params) {
  return request({
    url: '/expert/goods/admin/courses/delete',
    method: 'post',
    params,
  });
}

// 修改课程
export function changeCourse(data) {
  return request({
    url: '/expert/goods/admin/courses/update',
    method: 'post',
    data,
  });
}

//  课程详情
export function detailsCourse(params) {
  return request({
    url: `/expert/goods/admin/courses/info/${params.id}`,
    method: 'get',
    params,
  });
}

// 删除资料文件
export function deleteFiles(data) {
  return request({
    url: '/admin/courseChapter/deleteFile',
    method: 'post',
    data,
  });
}

// 获取节详情
export function getSpotDetails(params) {
  return request({
    url: `/expert/goods/admin/courseChapter/getSectionInfo/${params.chapterId}`,
    method: 'get',
    params,
  });
}

// 课程目录
export function getCourseChapter(params) {
  return request({
    url: '/expert/goods/admin/courseChapter/listChapter',
    method: 'get',
    params,
  });
}

// 新增章
export function addChapterData(data) {
  return request({
    url: '/expert/goods/admin/courseChapter/saveChapter',
    method: 'post',
    data,
  });
}

// 新增节
export function addSectionData(data) {
  return request({
    url: '/expert/goods/admin/courseChapter/saveSection',
    method: 'post',
    data,
  });
}

// 修改章
export function changeChapter(data) {
  return request({
    url: '/expert/goods/admin/courseChapter/updateChapter',
    method: 'post',
    data,
  });
}

// 获取节详情
export function getSectionDetails(params) {
  return request({
    url: `/expert/goods/admin/courseChapter/getSectionInfo/${params.chapterId}`,
    method: 'get',
    params,
  });
}

// 修改节
export function changeSection(data) {
  return request({
    url: '/expert/goods/admin/courseChapter/updateSection',
    method: 'post',
    data,
  });
}

// 删除章节
export function deleteChapter(params) {
  return request({
    url: '/expert/goods/admin/courseChapter/deleteChapter',
    method: 'post',
    params,
  });
}

// 保利威视视频分类
export function videoOptionType(params) {
  return request({
    url: '/expert/goods/admin/courseChapter/polyvVideoCataList',
    method: 'get',
    params,
  });
}

// 保利威视视频分类
export function videoOptionList(params) {
  return request({
    url: '/expert/goods/admin/courseChapter/polyvVideoList',
    method: 'get',
    params,
  });
}

// 录播资料列表
export function videoFilesList(params) {
  return request({
    url: '/expert/goods/admin/courses/listCourseRecordFile',
    method: 'get',
    params,
  });
}

// 资料下载列表
export function filesDownload(params) {
  return request({
    url: '/expert/goods/admin/courses/listFileList',
    method: 'get',
    params,
  });
}

// 生成课程的编号
export function autoCourseNum(params) {
  return request({
    url: '/expert/goods/admin/courses/generateCourseNo',
    method: 'get',
    params,
  });
}
