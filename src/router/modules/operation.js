import Layout from '@/views/layout/Layout';

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
* */

// 运营管理模块
const operationManageRouter = {
  path: '/operation-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'OperationManage',
  alwaysShow: true,
  meta: {
    title: 'operationManage',
    icon: 'operation-manage',
    noCache: false,
    breadcrumb: true,
  },
  children: [
    // {
    //   // 首页静态页面
    //   path: 'index-static',
    //   component: () => import('@/views/operation/indexstatic.vue'),
    //   name: 'OperationManageIndexstatic',
    //   meta: {
    //     roles: ['operate:portal:page'],
    //     title: 'indexStaticPage',
    //     noCache: false,
    //     breadcrumb: true,
    //   },
    // },
    {
      // 首页轮播图
      path: 'index-slideshow',
      component: () => import('@/views/operation/slideshow.vue'),
      name: 'OperationManageSlideshow',
      meta: {
        roles: ['operate:portal:banner'],
        title: 'indexSlideshow',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 首页轮播图 - 新建首页轮播图
      path: 'index-slideshow/add',
      component: () => import('@/views/operation/slideshow-add.vue'),
      name: 'OperationManageSlideshowAdd',
      hidden: true,
      meta: {
        roles: ['operate:portal:banner'],
        title: 'slideshowAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 首页轮播图 - 编辑首页轮播图
      path: 'index-slideshow/edit/:id',
      component: () => import('@/views/operation/slideshow-edit.vue'),
      name: 'OperationManageSlideshowEdit',
      hidden: true,
      meta: {
        roles: ['operate:portal:banner'],
        title: 'slideshowEdit',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 首页轮播图 - 新建大家在学
      path: 'index-slideshow/all/add',
      component: () => import('@/views/operation/slideshow-all-add.vue'),
      name: 'OperationManageSlideshowAllAdd',
      hidden: true,
      meta: {
        roles: ['operate:portal:banner'],
        title: 'slideshowAllAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 首页轮播图 - 编辑首页轮播图
      path: 'index-slideshow/all/edit/:id',
      component: () => import('@/views/operation/slideshow-all-edit.vue'),
      name: 'OperationManageSlideshowAllEdit',
      hidden: true,
      meta: {
        roles: ['operate:portal:banner'],
        title: 'slideshowAllEdit',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 首页好课推荐
      path: 'index-course',
      component: () => import('@/views/operation/index-course.vue'),
      name: 'OperationManageIndexCourse',
      meta: {
        roles: ['operate:portal:commend'],
        title: 'indexNiceCourseRecommend',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 首页类目商品推荐
      path: 'index-goods',
      component: () => import('@/views/operation/index-goods.vue'),
      name: 'OperationManageIndexGoods',
      meta: {
        roles: ['operate:portal:goods'],
        title: 'indexNiceGoodsRecommend',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 首页广告
      path: 'index-ad',
      component: () => import('@/views/operation/index-ad.vue'),
      name: 'OperationManageIndexAD',
      meta: {
        roles: ['operate:portal:ad'],
        title: 'indexAD',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 秒杀活动
      path: 'fastest-buy',
      component: () => import('@/views/operation/fastestbuy.vue'),
      name: 'OperationManageFastestbuy',
      meta: {
        roles: ['operate:seckill:select'],
        title: 'fastestBuy',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 秒杀活动 - 新建秒杀活动
      path: 'fastest-buy/add',
      component: () => import('@/views/operation/fastestbuy-add.vue'),
      name: 'OperationManageFastestbuyAdd',
      hidden: true,
      meta: {
        roles: ['operate:seckill:save'],
        title: 'fastestbuyActivityAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 秒杀活动 -编辑秒杀活动
      path: 'fastest-buy/edit/:id',
      component: () => import('@/views/operation/fastestbuy-edit.vue'),
      name: 'OperationManageFastestbuyEdit',
      hidden: true,
      meta: {
        roles: ['operate:seckill:update'],
        title: 'fastestbuyActivityEdit',
        noCache: true,
        breadcrumb: true,
      },
    },
    {
      // 限时抢购活动
      path: 'time-buy',
      component: () => import('@/views/operation/timebuy.vue'),
      name: 'OperationManageTimebuy',
      meta: {
        roles: ['operate:buy:select'],
        title: 'timeBuy',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 限时抢购活动 - 新建限时抢购活动
      path: 'time-buy/add',
      component: () => import('@/views/operation/timebuy-add.vue'),
      name: 'OperationManageTimebuyAdd',
      hidden: true,
      meta: {
        roles: ['operate:buy:save'],
        title: 'timebuyActivityAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 限时抢购活动 - 编辑限时抢购活动
      path: 'time-buy/edit/:id',
      component: () => import('@/views/operation/timebuy-edit.vue'),
      name: 'OperationManageTimebuyEdit',
      hidden: true,
      meta: {
        roles: ['operate:buy:update'],
        title: 'timebuyActivityEdit',
        noCache: true,
        breadcrumb: true,
      },
    },
    {
      // 积分购买活动
      path: 'credits-buy',
      component: () => import('@/views/operation/creditsbuy.vue'),
      name: 'OperationManageCreditsbuy',
      meta: {
        roles: ['operate:integral:select'],
        title: 'credits',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 积分购买活动 - 新建积分购买活动
      path: 'credits-buy/add',
      component: () => import('@/views/operation/creditsbuy-add.vue'),
      name: 'OperationManageCreditsbuyAdd',
      hidden: true,
      meta: {
        roles: ['operate:integral:save'],
        title: 'creditsbuyActivityAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 积分购买活动 - 编辑积分购买活动
      path: 'credits-buy/edit/:id',
      component: () => import('@/views/operation/creditsbuy-edit.vue'),
      name: 'OperationManageCreditsbuyEdit',
      hidden: true,
      meta: {
        roles: ['operate:integral:update'],
        title: 'creditsbuyActivityEdit',
        noCache: true,
        breadcrumb: true,
      },
    },
    {
      // 敏感词过滤
      path: 'sensitive-filter',
      component: () => import('@/views/operation/sensitive.vue'),
      name: 'OperationManageSensitive',
      meta: {
        roles: ['operate:sensitive:select'],
        title: 'sensitiveFilter',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 敏感词过滤 - 新建敏感词过滤
      path: 'sensitive-filter/add',
      component: () => import('@/views/operation/sensitive-add.vue'),
      name: 'OperationManageSensitiveAdd',
      hidden: true,
      meta: {
        roles: ['operate:sensitive:save'],
        title: 'sensitiveAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 敏感词过滤 - 编辑敏感词过滤
      path: 'sensitive-filter/edit/:id',
      component: () => import('@/views/operation/sensitive-edit.vue'),
      name: 'OperationManageSensitiveEdit',
      hidden: true,
      meta: {
        roles: ['operate:sensitive:update'],
        title: 'sensitiveEdit',
        noCache: true,
        breadcrumb: true,
      },
    },
    {
      // 卡片设置
      path: 'app-card-set',
      component: () => import('@/views/operation/app-card-set.vue'),
      name: 'OperationAppCardSet',
      meta: {
        roles: ['operate:portal:card'],
        title: 'cardSet',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 听课卡 - 列表
      path: 'course-card',
      component: () => import('@/views/operation/course-card.vue'),
      name: 'OperationCourseCard',
      meta: {
        roles: ['operate:course:select'],
        title: 'readyCourseCard',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 听课卡 - 新建
      path: 'course-card/add',
      component: () => import('@/views/operation/course-card-add.vue'),
      name: 'OperationCourseCardAdd',
      hidden: true,
      meta: {
        roles: ['operate:course:save'],
        title: 'readyCourseCardAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 听课卡 - 编辑
      path: 'course-card/edit/:id',
      component: () => import('@/views/operation/course-card-edit.vue'),
      name: 'OperationCourseCardEdit',
      hidden: true,
      meta: {
        roles: ['operate:course:update'],
        title: 'readyCourseCardEdit',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 听课卡 - 发放
      path: 'course-card/use/:id',
      component: () => import('@/views/operation/course-card-use.vue'),
      name: 'OperationCourseCardUse',
      hidden: true,
      meta: {
        roles: ['operate:course:sent'],
        title: 'readyCourseCardUse',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 听课卡 - 详情
      path: 'course-card/details/:id',
      component: () => import('@/views/operation/course-card-details.vue'),
      name: 'OperationCourseCardDetails',
      hidden: true,
      meta: {
        roles: ['operate:course:update'],
        title: 'readyCourseCardDetails',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 拼团
      path: 'fight-groups',
      component: () => import('@/views/operation/fight-groups.vue'),
      name: 'OperationFightGroups',
      meta: {
        roles: ['operate:group:select'],
        title: 'fightGroups',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 拼团 - 新建
      path: 'fight-groups/add',
      component: () => import('@/views/operation/fight-groups-add.vue'),
      name: 'OperationFightGroupsAdd',
      hidden: true,
      meta: {
        roles: ['operate:group:save'],
        title: 'fightGroupsAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 拼团 - 编辑
      path: 'fight-groups/edit/:id',
      component: () => import('@/views/operation/fight-groups-edit.vue'),
      name: 'OperationFightGroupsEdit',
      hidden: true,
      meta: {
        roles: ['operate:group:update'],
        title: 'fightGroupsEdit',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 拼团 - 拼团详情
      path: 'fight-groups/details/:id',
      component: () => import('@/views/operation/fight-groups-details.vue'),
      name: 'OperationFightGroupsDetails',
      hidden: true,
      meta: {
        roles: ['operate:group:select'],
        title: 'fightGroupsDetails',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 拼团 - 参团详情
      path: 'fight-groups/details/one/:id',
      component: () => import('@/views/operation/fight-groups-details-one.vue'),
      name: 'OperationFightGroupsDetailsOne',
      hidden: true,
      meta: {
        roles: ['operate:group:select'],
        title: 'takeFightGroupsDetails',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 落地页管理
      path: 'activity-manage',
      component: () => import('@/views/operation/activity-manage.vue'),
      name: 'OperationActivityManage',
      meta: {
        roles: ['operate:landingPage:select'],
        title: 'activityManage',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 落地页管理 - 新建
      path: 'activity-manage/add',
      component: () => import('@/views/operation/activity-manage-add.vue'),
      name: 'OperationActivityManageAdd',
      hidden: true,
      meta: {
        roles: ['operate:landingPage:save'],
        title: 'addActivity',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 落地页管理 - 编辑
      path: 'activity-manage/edit/:id',
      component: () => import('@/views/operation/activity-manage-edit.vue'),
      name: 'OperationActivityManageEdit',
      hidden: true,
      meta: {
        roles: ['operate:landingPage:update'],
        title: 'editActivity',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 头部玩家活动管理
      path: 'playactivity-manage',
      component: () => import('@/views/operation/playactivity-manage.vue'),
      name: 'OperationPlayActivityManage',
      meta: {
        roles: ['toubu:manager:select'],
        title: 'playactivityManage',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 活动邀请人管理
      path: 'activity-invitation-manage',
      component: () =>
        import('@/views/operation/activity-invitation-manage.vue'),
      name: 'OperationActivityInvitationManage',
      meta: {
        roles: ['invited:manager:select'],
        title: 'activityInvitationManage',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // APP首页管理
      path: 'app-home-page-manage',
      component: () => import('@/views/operation/app-home-page-manage.vue'),
      name: 'AppHomePageManage',
      meta: {
        roles: ['operate:homePage:select'],
        title: 'AppHomePageManage',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 设置首页中部广告
      path: 'app-home-page-manage/set-center-advertising',
      component: () => import('@/views/operation/set-center-advertising.vue'),
      name: 'SetCenterAdvertising',
      hidden: true,
      meta: {
        roles: ['operate:homePage:update'],
        title: 'setCenterAdvertising',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 设置推荐机构
      path: 'app-home-page-manage/set-recommend-organization',
      component: () =>
        import('@/views/operation/set-recommend-organization.vue'),
      name: 'SetRecommendOrganization',
      hidden: true,
      meta: {
        // roles: ['toubu:manager:select'],
        title: 'setRecommendOrganization',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // APP广告管理
      path: 'app-advertising-manage',
      component: () => import('@/views/operation/app-advertising-manage.vue'),
      name: 'AppAdvertisingManage',
      meta: {
        roles: ['operate:ad:info'],
        title: 'AppAdvertisingManage',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 新建广告
      path: 'app-advertising-manage/add',
      component: () => import('@/views/operation/add-advertising.vue'),
      name: 'AddAdvertising',
      hidden: true,
      meta: {
        roles: ['operate:ad:save'],
        title: 'addAdvertising',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 编辑广告
      path: 'app-advertising-manage/edit/:id',
      component: () => import('@/views/operation/edit-advertising.vue'),
      name: 'EditAdvertising',
      hidden: true,
      meta: {
        roles: ['operate:ad:save'],
        title: 'editAdvertising',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 查看广告
      path: 'app-advertising-manage/check/:id',
      component: () => import('@/views/operation/check-advertising.vue'),
      name: 'CheckAdvertising',
      hidden: true,
      meta: {
        roles: ['operate:ad:info'],
        title: 'checkAdvertising',
        noCache: false,
        breadcrumb: true,
      },
    },
  ],
};

export default operationManageRouter;
