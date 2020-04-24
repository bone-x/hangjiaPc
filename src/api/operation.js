import request from '@/utils/request';

const apiPre = '';

// 首页轮播图
// 首页轮播图 - 新增
export function slideAdd(data = {}) {
  return request({
    url: '/expert/operate/oproundpicture/add',
    method: 'post',
    data,
  });
}

// 首页轮播图 - 修改
export function slideUpdata(data = {}) {
  return request({
    url: '/expert/operate/oproundpicture/update',
    method: 'put',
    data,
  });
}

// 首页轮播图 - 上移
export function slideToUp(id = Number) {
  return request({
    url: `/expert/operate/oproundpicture/moveUp?id=${id}`,
    method: 'put',
  });
}

// 首页轮播图 - 下移
export function slideToDown(id = Number) {
  return request({
    url: `/expert/operate/oproundpicture/moveDown?id=${id}`,
    method: 'put',
  });
}

// 首页轮播图 - 删除
export function slideDelete(id = Number) {
  return request({
    url: `/expert/operate/oproundpicture/delete?id=${id}`,
    method: 'delete',
  });
}

// 首页轮播图 - 列表
export function slideList(params) {
  return request({
    url: '/expert/operate/oproundpicture/getList',
    method: 'get',
    params,
  });
}

// 首页轮播编辑-获取对应编辑对象
export function inquireId(id = Number) {
  return request({
    url: `/expert/operate/oproundpicture/selectById?id=${id}`,
    method: 'get',
  });
}

// 首页轮播图 - 修改
export function slideToEdit(
  effectiveType = Number,
  id = Number,
  imgUrl = String,
  jumpUrl = String,
  title = String,
  typesOf = Number
) {
  return request({
    url: '/expert/operate/oproundpicture/update',
    methods: 'put',
    params: {
      effectiveType,
      id,
      imgUrl,
      jumpUrl,
      title,
      typesOf,
    },
  });
}

// 大家都在学
// 大家都在学 - 新增
export function allStudyAdd(data = {}) {
  return request({
    url: '/expert/operate/opeveryonelearning/add',
    method: 'post',
    data,
  });
}

// 大家都在学 - 修改
export function allStudyUpdate(data = {}) {
  return request({
    url: '/expert/operate/opeveryonelearning/update',
    method: 'put',
    data,
  });
}

// 大家都在学 - 上移
export function allStudyUp(id = Number) {
  return request({
    url: `/expert/operate/opeveryonelearning/moveUp?id=${id}`,
    method: 'put',
  });
}

// 大家都在学 - 下移
export function allStudyDown(id = Number) {
  return request({
    url: `/expert/operate/opeveryonelearning/moveDown?id=${id}`,
    method: 'put',
  });
}

// 大家都在学 - 删除
export function allStudyDelete(id = Number) {
  return request({
    url: `/expert/operate/opeveryonelearning/delete?id=${id}`,
    method: 'delete',
  });
}

// 大家都在学 - 列表
export function allStudyList(params) {
  return request({
    url: '/expert/operate/opeveryonelearning/getList',
    method: 'get',
    params: Object.assign(
      {
        pageNum: 1,
        pageSize: 10,
      },
      params
    ),
  });
}

// 大家在学根据ID查询
export function checkAllStudyId(id) {
  return request({
    url: `/expert/operate/opeveryonelearning/selectById?id=${id}`,
    method: 'get',
  });
}

// 广告位配置-新建
export function addAdvertisement(data = {}) {
  return request({
    url: '/expert/operate/opadvertisement/add',
    method: 'post',
    data,
  });
}

// 广告位配置-列表
export function advertisementList() {
  return request({
    url: '/expert/operate/opadvertisement/list',
    method: 'get',
  });
}

// 广告位配置-根据ID查询
export function advertisementCheckId(id) {
  return request({
    url: `/expert/operate/opadvertisement/selectById?id=${id}`,
    method: 'get',
  });
}

