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

// 反馈管理模块
const feedbackRouter = {
  path: '/feedback-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'FeedBackManage',
  alwaysShow: true,
  meta: {
    title: 'feedbackManage',
    icon: 'edit',
    noCache: false,
    breadcrumb: true,
  },
  children: [
    {
      // 反馈管理列表
      path: 'feedbackList',
      component: () => import('@/views/feedback/feedbackList.vue'),
      name: 'FeedbackList',
      meta: {
        roles: ['website:webFeedback:select'],
        title: 'feedbackList',
        noCache: false,
        breadcrumb: true,
      },
    },
    // {
    //   // 反馈详情页
    //   path: 'feedbackDetail/:id',
    //   component: () => import('@/views/feedback/feedbackDetail.vue'),
    //   name: 'FeedbackDetail',
    //   hidden: true,
    //   meta: {
    //     // roles: ['stu:note:select'],
    //     title: 'feedbackDetail',
    //     noCache: false,
    //     breadcrumb: true,
    //   },
    // },
  ],
};

export default feedbackRouter;
