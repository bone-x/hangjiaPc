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

// 入驻管理模块
const settledManageRouter = {
  path: '/settled-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'SettledManage',
  alwaysShow: true,
  meta: {
    title: 'settledManage',
    icon: 'settled',
    noCache: false,
    breadcrumb: true,
  },
  children: [
    // 入驻审核
    {
      path: 'list',
      component: () => import('@/views/settled/settled-list.vue'),
      name: 'SettledManageList',
      meta: {
        roles: ['organization:audit:select'],
        title: 'inTheAudit',
        noCache: false,
        breadcrumb: true,
      },
    },
    // 入驻审核 - 审核
    {
      path: 'settled/details/:id',
      component: () => import('@/views/settled/settled-details.vue'),
      name: 'SettledManageDetails',
      hidden: true,
      meta: {
        roles: ['organization:audit:audit'],
        title: 'settledDetails',
        noCache: false,
        breadcrumb: true,
      },
    },
    // 入驻机构
    {
      path: 'organizition',
      component: () => import('@/views/settled/organizition.vue'),
      name: 'SettledManageOrganizition',
      meta: {
        roles: ['organization:enterList:select'],
        title: 'settledOrganizition',
        noCache: false,
        breadcrumb: true,
      },
    },
    // 入驻机构 - 详情
    {
      path: 'organizition/details/:id',
      component: () => import('@/views/settled/organizition-details.vue'),
      name: 'SettledOrganizationManageDetails',
      hidden: true,
      meta: {
        roles: ['organization:enterList:update'],
        title: 'settledOrgnizitionDetails',
        noCache: false,
        breadcrumb: true,
      },
    },
    // 结算设置
    // {
    //   path: 'Settlement',
    //   component: () => import('@/views/settled/settlement.vue'),
    //   name: 'SettledManageSettlement',
    //   hidden: true,
    //   meta: {
    //     // roles: ['course:record:select'],
    //     title: 'settledsettlement',
    //     noCache: false,
    //     breadcrumb: true,
    //   },
    // },

    // 修改机构协议
    // {
    //   path: 'agreement',
    //   component: () => import('@/views/settled/settled-agreement.vue'),
    //   name: 'SettledManageAgreement',
    //   meta: {
    //     roles: ['organization:audit:select'],
    //     title: 'agreement',
    //     noCache: false,
    //     breadcrumb: true,
    //   },
    // },
  ],
};

export default settledManageRouter;
