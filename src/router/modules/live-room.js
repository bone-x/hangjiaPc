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

// 直播间管理模块
const liveRoomManageRouter = {
  path: '/live-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'LiveManage',
  alwaysShow: true,
  meta: {
    title: 'liveManage',
    icon: 'live-room',
    breadcrumb: true,
  },
  children: [
    {
      // 直播间管理
      path: 'list',
      component: () => import('@/views/live-room/live-list.vue'),
      name: 'LiveRoomList',
      meta: {
        roles: ['live:room:select'],
        title: 'liveList',
        noCache: false,
        breadcrumb: true,
      },
    },
    // {
    //     // 直播间 - 新建
    //     path: 'list/add',
    //     component: () => import('@/views/live-room/live-list-add.vue'),
    //     name: 'LiveRoomListAdd',
    //     hidden: true,
    //     meta: {
    //         roles: ['live:room:insert'],
    //         title: 'liveListAdd',
    //         breadcrumb: true,
    //         noCache: true,
    //     },
    // },
    // {
    //     // 直播间 - 编辑
    //     path: 'list/edit/:id',
    //     component: () => import('@/views/live-room/live-list-edit.vue'),
    //     name: 'LiveRoomListEdit',
    //     hidden: true,
    //     meta: {
    //         roles: ['live:room:edit'],
    //         title: 'liveListEdit',
    //         breadcrumb: true,
    //     },
    // },
    // {
    //     // 直播间 - 审核
    //     path: 'check',
    //     component: () => import('@/views/live-room/live-check.vue'),
    //     name: 'LiveRoomCheck',
    //     meta: {
    //         roles: ['live:room:apply:select'],
    //         title: 'liveCheck',
    //         noCache: false,
    //         breadcrumb: true,
    //     },
    // },
  ],
};
export default liveRoomManageRouter;
