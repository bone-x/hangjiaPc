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

// 数据管理模块
const reptileManageRouter = {
    path: '/reptile-manage',
    component: Layout,
    redirect: 'noredirect',
    name: 'ReptileManage',
    alwaysShow: true,
    meta: {
        title: 'reptileManage',
        icon: 'international',
        // noCache: false,
        breadcrumb: true,
    },
    children: [
        {
            // maven列表
            path: 'mavenList',
            component: () => import('@/views/crawling/mavenList.vue'),
            name: 'MavenList',
            meta: {
                roles: ['maven:data:select'],
                title: 'mavenList',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // github列表
            path: 'githubList',
            component: () => import('@/views/crawling/githubList.vue'),
            name: 'GithubList',
            meta: {
                roles: ['github:data:select'],
                title: 'githubList',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // readme
            path: 'crawling/readMe/:id',
            component: () => import('@/views/crawling/readMe.vue'),
            name: 'ReadMe',
            hidden: true,
            meta: {
                roles: ['github:data:select'],
                title: 'readMe',
                noCache: false,
                breadcrumb: true,
            },
        },
    ],
};

export default reptileManageRouter;
