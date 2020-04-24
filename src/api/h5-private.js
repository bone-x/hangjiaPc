import request from '@/utils/request';

// 获取订单列表
export function getOrderPage(params) {
  return request({
    url: '/expert/order/activityOrder/getOrderPage',
    method: 'get',
    params,
  });
}

// 获取订单详情
export function getOrderDetail(params) {
  return request({
    url: '/expert/order/activityOrder/getOrderDetail',
    method: 'get',
    params,
  });
}

// 订单查询导出
export function exportBySelect(params) {
  return request({
    url: '/expert/order/activityOrder/exportBySelect',
    method: 'get',
    params,
  });
}

// 订单列表单个导出
export function exportByOrderIds(params) {
  return request({
    url: '/expert/order/activityOrder/exportByOrderIds',
    method: 'get',
    params,
  });
}

// 商品列表
export function getGoodsList(params) {
  return request({
    url: '/expert/goods/admin/activityGoods/list',
    method: 'get',
    params,
  });
}

// 商品详情
export function getGoodsDetails(id) {
  return request({
    url: '/expert/goods/admin/activityGoods/getActivityGoodsDetail',
    method: 'get',
    params: { goodsId: id },
  });
}

// 新建商品
export function addGoods(data) {
  return request({
    url: '/expert/goods/admin/activityGoods/add',
    method: 'post',
    data,
  });
}

// 编辑商品
export function updateGoods(data) {
  return request({
    url: '/expert/goods/admin/activityGoods/update',
    method: 'put',
    data,
  });
}

// 删除商品
export function deleteGoods(goodsId) {
  return request({
    url: '/expert/goods/admin/activityGoods/delete',
    method: 'delete',
    params: { goodsId },
  });
}

// 生成推广链接
export function getLinks(data) {
  return request({
    url: '/expert/goods/admin/activityGoods/saveOperatorAndLink',
    method: 'post',
    data,
  });
}

// 运营人员列表
export function getOperationalStaff(params) {
  return request({
    url: '/expert/sys/user/listOperationPage',
    method: 'get',
    params,
  });
}

// 获取机构列表
export function getAllOrgList(params) {
  return request({
    url: '/expert/organization/OrgBasicInfo/allOrgInfo',
    method: 'get',
    params,
  });
}

// 获取机构商品列表
export function getAllOrgGoods(params) {
  return request({
    url: '/expert/goods/admin/activityGoods/getHjGoodsList',
    method: 'get',
    params,
  });
}