// 广告位配置-上移
export function advertisementUp(id) {
  return request({
    url: `/expert/operate/opadvertisement/moveUp?id=${id}`,
    method: 'put',
  });
}

// 广告位配置-下移
export function advertisementDown(id) {
  return request({
    url: `/expert/operate/opadvertisement/moveDown?id=${id}`,
    method: 'put',
  });
}

// 广告位配置-删除
export function advertisementDelete(id) {
  return request({
    url: `/expert/operate/opadvertisement/delete?id=${id}`,
    method: 'delete',
  });
}

// 广告位配置修改
export function advertisementEdit(data = {}) {
  return request({
    url: '/expert/operate/opadvertisement/update',
    method: 'put',
    data,
  });
}

// 首页类目商品推荐
// 商品类目新增
export function goodRecommandAdd(data = {}) {
  return request({
    url: '/expert/operate/opcategorygoods/add',
    method: 'post',
    data,
  });
}

// 商品类目推荐 - 上移
export function goodRecommandUp(id = Number) {
  return request({
    url: `/expert/operate/opcategorygoods/moveUp?id=${id}`,
    method: 'put',
  });
}

// 商品类目推荐 - 下移
export function goodRecommandDown(id = Number) {
  return request({
    url: `/expert/operate/opcategorygoods/moveDown?id=${id}`,
    method: 'put',
  });
}

// 商品类目推荐 - 删除
export function goodRecommandDelete(id = Number) {
  return request({
    url: `/expert/operate/opcategorygoods/delete?id=${id}`,
    method: 'delete',
  });
}

// 商品类目推荐 - 列表
export function goodRecommandList() {
  return request({
    url: '/expert/operate/opcategorygoods/list',
    method: 'get',
  });
}

// 秒杀/限时抢购/积分-分页查询
export function fastestBuyPage({
  pageNum = 1,
  pageSize = 10,
  type = '',
  goodsName = '',
  status = '',
  publishStatus = '',
}) {
  return request({
    url: '/expert/operate/opactivity/listPage',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      type,
      goodsName,
      status,
      publishStatus,
    },
  });
}

// 秒杀/限时抢购/积分 - 单个查询
export function fastestSingleCheck(id) {
  return request({
    url: `/expert/operate/opactivity/info/${id}`,
    method: 'get',
  });
}

// 秒杀/限时抢购/积分 - 编辑
export function fastestEdit(data = {}) {
  return request({
    url: '/expert/operate/opactivity/update',
    method: 'put',
    data,
  });
}

// 秒杀/限时抢购/积分 - 保存
export function fastestSave(data = {}) {
  return request({
    url: '/expert/operate/opactivity/save',
    method: 'post',
    data,
  });
}

// 秒杀/限时抢购/积分 - 删除
export function fastestDelete(id) {
  return request({
    url: `/expert/operate/opactivity/delete/${id}`,
    method: 'delete',
  });
}

// 秒杀/限时抢购/积分 - 上架
export function goodOnsale(id) {
  return request({
    url: `/expert/operate/opactivity/upperShelf/${id}`,
    method: 'post',
  });
}

// 秒杀/限时抢购/积分 - 下架
export function goodLowerSale(id) {
  return request({
    url: `/expert/operate/opactivity/lowerShelf/${id}`,
    method: 'post',
  });
}

// 活动（秒杀/限时抢购/积分）-查看详情
export function checkDetailActivity({
  activityId = '',
  pageNum = 1,
  pageSize = 10,
  nickName = '',
  status2 = '',
}) {
  return request({
    url: '/expert/order/pmorderdetail/listPage',
    method: 'get',
    params: {
      activityId,
      pageNum,
      pageSize,
      nickName,
      status2,
    },
  });
}

// 活动（秒杀/限时抢购/积分）- 导出详情
export function exportActivityData(activityId) {
  return request({
    url: `/expert/order/pmorderdetail/exportByActivity?activityId=${activityId}`,
    method: 'get',
  });
}

// 根据类目ID和商品名称获取商品列表

