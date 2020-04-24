import request from '@/utils/request';

const apiPre = '';


// 消息模板列表 - 列表
export function getMessageList(params) {
    return request({
        url: apiPre + '/expert/notification/stuMsgTemp/query',
        method: 'get',
        params,
    });
}

// 消息模板内容通过id - 查看内容
export function queryById(id) {
    return request({
        url: apiPre + '/expert/notification/stuMsgTemp/queryById',
        method: 'get',
        params: {
            id,
        },
    });
}


// 消息模板内容通过id - 编辑内容
export function editMsgByid(params) {
    return request({
        url: apiPre + '/expert/notification/stuMsgTemp/updateOne',
        method: 'post',
        params,
    });
}

// 消息模板新增消息模板 - 新增内容
export function insertMsg(params) {
    return request({
        url: apiPre + '/expert/notification/stuMsgTemp/insertOne',
        method: 'post',
        params,
    });
}

// 消息内容列表 - 列表
export function getMessageContentList(params) {
    return request({
        url: apiPre + '/expert/notification/stuMsg/query',
        method: 'get',
        params,
    });
}

export function createdMessageContent(data = Object) {
    return request({
        url: apiPre + '/expert/notification/stuMsg/insertMsgOne',
        method: 'post',
        data,
    });
}

export function updateMessageContent(data = Object) {
    return request({
        url: apiPre + '/expert/notification/stuMsg/updateMsgOne',
        method: 'post',
        data,
    });
}

// 消息内容 - 通过id查看具体消息内容
export function queryContentById(id) {
    return request({
        url: apiPre + '/expert/notification/stuMsg/queryWithFileById',
        method: 'get',
        params: {
            id,
        },
    });
}


// 消息内容 - 通过id删除具体消息内容
export function cancelSendNoticeContentById(id) {
    return request({
        url: apiPre + '/expert/notification/stuMsg/cancelSendNotice',
        method: 'post',
        params: {
            id,
        },
    });
}


// 消息内容 - 通过id获取具体消息内容
export function getContentByid(id) {
    return request({
        url: apiPre + '/expert/notification/stuMsg/queryWithFileById',
        method: 'get',
        params: {
            id,
        },
    });
}


// 消息模板 - 查看所有已经上架的消息模板
export function queryAll(status) {
    return request({
        url: apiPre + '/expert/notification/stuMsgTemp/queryAll',
        method: 'get',
        params: {
            status,
        },
    });
}

// 导出学生模板
export function downloadImportTemp() {
    return request({
        url: apiPre + '/expert/notification/stuMsg/downloadImportTemp',
        method: 'get',
    });
}


// 导入学生模板
export function importSendTemp(data) {
    return request({
        url: apiPre + '/expert/notification/stuMsg/importSendTemp',
        method: 'post',
        data,
    });
}

// 获取自动推送消息列表
export function getAutoPushMsgList(params = Object) {
  return request({
    url: apiPre + '/expert/notification/sysAutoMsgTemp/sendList',
    method: 'get',
    params,
  });
}


// 获取自动推送消息的模板列表
export function getAllTempType() {
  return request({
    url: apiPre + '/expert/notification/sysAutoMsgTemp/allTempType',
    method: 'get',
  });
}
