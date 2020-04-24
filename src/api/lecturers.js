import request from '@/utils/request';

const apiPre = '';

//  获取讲师列表
export function getLecturersList(params) {
    return request({
        url: apiPre + '/expert/goods/lecturer/listPage',
        method: 'get',
        params,
    });
}

// 删除讲师
export function deleteChosenLectures(ids) {
    return request({
        url: apiPre + `/expert/goods/lecturer/delete?ids=${ids}`,
        method: 'post',
    });
}


// 新增讲师
export function addOneLeturers(data) {
    return request({
        url: apiPre + '/expert/goods/lecturer/save',
        method: 'post',
        data,
    });
}

// 编辑更新讲师
export function updateLeturers(data) {
    return request({
        url: apiPre + '/expert/goods/lecturer/update',
        method: 'post',
        data,
    });
}

