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

// 交易模块
const orderManageRouter = {
    path: '/order-manage',
    component: Layout,
    redirect: 'noredirect',
    name: 'transactionManage',
    alwaysShow: true,
    meta: {
        title: 'orderManage',
        icon: 'order-manage',
        noCache: false,
        breadcrumb: true,
    },
    children: [
        {
            // 订单管理
            path: 'list',
            component: () => import('@/views/order/list.vue'),
            name: 'OrderList',
            meta: {
                roles: ['trade:order:select'],
                title: 'orderManage',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 订单管理 - 订单详情
            path: 'list/details/:id',
            component: () => import('@/views/order/list-details.vue'),
            name: 'OrderListDetails',
            hidden: true,
            meta: {
                roles: ['trade:order:select'],
                title: 'orderDetails',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 虚拟币
            path: 'virtual-currency',
            component: () => import('@/views/order/virtual-currency.vue'),
            name: 'OrderVirtualCurrency',
            meta: {
                roles: ['trade:vc:select'],
                title: 'virtualCurrency',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 开票管理
            path: 'invoice-manage',
            component: () => import('@/views/order/invoice.vue'),
            name: 'OrderInvoice',
            meta: {
                roles: ['trade:invoice:select'],
                title: 'invoiceManage',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 开票管理 - 新建开票
            path: 'invoice-manage/add',
            component: () => import('@/views/order/invoice-add.vue'),
            name: 'OrderInvoiceAdd',
            hidden: true,
            meta: {
                roles: ['trade:invoice:save'],
                title: 'invoiceAdd',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 开票管理 - 开票详情
            path: 'invoice-manage/detais/:id',
            component: () => import('@/views/order/invoice-details.vue'),
            name: 'OrderInvoiceDetails',
            hidden: true,
            meta: {
                roles: ['trade:invoice:select'],
                title: 'invoiceDetails',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 退款管理
            path: 'refund-manage',
            component: () => import('@/views/order/refund.vue'),
            name: 'OrderRefund',
            meta: {
                roles: ['trade:refund:select'],
                title: 'refundManage',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 退款管理 - 新建退款
            path: 'refund-manage/add/',
            component: () => import('@/views/order/refund-add.vue'),
            name: 'OrderRefundAdd',
            hidden: true,
            meta: {
                roles: ['trade:refund:save'],
                title: 'refundAdd',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 退款管理 - 退款详情
            path: 'refund-manage/details/:id',
            component: () => import('@/views/order/refund-details.vue'),
            name: 'OrderRefundDetails',
            hidden: true,
            meta: {
                roles: ['trade:refund:select'],
                title: 'refundDetails',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 财务结算 
            path: 'financial-settlement',
            component: () => import('@/views/order/financial-settlement.vue'),
            name: 'FinancialSettlement',
            hidden: false,
            meta: {
                roles: ['trade:settlementBill:select'],
                title: 'financialSettlement',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 结算详情
            path: 'settlement-details/details/:id/:settlementNo',
            component: () => import('@/views/order/settlement-details.vue'),
            name: 'SettlementDetails',
            hidden: true,
            meta: {
                roles: ['trade:settlementBill:select'],
                title: 'settlementDetails',
                noCache: false,
                breadcrumb: true,
            },
        },
        {
            // 已结算详情
            path: 'already-settlement/details/:id/:settlementNo',
            component: () => import('@/views/order/already-settlement-details.vue'),
            name: 'AlreadySettlementDetails',
            hidden: true,
            meta: {
                roles: ['trade:settlementBill:select'],
                title: 'alreadySettlementDetails',
                noCache: false,
                breadcrumb: true,
            },
        },
    ],
};

export default orderManageRouter;
