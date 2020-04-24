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

// 商品管理模块
const goodsManageRouter = {
    path: '/goods-manage',
    component: Layout,
    redirect: 'noredirect',
    name: 'GoodsManage',
    alwaysShow: true,
    meta: {
        title: 'goodsManage',
        icon: 'goods-manage',
        breadcrumb: true,
    },
    children: [{
        // 商品列表
        path: 'list',
        component: () => import('@/views/goods/goods-list.vue'),
        name: 'GoodsList',
        meta: {
            roles: ['goods:list:select'],
            title: 'goodsList',
            noCache: false,
            breadcrumb: true,
        },
    },
    {
        // 商品列表 - 新建商品
        path: 'list/add',
        component: () => import('@/views/goods/goods-list-add.vue'),
        name: 'GoodsListAdd',
        hidden: true,
        meta: {
            roles: ['goods:list:save'],
            title: 'goodsListAdd',
            breadcrumb: true,
            noCache: true,
        },
    },
    {
        // 商品列表 - 编辑商品
        path: 'list/edit/:id',
        component: () => import('@/views/goods/goods-list-edit.vue'),
        name: 'GoodsListEdit',
        hidden: true,
        meta: {
            roles: ['goods:list:update'],
            title: 'goodsListEdit',
            breadcrumb: true,
        },
    },
    {
        // 商品类目列表
        path: 'type',
        component: () => import('@/views/goods/goods-type.vue'),
        name: 'GoodsType',
        meta: {
            roles: ['goods:category:select'],
            title: 'goodsType',
            noCache: false,
            breadcrumb: true,
        },
    },
    {
        // 商品评价
        path: 'comment',
        component: () => import('@/views/goods/goods-comment.vue'),
        name: 'GoodsComment',
        meta: {
            roles: ['goods:evaluate:select'],
            title: 'goodsComment',
            noCache: false,
            breadcrumb: true,
        },
    },
    {
        // 商品评价 - 详情
        path: 'comment/details/:id',
        component: () => import('@/views/goods/goods-comment-details.vue'),
        name: 'GoodsCommentDetails',
        hidden: true,
        meta: {
            roles: ['goods:evaluate:select'],
            title: 'goodsCommentDetails',
            breadcrumb: true,
            noCache: true,
        },
    },
    {
        // 第三方入驻 - 机构商品
        path: 'organization',
        component: () => import('@/views/goods/organization-goods.vue'),
        name: 'OrganizationGoods',
        hidden: false,
        meta: {
            roles: ['goods:org:select'],
            title: 'organizationGoods',
            breadcrumb: true,
            noCache: true,
        },
    },
    {
        // 第三方入驻 - 机构商品详情
        path: 'organization-goods-details/details/:id',
        component: () => import('@/views/goods/organization-goods-details.vue'),
        name: 'OrganizationGoodsDetails',
        hidden: true,
        meta: {
            roles: ['goods:org:select'],
            title: 'organizationGoodsDetails',
            breadcrumb: true,
            noCache: true,
        },
    },
    {
        // 第三方入驻 - 商品审核
        path: 'goods-verify',
        component: () => import('@/views/goods/goods-verify.vue'),
        name: 'GoodsVerify',
        hidden: false,
        meta: {
            roles: ['goods:audit:select'],
            title: 'goodsVerify',
            breadcrumb: true,
            noCache: true,
        },
    },
    {
        // 第三方入驻 - 待审核 - 详情
        path: 'no-verify/details/:id',
        component: () => import('@/views/goods/no-verify-details.vue'),
        name: 'NoVerifyDetails',
        hidden: true,
        meta: {
            roles: ['goods:audit:select'],
            title: 'noVerifyDetails',
            breadcrumb: true,
            noCache: true,
        },
    },
    {
        // 第三方入驻 - 未通过审核 - 详情
        path: 'pass-verify/details/:id',
        component: () => import('@/views/goods/nopass-verify-details.vue'),
        name: 'NopassVerifyDetails',
        hidden: true,
        meta: {
            roles: ['goods:audit:select'],
            title: 'nopassVerifyDetails',
            breadcrumb: true,
            noCache: true,
        },
    },
    {
        // 第三方入驻 - 商品审核 - 详情
        path: 'verify/details/:id',
        component: () => import('@/views/goods/verify-details.vue'),
        name: 'VerifyDetails',
        hidden: true,
        meta: {
            roles: ['goods:audit:select'],
            title: 'verifyDetails',
            breadcrumb: true,
            noCache: true,
        },
    },
    ],
};
export default goodsManageRouter;
