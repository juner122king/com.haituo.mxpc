import request from '../ajax.js'

// 获取幸运大转盘信息
const getWheelOfFortuneInfo = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/activity/wheelOfFortune/info`,
    data,
  })
}

// 抽奖
const getStartLottery = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/activity/lottery`,
    data,
  })
}

// 领奖记录
const getDrawPrizeRecord = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/activity/drawPrize/record`,
    data,
  })
}

// 埋点捕获
const postTrackCapture = (data) => {
  return request({
    method: 'POST',
    url: `/qa/track/capture`,
    data,
  })
}

export default {
  getWheelOfFortuneInfo,
  getStartLottery,
  getDrawPrizeRecord,
  postTrackCapture,
}
