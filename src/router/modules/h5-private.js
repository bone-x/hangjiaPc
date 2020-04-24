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

// H5私域模块
const h5ManageRouter = {
  path: '/h5-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'H5Manage',
  alwaysShow: true,
  meta: {
    title: 'h5Manage',
    icon: 'lock',
    // noCache: false,
    breadcrumb: true,
  },
  children: [
    {
      // 商品列表
      path: 'h5GoodsList',
      component: () => import('@/views/h5-private/h5-goods-list.vue'),
      name: 'H5GoodsList',
      meta: {
        roles: ['activity:goods:list'],
        title: 'h5GoodsList',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 新建商品
      path: 'h5GoodsList/add',
      component: () => import('@/views/h5-private/h5-goods-add.vue'),
      name: 'H5GoodsAdd',
      hidden: true,
      meta: {
        roles: ['activity:goods:add'],
        title: 'h5GoodsAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 编辑商品
      path: 'h5GoodsList/edit/:id',
      component: () => import('@/views/h5-private/h5-goods-edit.vue'),
      name: 'H5GoodsEdit',
      hidden: true,
      meta: {
        roles: ['activity:goods:update'],
        title: 'h5GoodsEdit',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 商品订单
      path: 'h5GoodsOrder',
      component: () => import('@/views/h5-private/h5-goods-order.vue'),
      name: 'H5GoodsOrder',
      meta: {
        roles: ['trade:ordersiyu:select'],
        title: 'h5GoodsOther',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 订单详情
      path: 'h5GoodsOrder/details/:id',
      component: () => import('@/views/h5-private/h5-order-details.vue'),
      name: 'H5OrderDetails',
      hidden: true,
      meta: {
        roles: ['trade:ordersiyu:detail'],
        title: 'h5OtherDetails',
        noCache: false,
        breadcrumb: true,
      },
    },
  ],
};

export default h5ManageRouter;
