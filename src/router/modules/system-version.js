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

// 系统模块
const systemManageRouter = {
  path: '/system-version',
  component: Layout,
  redirect: 'noredirect',
  name: 'SystemVersion',
  alwaysShow: true,
  meta: {
    title: 'systemVersion',
    icon: 'system-version',
    noCache: false,
    breadcrumb: true,
  },
  children: [
    {
      // 版本管理
      path: 'version-manage',
      component: () => import('@/views/system-version/version-manage.vue'),
      name: 'SystemVersionVersionManage',
      meta: {
        roles: ['version:control:select'],
        title: 'versionManage',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 版本管理 - 新增
      path: 'version-manage/add',
      component: () => import('@/views/system-version/version-manage-add.vue'),
      name: 'SystemVersionVersionManageAdd',
      hidden: true,
      meta: {
        roles: ['version:control:add'],
        title: 'versionAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 版本管理 - 编辑
      path: 'version-manage/edit/:id',
      component: () => import('@/views/system-version/version-manage-edit.vue'),
      name: 'SystemVersionVersionManageEdit',
      hidden: true,
      meta: {
        roles: ['version:control:update'],
        title: 'versionEdit',
        noCache: false,
        breadcrumb: true,
      },
    },
  ],
};

export default systemManageRouter;
