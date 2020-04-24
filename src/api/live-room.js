import request from '@/utils/request';


//  直播间 - 新增数据
export function addLiveRoom(data) {
    return request({
        url: '/expert/organization/orgLiveRoom/addOrgLiveRoom',
        method: 'post',
        data,
    });
}

//  直播间 - 修改数据
export function editLiveRoom(data) {
    return request({
        url: '/expert/organization/orgLiveRoom/updateOrgLiveRoom',
        method: 'post',
        data,
    });
}

// 直播间 - 新增 - 机构数组来源
export function orgArrayData(params) {
    return request({
        url: '/expert/organization/api/OrgBasicInfo/getOrgNameAndLogoDTO',
        method: 'get',
        params,
    });
}

// 直播间 - 审核列表
export function getCheckList(params) {
    return request({
        url: '/expert/organization/orgLiveRoomApply/getRoomApplyBackList',
        method: 'get',
        params,
    });
}

//  获取直播间管理列表
export function getLiveList(params) {
    return request({
        url: '/expert/organization/orgLiveRoom/orgLiveRoomList',
        method: 'get',
        params,
    });
}

// 直播间 - 审核列表 - 审核功能
export function checkAbility(data) {
    return request({
        url: '/expert/organization/orgLiveRoomApply/updateEntityById',
        method: 'post',
        data,
    });
}

// 直播间管理 - 启用禁用接口
export function changeLiveStatus(data) {
    return request({
        url: '/expert/organization/orgLiveRoom/updateOrgLiveRoomEnable',
        method: 'post',
        data,
    });
}


// 直播间 - 审核列表 - 查看功能
export function lookAbility(params) {
    return request({
        url: '/expert/organization/orgLiveRoomApply/getEntityById',
        method: 'get',
        params,
    });
}

// 精选直播列表
export function getSelectLiveList(params) {
    return request({
        url: '/expert/operate/opgoodlesson/list',
        method: 'get',
        params,
    });
}

// 直播间的详情
export function liveRoomDetails(params) {
    return request({
        url: '/expert/organization/orgLiveRoom/getEntityById',
        method: 'get',
        params,
    });
}

// 添加精选直播
export function selectLiveAdd(data = {}) {
    return request({
        url: '/expert/operate/opgoodlesson/add',
        method: 'post',
        data,
    });
}

// 精选直播 - 上移
export function liveToUp(id = Number) {
    return request({
        url: `/expert/operate/opgoodlesson/moveUp?id=${id}`,
        method: 'put',
    });
}

// 精选直播 - 下移
export function liveToDown(id = Number) {
    return request({
        url: `/expert/operate/opgoodlesson/moveDown?id=${id}`,
        method: 'put',
    });
}

// 精选直播 - 删除
export function liveToDelete(id = Number) {
    return request({
        url: `/expert/operate/opgoodlesson/delete?id=${id}`,
        method: 'delete',
    });
}