export function getDialogGoodsList(params) {
  return request({
    url: '/expert/goods/admin/goods/getListByCategoryIdAndGoodsName',
    methods: 'get',
    params: Object.assign(
      {
        pageNum: 1,
        pageSize: 10,
        name: '',
        goodsCategoryId: '',
        projectType: 1,
      },
      params
    ),
  });
}

// 敏感词新增
export function sensitiveAdd(type = Number, word = String) {
  const data = {
    type,
    word,
  };
  return request({
    url: '/expert/operate/opsensitiveword/add',
    method: 'post',
    data,
  });
}

// 敏感词批量新增
export function sensitiveAddMore(data) {
  return request({
    url: '/expert/operate/opsensitiveword/addList',
    method: 'post',
    data,
  });
}

// 敏感词列表查询
export function sensitiveCheckList(data = {}) {
  return request({
    url: '/expert/operate/opsensitiveword/list',
    method: 'post',
    data,
  });
}

// 敏感词类型修改
export function sensitiveChangeType({ id, type }) {
  return request({
    url: '/expert/operate/opsensitiveword/updateType',
    method: 'put',
    params: {
      id,
      type,
    },
  });
}

// 敏感词删除
export function sensitiveDelete(id) {
  return request({
    url: `/expert/operate/opsensitiveword/delete?id=${id}`,
    method: 'delete',
  });
}

// 检测敏感词
export function sensitiveLookingFor(text = String) {
  const data = text;
  return request({
    url: '/expert/operate/sensitiverecord/examine',
    method: 'put',
    data,
  });
}

// 检测敏感词返回信息
export function getSensitiveInfo(params) {
  return request({
    url: '/expert/operate/sensitiverecord/examine',
    method: 'get',
    params,
  });
}
// 敏感词命中记录详情
// 检测敏感词
export function sensitiveChoose(data = {}) {
  return request({
    url: '/expert/operate/opsensitiverecord/list',
    method: 'post',
    data,
  });
}

// 敏感词导出excel
export function exportSensitive(sensitiveWordId) {
  return request({
    url: `/opsensitiverecord/export?sensitiveWordId=${sensitiveWordId}`,
    method: 'get',
    baseURL: 'http://rap2api.taobao.org/app/mock/160668/',
  });
}

// 好课推荐
// 好课推荐新增
export function goodCourseAdd(data = {}) {
  return request({
    url: '/expert/operate/opgoodlesson/add',
    method: 'post',
    data,
  });
}

// 好课推荐列表
export function goodCourseList(params) {
  return request({
    url: '/expert/operate/opgoodlesson/list',
    method: 'get',
    params,
  });
}

// 好课推荐排序上移
export function goodCourseUp(id = Number) {
  return request({
    url: `/expert/operate/opgoodlesson/moveUp?id=${id}`,
    method: 'put',
  });
}

// 好课推荐排序下移
export function goodCourseDown(id = Number) {
  return request({
    url: `/expert/operate/opgoodlesson/moveDown?id=${id}`,
    method: 'put',
  });
}

// 好课推荐批量调整顺序
export function goodCourseSort(ids = Array) {
  return request({
    url: `/expert/operate/opgoodlesson/updateSort?ids=${ids}`,
    method: 'put',
  });
}

// 好课推荐删除
export function goodCourseDelete(id = Number) {
  return request({
    url: `/expert/operate/opgoodlesson/delete?id=${id}`,
    method: 'delete',
  });
}

// 卡片设置列表（app）
export function getCardSetList() {
  return request({
    url: '/expert/operate/opCart/listPage',
    method: 'get',
  });
}

// 卡片设置列表 - 编辑（app）
export function getCardSetEdit(data = Object) {
  return request({
    url: '/expert/operate/opCart/update',
    method: 'put',
    data,
  });
}

// 听课卡列表 - 详情 - lujunan 1.2迭代
export function getGiftCardDetailsList(params) {
  return request({
    url: '/expert/operate/opCourseCard/getEntitylist',
    method: 'get',
    params,
  });
}

