import request from '@/utils/request';
import { getLecturersList } from '@/api/lecturers';

// 获取商品列表
export function getGoodsList(params) {
  // for (const key in params) {
  //   if (!params[key]) delete params[key];
  // }
  return request({
    url: '/expert/goods/admin/goods/list',
    method: 'get',
    params,
  });
}

// 一次性获取全部类目
export function goodsCategoryAll(projectType = 1) {
  return request({
    url: '/expert/goods/admin/goodscategory/listAll',
    method: 'get',
    params: {
      projectType,
    },
  });
}

// 根据父id获取类目菜单
export function goodsCategory(goodsCategoryId, projectType = 1) {
  const params = {
    goodsCategoryId,
    projectType,
  };
  return request({
    url: '/expert/goods/admin/goodscategory/getChildrenList',
    method: 'get',
    params,
  });
}

// 新增商品
export function goodsAdd(data = {}) {
  return request({
    url: '/expert/goods/admin/goods/add',
    method: 'post',
    data,
  });
}

// 商品类目 - 列表
export function getGoodsCategoryList(params = Object) {
  return request({
    url: '/expert/goods/admin/goodscategory/list',
    method: 'get',
    params,
  });
}

// 编辑商品
export function goodsEdit(data = {}) {
  return request({
    url: '/expert/goods/admin/goods/update',
    method: 'put',
    data,
  });
}

// 删除商品
export function goodsDelete(ids = Array) {
  return request({
    url: `/expert/goods/admin/goods/deleteByIdList/${ids.join(',')}`,
    method: 'delete',
    // params: {
    //   goodsIdList: ids.join(','),
    // },
  });
}

// 设置商品【推荐 or 不推荐】
export function setGoodsRecommendOrUnRecommend(ids = Array, action = Number) {
  const params = {
    goodsIdList: ids.join(','),
    operateType: action,
  };
  return request({
    url: '/expert/goods/admin/goods/recommendByIdList',
    method: 'put',
    params,
  });
}

// 上下架
export function setGoodsUpOrDown(ids = Array, action = Number) {
  return request({
    url: '/expert/goods/admin/goods/pulishByIdList',
    method: 'put',
    params: {
      goodsIdList: ids.join(','),
      operateType: action,
    },
  });
}

export default {
  // 获取商品列表
  goodsList(params) {
    return request({
      url: '/expert/goods/admin/goods/list',
      method: 'get',
      params,
    });
  },
  // 一次性获取全部类目
  goodsCategoryAll(projectType = 1) {
    return request({
      url: '/expert/goods/admin/goodscategory/listAll',
      method: 'get',
      params: {
        projectType,
      },
    });
  },
};

// 添加商品类目 or 子类目
export function addGoodsCategory({
  projectType = Number,
  name = String,
  sort = Number,
  parentId = '',
  level = 1,
  categoryPicture = String,
  displayState = Number,
}) {
  return request({
    url: '/expert/goods/admin/goodscategory/add',
    method: 'post',
    data: {
      projectType,
      parentId,
      name,
      sort,
      level,
      categoryPicture,
      displayState
      // logo,
      // status,
    },
  });
}

// 删除商品类目(包括子类目)
export function removeCategory(ids = Array) {
  return request({
    url: `/expert/goods/admin/goodscategory/deleteByIdList/${ids.join(',')}`,
    method: 'delete',
  });
}

// 编辑商品子类目
export function editCategory({
  id = Number,
  name = String,
  sort =Number,
  level = 1,
  parentId = Number,
  projectType = Number,
  categoryPicture=String,
  displayState=Number
}) {
  return request({
    url: '/expert/goods/admin/goodscategory/update',
    method: 'put',
    data: {
      id,
      name,
      sort,
      level,
      parentId,
      projectType,
      categoryPicture,
      displayState
    },
  });
}

// 获取讲师接口
export function getLecturerList(params = Object) {
  return getLecturersList({
    pageSize: 20,
    pageNum: params.page,
    lecturerIdList: params.lecturerIdList,
    lecturerName: params.lecturerName,
  });
}

