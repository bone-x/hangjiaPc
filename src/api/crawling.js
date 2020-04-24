import request from '@/utils/request';


// 获取上一次爬取时间范围http://10.0.81.242:8080
export function getTheLastTime({ type = '' }) {
  return request({
    url: `/newtechmoniter/getparam/last_crawl_time/${type}`,
    method: 'get',
  });
}


// 根据类型类型获取列表数据（默认id排序）
export function getListById({ type = '', startTime = '', endTime = "", startPage = 0, numberPerPage = 10 }) {
  return request({
    url: `/newtechmoniter/get/${type}/${startTime}/${endTime}/${startPage}/${numberPerPage}`,
    method: 'get',
  });
}

// 根据类型类型获取列表数据（指定排序）
export function getListBySet({ type = '', startTime = '', endTime = "", startPage = 1, numberPerPage = 10, orderBy = '', order = '' }) {
  return request({
    url: `/newtechmoniter/get/${type}/${startTime}/${endTime}/${startPage}/${numberPerPage}/${orderBy}/${order}`,
    method: 'get',
  });
}

// 导出报表
export function exportFormList({ type = '', startTime = '', endTime = "", orderBy = '', order = '' }) {
  return request({
    url: `/newtechmoniter/download/${type}/${startTime}/${endTime}/all/${orderBy}/${order}`,
    method: 'get',
  });
}

// 根据项目id获取项目（查看readme）
export function getReadMeDetails({ type = '', id = '' }) {
  return request({
    url: `/newtechmoniter/get/${type}/${id}`,
    method: 'get',
  });
}

// 忽略
export function changeIgnore({ type = '', id = '' }) {
  return request({
    url: `/newtechmoniter/update/${type}/ignore/${id}`,
    method: 'get',
  });
}