// 听课卡列表 - 详情 - 上下架
export function getGiftCardDetailsPutaway(params) {
  return request({
    url: '/expert/operate/opCourseCard/publish',
    method: 'put',
    params,
  });
}

// 听课卡列表 - 详情 - 删除
export function DetailsListDelete(option) {
  return request({
    url: `/expert/operate/opCourseCard/delete/${option.courseCardIdQUERY}`,
    method: 'delete',
  });
}

// 听课卡列表 - 数据
export function getGiftCardDataList(params) {
  return request({
    url: '/expert/operate/opCourseCard/statisPage',
    method: 'get',
    params,
  });
}

// 获取拼团列表
export function getFightGroupsList({
  activityStatus = 0,
  groupName = '',
  pageNum = 1,
  pageSize = 20,
}) {
  return request({
    url: apiPre + '/expert/operate/opGroup/getList',
    method: 'get',
    params: {
      activityStatus,
      groupName,
      pageNum,
      pageSize,
    },
  });
}

// 创建拼团
export function createFightGroup(data = Object) {
  return request({
    url: apiPre + '/expert/operate/opGroup',
    method: 'post',
    data,
  });
}

// 编辑拼团
export function editFightGroups(data = Object) {
  return request({
    url: apiPre + '/expert/operate/opGroup',
    method: 'put',
    data,
  });
}

// 删除拼团
export function deleteFightGroups(ids = Array) {
  return request({
    url: '/expert/operate/opGroup/' + ids.join(','),
    method: 'delete',
  });
}

// 拼团 - 上下架
export function changeFightGroupsUpAndDown(ids = Array, publishStatus = 2) {
  return request({
    url: apiPre + '/expert/operate/opGroup/publishStatus',
    method: 'put',
    params: {
      groupIds: ids.join(','),
      publishStatus,
    },
  });
}

// 拼团 - 团总览信息
export function getFightGroupInfo(groupId) {
  return request({
    url: apiPre + '/expert/operate/opGroup/groupOverview',
    method: 'get',
    params: {
      groupId,
    },
  });
}

// 拼团 - 团中商品列表
export function getFightGroupGoodsList({
  groupId,
  goodsName = '',
  sortOrder = 'desc',
  goodsCategoryId = 0,
  pageNum = 1,
  pageSize = 20,
}) {
  return request({
    url: apiPre + '/expert/operate/opGroup/detailList',
    method: 'get',
    params: {
      groupId,
      goodsName,
      sortOrder,
      goodsCategoryId,
      pageNum,
      pageSize,
    },
  });
}

// 拼团 - 团中商品详情
export function getFightGroupGoodDetails({
  groupId,
  goodsTemplateId,
  status = 0,
  text = '',
  pageNum = 1,
  pageSize = 20,
}) {
  return request({
    url: apiPre + '/expert/operate/opGroupDetail/detailList',
    method: 'get',
    params: {
      groupId,
      goodsTemplateId,
      status,
      text,
      pageNum,
      pageSize,
    },
  });
}

// 拼团 - 团中商品详情 - 导出
export function exportFightGroupGoodsDetails(groupId, goodsTemplateId) {
  return request({
    url: apiPre + '/expert/operate/opGroupDetail/export',
    method: 'get',
    params: {
      groupId,
      goodsTemplateId,
    },
  });
}

// 拼团 - 信息
export function getFightGroupInfoById(groupId) {
  return request({
    url: apiPre + '/expert/operate/opGroup/' + groupId,
    method: 'get',
  });
}

// 活动落地页 - 列表
export function getActivityList({
  activityName = '',
  pageNum = 1,
  pageSize = 20,
}) {
  return request({
    url: apiPre + '/expert/operate/OpLandingPage/listPage',
    method: 'get',
    params: {
      activityName,
      pageNum,
      pageSize,
    },
  });
}

// 活动落地页 - 创建活动
export function createActivity(data = Object) {
  return request({
    url: apiPre + '/expert/operate/OpLandingPage/save',
    method: 'post',
    data,
  });
}

