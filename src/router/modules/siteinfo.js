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

// 网站信息模块
const siteinfoManageRouter = {
  path: '/siteinfo-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'SiteinfoManage',
  alwaysShow: true,
  meta: {
    title: 'siteinfoManage',
    icon: 'siteinfo',
    noCache: false,
    breadcrumb: true,
  },
  children: [
    // {
    //   // 服务协议
    //   path: 'service-agreement',
    //   component: () => import('@/views/siteinfo/service.vue'),
    //   name: 'SiteinfoService',
    //   meta: {
    //     roles: ['website:protocal:select'],
    //     title: 'serviceAgreement',
    //     noCache: false,
    //     breadcrumb: true,
    //   },
    // },
    // {
    //   // 服务协议 - 编辑
    //   path: 'service-agreement/edit/:id',
    //   component: () => import('@/views/siteinfo/service-edit.vue'),
    //   name: 'SiteinfoServiceEdit',
    //   hidden: true,
    //   meta: {
    //     roles: ['website:protocal:update'],
    //     title: 'serviceAgreementEdit',
    //     noCache: false,
    //     breadcrumb: true,
    //   },
    // },
    // {
    //   // 版权说明
    //   path: 'copyright',
    //   component: () => import('@/views/siteinfo/copyright.vue'),
    //   name: 'SiteinfoCopyright',
    //   meta: {
    //     roles: ['website:copyright:select'],
    //     title: 'editCopyrightHistory',
    //     noCache: false,
    //     breadcrumb: true,
    //   },
    // },
    // {
    //   // 服务协议 - 编辑
    //   path: 'copyright/edit/:id',
    //   component: () => import('@/views/siteinfo/copyright-edit.vue'),
    //   name: 'SiteinfoCopyrightEdit',
    //   hidden: true,
    //   meta: {
    //     roles: ['website:copyright:update'],
    //     title: 'copyrightEdit',
    //     noCache: false,
    //     breadcrumb: true,
    //   },
    // },
    {
      // 新手指南
      path: 'guide',
      component: () => import('@/views/siteinfo/guide.vue'),
      name: 'SiteinfoGuide',
      meta: {
        roles: ['website:guide:select'],
        title: 'userGuide',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 系统文案配置列表
      path: 'system-offical-document',
      component: () => import('@/views/siteinfo/system-offical-document.vue'),
      name: 'SystemOfficalDocument',
      meta: {
        roles: ['web:copywriting:list'],
        title: 'systemOfficalDocument',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 查看文案
      path: 'system-offical-document/check/:id',
      component: () => import('@/views/siteinfo/system-offical-check.vue'),
      name: 'SystemOfficalCheck',
      hidden: true,
      meta: {
        roles: ['web:copywriting:detail'],
        title: 'checkSystemOffical',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 修改文案
      path: 'system-offical-document/edit/:id',
      component: () => import('@/views/siteinfo/system-offical-edit.vue'),
      name: 'SystemOfficalEdit',
      hidden: true,
      meta: {
        roles: ['web:copywriting:update'],
        title: 'editSystemOffical',
        noCache: false,
        breadcrumb: true,
      },
    },
  ],
};

export default siteinfoManageRouter;