// 根据商品id获取商品详情
export function getGoodsDetailsById(goodsId = Number) {
  return request({
    url: '/expert/goods/admin/goods/getGoodsByGoodsId',
    method: 'get',
    params: {
      goodsId,
    },
  });
}

// 获取课程列表
export function getCourseList(params = Object) {
  return request({
    url: '/expert/goods/admin/school/getCourselist',
    method: 'get',
    params,
  });
}

// 获取商品评价列表
export function getGoodsCommentList({
  goodsName = '',
  goodsCategoryId = '',
  pageNum = 1,
  pageSize = 10,
}) {
  return request({
    url: '/expert/goods/goodsEvaluation/evaluationSumList',
    method: 'post',
    data: {
      goodsName,
      goodsCategoryId,
      pageNum,
      pageSize,
    },
  });
}

// 获取商品评价 - 明细列表
export function getGoodsCommentDetailsList({
  goodsId,
  timeStart = '',
  timeEnd = '',
  status = 0,
  phone = '',
  userName = '',
  pageSize = 10,
  pageNum = 1,
}) {
  return request({
    url: '/expert/goods/goodsEvaluationDetail/getGoodsEvaluationDetailList',
    method: 'post',
    data: {
      goodsId,
      timeStart,
      timeEnd,
      status,
      phone,
      userName,
      pageNum,
      pageSize,
    },
  });
}

// 商品评价明细 - 上架
export function goodsCommentDetailsUp(ids = Array) {
  return request({
    url: '/expert/goods/goodsEvaluationDetail/up',
    method: 'put',
    params: {
      ids: ids.join(','),
    },
  });
}

// 商品评价明细 - 下架
export function goodsCommentDetailsDown(ids = Array) {
  return request({
    url: '/expert/goods/goodsEvaluationDetail/down',
    method: 'put',
    params: {
      ids: ids.join(','),
    },
  });
}

// 商品评价 - 导出
export function getExportGoodsComment({
  goodsName = '',
  goodsCategoryId = '',
}) {
  return request({
    url: '/expert/goods/goodsEvaluation/export',
    method: 'get',
    params: {
      goodsName,
      goodsCategoryId,
    },
  });
}

// 查看视频 - 根据课程id获取课程目录列表
export function getCourseListById(goodsId) {
  return request({
    url: '/expert/goods/api/school/getCourseRecordByGoodsId',
    method: 'get',
    params: {
      goodsId,
    },
  });
}

// 查看视频 - 通过课程第一节的recordId获取播放页地址
export function getPlayUrlByRecordId(recordId) {
  return request({
    url: '/expert/goods/admin/school/vidInfo',
    method: 'get',
    params: {
      recordId,
    },
  });
}

// 改商品类目
export function changeCategory(params = {}) {
  return request({
    url: '/expert/goods/admin/goods/updateGoodsCategoryId',
    method: 'put',
    params,
  });
}

// 第三方机构商品列表
export function getOrgGoodsList(params = {}) {
  return request({
    url: '/expert/goods/admin/goods/getOrgGoodsList',
    method: 'get',
    params,
  });
}

// 审核第三方机构商品
export function checkOrgGoods(data = {}) {
  return request({
    url: '/expert/goods/admin/goods/auditGoods',
    method: 'put',
    data,
  });
}

// 获取第三方讲师接口
export function getLecturerListOrg(params) {
  return request({
    url: '/expert/goods/api/thirdPartyCourse/teachers',
    method: 'get',
    params,
  });
}

// 视频列表
export function getVideosListData(params = {}) {
  return request({
    url: '/expert/goods/api/auth/course/listCourseChapter',
    method: 'get',
    params,
  });
}

// 获取视频token
export function getPreviewVideoToken(params = {}) {
  return request({
    url: '/expert/goods/admin/polyvVideo/getToken',
    method: 'get',
    params,
  });
}

// 下架第三方机构商品
export function saleoutOrgGoods(data = {}) {
  return request({
    url: '/expert/goods/admin/goods/lowerShelfOrgGoods',
    method: 'put',
    data,
  });
}
// 上下架接口
export function upOrDown(data = {}) {
    return request({
      url: '/expert/goods/admin/goodscategory/updateByDisplay',
      method: 'post',
      data,
    });
  }
  