// 活动落地页 - 编辑
export function editActivity(data = Object) {
  return request({
    url: apiPre + '/expert/operate/OpLandingPage/update',
    method: 'put',
    data,
  });
}

// 活动落地页 - 删除
export function deleteActivity(id = String) {
  return request({
    url: apiPre + '/expert/operate/OpLandingPage/delete/' + id,
    method: 'delete',
  });
}

// 活动落地页 - 上架
export function setActivityUp(id = String) {
  return request({
    url: apiPre + '/expert/operate/OpLandingPage//upperShelf/' + id,
    method: 'put',
  });
}

// 活动落地页 - 下架
export function setActivityDown(id = String) {
  return request({
    url: apiPre + '/expert/operate/OpLandingPage/downShelf/' + id,
    method: 'put',
  });
}

// 活动落地页 - 根据id获取活动信息
export function getActivityById(id = String) {
  return request({
    url: apiPre + '/expert/operate/OpLandingPage/' + id,
    method: 'get',
  });
}

// 听课卡列表 - 新建
export function AddDataDetails(data) {
  return request({
    url: '/expert/operate/opCourseCard/save',
    method: 'post',
    data,
  });
}

// 听课卡列表 - 编辑
export function editDataDetails(data) {
  return request({
    url: '/expert/operate/opCourseCard/update',
    method: 'put',
    data,
  });
}

// 听课卡 - 数据详情 - 列表
export function getDataDetailsList(params) {
  return request({
    url: '/expert/operate/opCourseSentLog/listPage',
    method: 'get',
    params,
  });
}

// 听课卡 - 数据详情 - 持有人数弹窗|发放人数弹窗 - 列表
export function getHoldOutSumList(params) {
  return request({
    url: '/expert/operate/opCourseStudent/pageStatis',
    method: 'get',
    params,
  });
}

// 听课卡 - 数据详情 - 持有人数弹窗|发放人数弹窗 - 导出
export function getExcelExport(params) {
  return request({
    url: '/expert/operate/opCourseStudent/exportStatis',
    method: 'get',
    params,
  });
}

// 听课卡 - 通过id获取听课卡数据
export function getCourseCardId(params) {
  return request({
    url: '/expert/operate/opCourseCard/getEntityById',
    method: 'get',
    params,
  });
}

// 听课卡 - 发放
export function provideCourseCardList(data) {
  return request({
    url: '/expert/operate/opCourseSentLog/sent',
    method: 'post',
    data,
  });
}

// 听课卡 - 发放 -发送对象(指定用户)
export function provideCourseCardObj(params) {
  return request({
    url: '/expert/stu/student/recipientList',
    method: 'get',
    params,
  });
}

// 听课卡 - 发放 -发送对象(批量导入)
export function provideCourseCardImport(data, fileId) {
  return request({
    url: `/expert/operate/opCourseSentLog/sentImport?fileId=${fileId}`,
    method: 'post',
    data,
  });
}

// 听课卡 - 发放 -发送对象(下载模板)
export function provideImportExcel(data) {
  return request({
    url: '/expert/operate/opCourseSentLog/sentTemplate',
    method: 'post',
    data,
  });
}
// 头部玩家 - 导入
export function headPlayGetUpload(data, fileId) {
  return request({
    url: `/expert/operate/OpActiveFeedback/sentImport?fileId=${fileId}`,
    method: 'post',
    data,
  });
}

// 头部玩家 - 下载模板
export function headPlayImportExcel(data) {
  return request({
    url: '/expert/operate/OpActiveFeedback/sentTemplate',
    method: 'post',
    data,
  });
}

// 头部玩家 - 列表数据
export function getHeadPlayListData(params) {
  return request({
    url: '/expert/operate/OpActiveFeedback/list',
    method: 'get',
    params,
  });
}

// 弹窗的确认接口
export function checkSure(data) {
  return request({
    url: '/expert/operate/OpActiveFeedback/auth',
    method: 'post',
    data,
  });
}

// 头部玩家 - 确认导出Excel
export function uploadExcelData(params) {
  return request({
    url: '/expert/operate/OpActiveFeedback/confirm',
    method: 'get',
    params,
  });
}

