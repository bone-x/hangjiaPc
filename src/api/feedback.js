import request from '@/utils/request';

const apiPre = '';

// 获取反馈列表
export function getFeedbackList(params) {
  return request({
    url: apiPre + 'expert/ag/webagreementhistory/FeedBack',
    method: 'get',
    params,
  });
}
