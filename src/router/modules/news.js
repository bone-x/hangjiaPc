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

// 资讯模块
const newsManageRouter = {
  path: '/news-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'NewsManage',
  alwaysShow: true,
  meta: {
    title: 'newsManage',
    icon: 'news-manage',
    noCache: false,
    breadcrumb: true,
  },
  children: [{
    // 资讯列表
    path: 'list',
    component: () => import('@/views/news/list.vue'),
    name: 'NewsList',
    meta: {
      roles: ['info:list:select'],
      title: 'newsList',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // 资讯类别管理
    path: 'type-manage',
    component: () => import('@/views/news/type.vue'),
    name: 'NewsType',
    meta: {
      roles: ['info:category:select'],
      title: 'newsTypeManage',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // 爬取资讯管理
    path: 'crawler',
    component: () => import('@/views/news/crawler.vue'),
    name: 'NewsCrawler',
    meta: {
      roles: ['info:crawer:select'],
      title: 'newsCrawlerMange',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // app热门资讯封面
    path: 'hotNewsCover',
    component: () => import('@/views/news/hotNewsCover.vue'),
    name: 'HotNewsCover',
    meta: {
      roles: ['info:image:select'],
      title: 'appHotNewsCover',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // 评论详情 - 阿里云过滤敏感词
    path: 'list/details/:id',
    component: () => import('@/views/news/commentDetails.vue'),
    name: 'CommentDetails',
    hidden: true,
    meta: {
      roles: ['info:comment:select'],
      title: 'aLiYunSensitive',
      noCache: false,
      breadcrumb: true,
    },
  },
  ],
};

export default newsManageRouter;
