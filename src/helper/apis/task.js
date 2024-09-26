import request from '../ajax.js'

// 获取广告完成情况
const getCompleteCount = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/ad/complete/count`,
    data,
  })
}

// 完成广告
const postCompleteAd = (data) => {
  return request({
    method: 'POST',
    url: `/qa/mini/basic/ad/complete`,
    data,
  })
}
// 完成广告(加密)
const postFinishCompleteAd = async (data, headers) => {
  let timestamp = +new Date()
  data.timestamp = timestamp
  let _data = await $utils.dataEncryption(data)
  let param = {
    data: _data,
  }
  console.log('任务加密', param)
  return request({
    method: 'POST',
    url: `/qa/mini/basic/ad/finish`,
    data: JSON.stringify(param),
    headers,
  })
}

// 获取是否自动弹窗
const getAutoPopUps = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/ad/auto/popUps`,
    data,
  })
}

// 转换上报
const postConvertUpload = (data) => {
  return request({
    method: 'POST',
    url: `/qa/mini/basic/ad/convert/upload/${data.type}`,
    data,
  })
}

// 转换上报-UC
const postConvertUploadUc = (data) => {
  return request({
    method: 'POST',
    url: `/qa/mini/basic/ad/quickApp/open/convert/upload/uc`,
    data,
  })
}


// 获取手势返回配置信息
const getClickControlReyurn = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/clickControl/return/info/${data.brand}`,
    data,
  })
}

// 获取页面透明层配置信息
const getTransparentLayer = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/clickControl/transparentLayer/info/${data.brand}`,
    data,
  })
}

// 获取福利入口信息
const getUserwealEntry = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/user/weal/entry`,
    data,
  })
}

// 获取跳转链接
const getAdJumpLink = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/ad/jumpLink/${data.brand}`,
    data,
  })
}

// 获取是否开启广告页入口
const getAdPageEntrance = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/ad/adPage/entrance`,
    data,
  })
}

// 转化点击次数

const getConversionlicks = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/ad/convert/clickCount/${data.type || 'jh'}`,
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

// 获取点击控制审核状态
const getClickReviewControl = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/clickControl/audit/status/${data.branch}`,
  })
}
// 获取ip是否存在限制地区
const getIpLimit = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/clickControl/exist/limit/area/${data.brand}`,
    data,
  })
}

// 获取ip位置
const getIpLocation = (data) => {
  return request({
    method: 'GET',
    url: `/qa/h5/tools/browser/ip`,
    data,
  })
}


let task = {
  getCompleteCount,
  postCompleteAd,
  getAutoPopUps,
  postFinishCompleteAd,
  getClickControlReyurn,
  getTransparentLayer,
  postConvertUpload,
  getUserwealEntry,
  getAdJumpLink,
  getAdPageEntrance,
  getConversionlicks,
  postTrackCapture,
  getClickReviewControl,
  postConvertUploadUc,
  getIpLimit,
  getIpLocation,

}

export default task
