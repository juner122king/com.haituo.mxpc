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

// 获取自定义广告配置
const getAdConfigView = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/adConversion/adConfigView`,
    data,
  })
}

// 自定义图片详情详情
const getAdConversionImg = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/adConversionImg/img`,
    data,
  })
}

export default {
  getWheelOfFortuneInfo,
  getStartLottery,
  getDrawPrizeRecord,
  postTrackCapture,
  getAdConfigView,
  getAdConversionImg,
}
