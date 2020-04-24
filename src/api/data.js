import request from '@/utils/request';

// 获取数据统计（天）
export function getDayDataContrast(params) {
  return request({
    url: '/expert/dc/dcstatistics/dayDataContrast',
    method: 'get',
    params,
  });
}

// 获取数据统计（小时）
export function getHourDataContrast(params) {
  return request({
    url: '/expert/dc/dcstatistics/hourDataContrast',
    method: 'get',
    params,
  });
}

// 流量分析 - 查询单日每小时 或者其他时间按天分析
export function getTrafficAnalysisData({
  startTime = String,
  endTime = String,
  pageSize = 10,
  pageNum = 1,
  clientType = 'PC',
}) {
  return request({
    url: '/expert/dc/dcstatistics/traffic${2}',
    method: 'get',
    params: {
      startTime,
      endTime,
      pageSize,
      pageNum,
      clientType,
    },
  });
}

// 流量分析 - 导出
export function getExportTrafficData({
  startTime = String,
  endTime = String,
  clientType = 'PC',
}) {
  return request({
    url: '/expert/dc/dcstatistics/downloadTraffic',
    method: 'get',
    params: {
      startTime,
      endTime,
      clientType,
    },
  });
}

// 用户分析 - 查询单日每小时 或者其他时间按天分析
export function getUserAnalysisData({
  startTime = String,
  endTime = String,
  pageSize = 10,
  pageNum = 1,
  clientType = 'PC',
}) {
  return request({
    url: '/expert/dc/dcstatistics/traffic',
    method: 'get',
    params: {
      startTime,
      endTime,
      pageSize,
      pageNum,
      clientType,
    },
  });
}

// 用户分析 - 导出
export function getExportUserData({
  startTime = String,
  endTime = String,
  clientType = 'PC',
}) {
  return request({
    url: '/expert/dc/dcstatistics/downloadDcUser',
    method: 'get',
    params: {
      startTime,
      endTime,
      clientType,
    },
  });
}

// 商品分析
export function getGoodsAnalysisData({
  startTime = String,
  endTime = String,
  pageSize = 10,
  pageNum = 1,
  clientType = 'PC',
}) {
  return request({
    url: '/expert/dc/DcGoodsStatistics/goodsAnalysis',
    method: 'get',
    params: {
      startTime,
      endTime,
      pageSize,
      pageNum,
      clientType,
    },
  });
}

// 商品分析2
export function getGoodsAnalysisData2({
  startTime = String,
  endTime = String,
  goodsViewAccount = '',
  goodsViewerAccount = '',
  goodsSaleAccount = '',
  goodsPayUser = '',
  pageNum = 1,
  clientType = 'PC',
}) {
  return request({
    url: '/expert/dc/DcGoodsStatistics/elementSort',
    method: 'get',
    params: {
      startTime,
      endTime,
      goodsViewAccount,
      goodsViewerAccount,
      goodsSaleAccount,
      goodsPayUser,
      pageNum,
      clientType,
    },
  });
}

// 商品分析 - 导出
export function getExportGoodsData({
  startTime = String,
  endTime = String,
  goodsViewAccount = '',
  goodsViewerAccount = '',
  goodsSaleAccount = '',
  goodsPayUser = '',
  clientType = 'PC',
}) {
  return request({
    url: '/expert/dc/DcGoodsStatistics/downloadGoodsAnalysis',
    method: 'get',
    params: {
      startTime,
      endTime,
      goodsViewAccount,
      goodsViewerAccount,
      goodsSaleAccount,
      goodsPayUser,
      clientType,
    },
  });
}
