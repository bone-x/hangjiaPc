import request from '@/utils/request';

//  获取资讯列表
export function getNewsList(params) {
  return request({
    url: '/expert/inf/infinformation/InfInformationList',
    method: 'get',
    params,
  });
}

//  id查询资讯列表
export function getclearList(params) {
  return request({
    url: '/expert/inf/infinformation/InfInformation',
    method: 'get',
    params,
  });
}

// 获取敏感词过滤
export function getforbddenList(data) {
  return request({
    url: '/expert/operate/sensitiverecord/examineInfo',
    method: 'post',
    data,
  });
}

//  新建资讯
export function createdInformation(data) {
  return request({
    url: '/expert/inf/infinformation/InfInformation',
    method: 'post',
    data,
  });
}

//  新建资讯 - 基于爬虫模板
export function createdInformationByCrawler(data) {
  return request({
    url: '/expert/inf/infinformation/crawlerInfInformation',
    method: 'post',
    data,
  });
}

// 修改资询
export function changeInformation(data) {
  return request({
    url: '/expert/inf/infinformation/InfInformation',
    method: 'put',
    data,
  });
}

// 删除资讯
export function deleteInformation(params) {
  return request({
    url: `/expert/inf/infinformation/InfInformation/${params.newStr}`,
    method: 'delete',
  });
}

// 下架资讯
export function underInformation(params) {
  return request({
    url: `/expert/inf/infinformation/InfInformation/undercarriage/${params.ids}`,
    method: 'post',
  });
}

// 单条资讯
export function singleInformation(params) {
  return request({
    url: '/expert/inf/InfInformation',
    method: 'get',
    params,
  });
}

// // 获取父类目
export function getFathertype(productId) {
  let obj = {};
  if (productId) {
    obj.productId = productId;
  } else {
    obj = {};
  }
  return request({
    url: '/expert/inf/infcategory/parInfCategory',
    method: 'get',
    params: obj,
  });
}

export function getAllNewsType(params) {
  return request({
    url: '/expert/inf/infcategory/parInfCategory',
    method: 'get',
    params,
  });
}

// 获取父类目(不需参数)
export function getNewsCategory(params) {
  return request({
    url: '/expert/inf/infcategory/parInfCategory',
    method: 'get',
    params,
  });
}

// 获取子类目
export function getChildtype(params) {
  return request({
    url: '/expert/inf/infcategory/subInfCategory',
    method: 'get',
    params,
  });
}

// 资讯类目列表
export function getCategoryList(params) {
  return request({
    url: '/expert/inf/infcategory/infCategoryList',
    method: 'get',
    params,
  });
}

// 通过id获取父类目的名称
export function getFathertypename(params) {
  return request({
    url: '/expert/inf/infcategory/infCategory',
    method: 'get',
    params,
  });
}

// 资讯类目列表删除
export function delCategoryList(params) {
  return request({
    url: `/expert/inf/infcategory/infCategory/${params.id}`,
    method: 'delete',
  });
}

// 修改资讯类目列表
export function changeCategoryList(data) {
  return request({
    url: '/expert/inf/infcategory/infCategory',
    method: 'put',
    data,
  });
}

// 新建资讯类目列表
export function createdCategoryList(data) {
  return request({
    url: '/expert/inf/infcategory/infCategory',
    method: 'post',
    data,
  });
}

// 爬取资讯管理列表
export function getmanagementList(params) {
  return request({
    url: '/expert/inf/infcrawler/infcrawlerList',
    method: 'get',
    params,
  });
}

// 查询爬取结果
export function getmanagementSingle(params) {
  return request({
    url: '/expert/inf/infcrawler/infcrawler/result',
    method: 'get',
    params,
  });
}

// 导出数据弹窗爬取结果
export function getmanagementExcel(params) {
  return request({
    url: '/expert/inf/infcrawler/infcrawler/result/excel',
    method: 'get',
    params,
  });
}

// 批量删除资讯
export function delmanagementList(params) {
  return request({
    url: `/expert/inf/infcrawler/infcrawler/${params.newStr}`,
    method: 'delete',
  });
}

// 获取爬取资讯
export function getmanagementdata(params) {
  return request({
    url: '/expert/inf/infcrawler/detail',
    method: 'get',
    params,
  });
}

// 根据资讯id获取资讯详情（会加锁）
export function getNewsDetailsLockByEditId(params) {
  return request({
    url: '/expert/inf/infinformation/detailByIdLock',
    method: 'get',
    params,
  });
}

// 根据资讯id解锁
export function unlockNewsById(id) {
  return request({
    url: '/expert/inf/infinformation/releaseLock',
    method: 'delete',
    params: { id },
  });
}

// 根据爬虫资讯id解锁
export function unlockCrawlerNewsById(id) {
  return request({
    url: 'expert/inf/infcrawler/releaseLock',
    method: 'delete',
    params: { id },
  });
}

// 热门资讯封面图-列表查询
export function getAppCoverList(params) {
  return request({
    url: '/expert/inf/infCoverImage/listPage',
    method: 'get',
    params,
  });
}

// 热门资讯封面图-新增
export function addAppCover(data) {
  return request({
    url: '/expert/inf/infCoverImage',
    method: 'post',
    data,
  });
}

// 热门资讯封面图-修改
export function updateAppCover(data) {
  return request({
    url: '/expert/inf/infCoverImage',
    method: 'put',
    data,
  });
}

// 热门资讯封面图-下架
export function saleOutAppCover({ id = '' }) {
  return request({
    url: `/expert/inf/infCoverImage/off/${id}`,
    method: 'put',
  });
}

// 评论详情 - 阿里云过滤敏感词列表
export function getCommentList(params) {
  return request({
    url: '/expert/inf/infcomment/getInfCommentList',
    method: 'get',
    params,
  });
}

// 评论详情 - 阿里云过滤敏感词列表 - 显示&隐藏
export function changeStatus(data) {
  return request({
    url: '/expert/inf/infcomment/audit',
    method: 'put',
    data,
  });
}

// 获取资讯模板内容
export function getCrawlerContentById(id) {
  return request({
    url: '/expert/inf/infcrawler/detail',
    method: 'get',
    params: { id },
  });
}