// 活动邀请人 - 列表
export function getActivityInvitationList(params) {
  return request({
    url: apiPre + '/expert/operate/OpNewRegister/huaWeiActivity/participants',
    method: 'get',
    params,
  });
}

// 活动邀请人 - 根据id指定用户的具体邀请人数
export function getPersonInvitation(params) {
  return request({
    url: apiPre + '/expert/operate/OpNewRegister/huaWeiActivity/pulledUser',
    method: 'get',
    params,
  });
}

// 活动邀请人 - 手动关联邀请人
export function setPersonInvitation(data = Object) {
  return request({
    url: apiPre + '/expert/operate/OpNewRegister//huaWeiActivity/relationship',
    method: 'post',
    data,
  });
}

// APP广告管理列表
export function getAppManageList(params) {
  return request({
    url: apiPre + '/expert/operate/api/admin/ad/getADList',
    method: 'get',
    params,
  });
}

// APP广告管理 - 删除
export function deleteAppData(params) {
  return request({
    url: apiPre + '/expert/operate/api/admin/ad/deleteADById',
    method: 'delete',
    params,
  });
}

// APP广告管理 - 查看详情
export function getAppDetails(params) {
  return request({
    url: apiPre + '/expert/operate/api/admin/ad/getADDetailById',
    method: 'get',
    params,
  });
}

// APP广告新建/编辑
export function createAppAdvertisment(data) {
  return request({
    url: apiPre + '/expert/operate/api/admin/ad/insertOrUpdateAD',
    method: 'post',
    data,
  });
}

// APP首页版块管理列表 -> 回显设置中部广告位数据
export function appAdvertismentTemplate() {
  return request({
    url: apiPre + '/expert/operate/api/admin/homepageAd/getAD',
    method: 'get',
  });
}

// 设置首页中部广告位 -> 保存
export function setHomePageAdvertisment(data) {
  return request({
    url: apiPre + '/expert/operate/api/admin/homepageAd/insertOrUpdateAD',
    method: 'post',
    data,
  });
}

// APP首页版块管理->列表
export function appTemplateManage() {
  return request({
    url: apiPre + '/expert/operate/api/admin/OpAppHomepage',
    method: 'get',
  });
}

// APP首页版块管理 -> 显示/隐藏
export function showOrHide({ id, displayStatus }) {
  return request({
    url:
      apiPre +
      `/expert/operate/api/admin/OpAppHomepage?id=${id}&displayStatus=${displayStatus}`,
    method: 'put',
  });
}

// APP首页版块管理 -> 保存机构推荐
export function comfirmOrganization(data) {
  return request({
    url: apiPre + '/expert/operate/api/admin/OpAppHomepageOrg',
    method: 'post',
    data,
  });
}

// APP首页版块管理 -> 机构推荐列表
export function recommandOrgList() {
  return request({
    url: apiPre + '/expert/operate/api/admin/OpAppHomepageOrg',
    method: 'get',
  });
}

// APP首页版块管理 -> 机构推荐列表上下移
export function orgListUpOrDown({ id, sort }) {
  return request({
    url:
      apiPre +
      `/expert/operate/api/admin/OpAppHomepageOrg/updateSortById?id=${id}&sort=${sort}`,
    method: 'post',
  });
}

// APP首页版块管理 -> 机构推荐列表删除
export function orgListToDelete(id) {
  return request({
    url: apiPre + `/expert/operate/api/admin/OpAppHomepageOrg?id=${id}`,
    method: 'delete',
  });
}

// 获取APP内其他页面广告链接
export function getAppJumpLink(params) {
  return request({
    url:
      apiPre + `/expert/operate/api/admin/OpAppCategory/getAppCategoryByName`,
    method: 'get',
    params,
  });
}
export function getAppCategoryByName(params) {
    return request({
      url: apiPre + '/expert/operate/api/admin/OpAppCategory/getAppCategoryByName',
      method: 'get',
      params
    });
  }