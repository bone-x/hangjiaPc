import request from '@/utils/request';

const apiPre = '';

// 获取订单管理列表
export function getOrderList(params) {
    return request({
        url: apiPre + '/expert/order/pmorder/getOrderVoList',
        method: 'get',
        params,
    });
}

// 获取订单详情
export function getOrderDetail(params) {
    return request({
        url: apiPre + '/expert/order/pmorder/getOrderDetail',
        method: 'get',
        params,
    });
}


// 订单管理搜索导出
export function exportSearchOrder(data) {
    return request({
        url: apiPre + 'expert/order/pmorder/exportAll',
        method: 'post',
        data,
    });
}

// 订单管理导出所选的或点击全选
export function exportSingleOrder(params) {
    return request({
        url: apiPre + '/expert/order/pmorder/exportByOrderId',
        method: 'get',
        params,
    });
}

// 订单管理 - 退款管理 - 列表 搜索功能
export function refundList(data) {
    return request({
        url: apiPre + '/expert/order/pmrefund/getRefundManagementVoList',
        method: 'post',
        data,
    });
}

// 订单管理 - 退款管理 - 详情按钮
export function refundDetail(params) {
    return request({
        url: apiPre + '/expert/order/pmrefund/getPmRefundDetailVoById',
        method: 'get',
        params,
    });
}

// 订单管理 - 退款管理 - 审核按钮
export function orderReview(params) {
    return request({
        url: apiPre + '/expert/order/pmrefund/updateRefundStatusById',
        method: 'put',
        params,
    });
}

// 订单管理 - 退款管理 - 新建退款-搜索按钮
export function addRefund(params) {
    return request({
        url: apiPre + '/expert/order/pmrefund/getRefundList',
        method: 'get',
        params,
    });
}

// 订单管理 - 退款管理 - 新建退款-申请退款/重新申请（确认提交按钮）
export function renewApplyRefund(data) {
    return request({
        url: apiPre + '/expert/order/pmrefund/savePmRefund',
        method: 'post',
        data,
    });
}

// 订单管理 - 退款管理 - 新建退款-申请退款/重新申请（行家币）
export function renewApplyRefund2(data) {
    return request({
        url: apiPre + '/expert/order/pmrefund/saveVirtualPmRefund',
        method: 'post',
        data,
    });
}

// 订单管理 - 退款管理 - 详情 - OA编号表单填写提交实现
export function submitOaForm(params) {
    return request({
        url: apiPre + '/expert/order/pmrefund/updatePmRefundOaNoById',
        method: 'put',
        params,
    });
}

// 订单管理 - 退款管理 - 单个和多个导出按钮
export function exportRefundOrder(params) {
    return request({
        url: apiPre + '/expert/order/pmrefund/exportByRefundId',
        method: 'get',
        params,
    });
}

// 订单管理 - 退款管理列表 -查询数据导出excel
export function exportRefundOrderAll(data) {
    return request({
        url: apiPre + '/expert/order/pmrefund/exportAll',
        method: 'post',
        data,
    });
}

// 订单管理 - 退款管理 - 根据订单详情id 查询订单详情
export function turnBackDetail(params) {
    return request({
        url: apiPre + '/expert/order/pmrefund/getPmOrderDetailById',
        method: 'get',
        params,
    });
}

// 订单管理 - 开票管理 - 开票管理页面分页查询开票管理信息
export function BillingList(params) {
    return request({
        url: apiPre + '/expert/order/pminvoice/getInvoiceManagementVoList',
        method: 'get',
        params,
    });
}

// 订单管理 - 开票管理 - 根据订单详情id pmOrderDetailId 查询开票/订单/退款详情
export function BillingDetail(pmOrderDetailId) {
    return request({
        url: apiPre + '/expert/order/pminvoice/getDetailByPmOrderDetailId',
        method: 'get',
        params: pmOrderDetailId,
    });
}

// 开票管理 - 获取开票订单详情
export function getOrderInvoiceDetails(invoiceId) {
    return request({
        url: apiPre + '/expert/order/pminvoice/getInvoiceDetailById',
        method: 'get',
        params: {
            invoiceId,
        },
    });
}

// 订单管理 - 开票管理 - 开票详情->发送邮件
export function BillingSendEmail(invoiceId) {
    return request({
        url: apiPre + '/expert/order/pminvoice/sendEmail',
        method: 'get',
        params: {
            invoiceId,
        },
    });
}

// 订单管理 - 开票管理 - 上传附件
export function BillingUpload(data) {
    return request({
        url: apiPre + '/expert/order/pminvoice/upload',
        method: 'post',
        data,
    });
}

// 订单管理 - 开票管理 - 导出按钮 (选中部分)
export function BillingExportBySelected(ids = []) {
    return request({
        url: apiPre + '/expert/order/pminvoice/exportByInvoiceId',
        method: 'get',
        params: {
            invoiceIds: ids.join(','),
        },
    });
}

// 订单管理 - 开票管理 - 导出按钮（筛选）
export function BillingExportByFilter(data = {}) {
    return request({
        url: apiPre + '/expert/order/pminvoice/exportAll',
        method: 'post',
        data,
    });
}

// 订单管理 - 开票管理 - 新建开票搜索按钮/列表
export function BillingSearch(params) {
    return request({
        url: apiPre + '/expert/order/pminvoice/getInvoiceList',
        method: 'get',
        params,
    });
}

// 订单管理 - 开票管理 - 详情按钮返回开票详情
export function BillingTurnBack(invoiceId) {
    return request({
        url: apiPre + '/expert/order/pminvoice/getInvoiceDetailById',
        method: 'get',
        params: invoiceId,
    });
}

// 订单管理 - 开票管理 -  新建开票>申请开票>确认申请按钮
export function BillingConfirm(data) {
    return request({
        url: apiPre + '/expert/order/pminvoice/savePmInvoice',
        method: 'post',
        data,
    });
}

// 订单管理 - 开票管理 -  新建开票>申请开票按钮实现功能
export function BillingApplyConfirm(pmOrderDetailId) {
    return request({
        url: apiPre + '/expert/order/pminvoice/getInvoiceByPmOrderDetailId',
        method: 'get',
        params: pmOrderDetailId,
    });
}

// 虚拟币账户 - 列表
export function getVirtualCurrencyList(params = Object) {
    return request({
        url: '/expert/stu/student/vcListPage',
        method: 'get',
        params,
    });
}

// 虚拟币账户明细 - 列表
export function getVirtualCurrencyDetailsList(params = Object) {
    return request({
        url: '/expert/stu/stuVcDetail/findByUserId',
        method: 'get',
        params,
    });
}

// 财务结算 - 列表(待结算&已结算)
export function getSettlementList(params = Object) {
    return request({
        url: '/expert/order/pmSettlementBill/getSettlementBillList',
        method: 'get',
        params,
    });
}

// 财务结算详情 - 列表(待结算)
export function getNoSettlementList(params = Object) {
    return request({
        url: '/expert/order/pmSettlementBill/getBillOrderDetail',
        method: 'get',
        params,
    });
}

// 结算详情
export function getSettlementDetail(id) {
    return request({
        url: '/expert/order/pmSettlementBill/getSettlementBillById',
        method: 'get',
        params: { id },
    });
}

// 结算更新（确认结算）
export function settlementUpdate(data) {
    return request({
        url: '/expert/order/pmSettlementBill/updateSettlementBill',
        method: 'post',
        data,
    });
}
