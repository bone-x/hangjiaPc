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

// 数据中心模块
const dataManageRouter = {
  path: '/data-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'DataManage',
  alwaysShow: true,
  meta: {
    title: 'dataCenter',
    icon: 'data-center',
    noCache: false,
    breadcrumb: true,
  },
  children: [
    {
      // 数据统计
      path: 'statistics',
      component: () => import('@/views/data/statistics.vue'),
      name: 'DataStatistics',
      meta: {
        roles: ['data:statistics:select'],
        title: 'dataStatistics',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 流量分析
      path: 'visits',
      component: () => import('@/views/data/visits.vue'),
      name: 'DataVisits',
      meta: {
        roles: ['data:fanalysis:select'],
        title: 'visitsAnalysis',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 用户分析
      path: 'user',
      component: () => import('@/views/data/user.vue'),
      name: 'DataUser',
      meta: {
        roles: ['data:uanalysis:select'],
        title: 'userAnalysis',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 商品分析
      path: 'goods',
      component: () => import('@/views/data/goods.vue'),
      name: 'DataGoods',
      meta: {
        roles: ['data:canalysis:select'],
        title: 'goodsAnalysis',
        noCache: false,
        breadcrumb: true,
      },
    },
  ],
};

export default dataManageRouter;
