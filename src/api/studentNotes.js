import request from '@/utils/request';

const apiPre = '';

//  获取笔记列表
export function getStuNoteList(params) {
    return request({
        url: apiPre + '/expert/stuNote/teachNoteList',
        method: 'get',
        params,
    });
}

// 获取笔记详情
export function getNotesDetails(params) {
    return request({
        url: apiPre + '/expert/stuNote/teachNoteDetail',
        method: 'get',
        params,
    });
}


