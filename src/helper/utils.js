/**
 * 您可以将常用的方法、或系统 API，统一封装，暴露全局，以便各页面、组件调用，而无需 require / import.
 */
import $device from '@system.device'
import prompt from '@system.prompt'
import ad from '@service.ad'
const config = require('../config').default
const { JSEncrypt } = require('../libs/jsencrypt/lib/index')
// 节流阀
const throttle = (fn, gapTime = 1500) => {
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

const extractYearMonth = (input) => {
  if (input.length !== 6 || isNaN(input)) {
    throw new Error('Invalid input format')
  }
  const year = input.slice(0, 4)
  let month = input.slice(4, 6)

  if (month[0] === '0') {
    month = month[1]
  } else {
    month = parseInt(month, 10).toString()
  }
  return { year, month }
}

const getUserId = async () => {
  let userId = await $device.getUserId()
  return userId.data.userId
}

/**
 * 分秒倒计时
 * @param {Object} countDownData 相关参数：totalSeconds倒计时秒数、name属性名称、isFormat格式化
 * @param {*} that 当前组件this
 */
const startCountDown = (countDownData, that) => {
  let { totalSeconds = 3, name, isFormat = false } = countDownData
  let _this = that
  return new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      if (totalSeconds > 1) {
        totalSeconds--
        const minutes = isFormat
          ? this.formatTime(Math.floor(totalSeconds / 60))
          : Math.floor(totalSeconds / 60)
        const seconds = isFormat
          ? this.formatTime(Math.floor(totalSeconds % 60))
          : Math.floor(totalSeconds % 60)
        _this[name] = {
          minutes,
          seconds,
        }
      } else {
        clearInterval(_this.timer)
        resolve()
      }
    }, 1000)
    _this.timer = timer
  })
}

/**
 *
 * 加密
 * @param { String } action encrypt=加密 decrypt = 解密
 * @param { String } key  RSA 密钥。PKCS8 格式。 加密使用公钥，解密使用私钥。
 */

const dataEncryption = (data, action = 'encrypt') => {
  try {
    let keyMap = {
      encrypt: config.publicKey,
      decrypt: config.privateKey,
    }
    let key = keyMap[action]
    let _data = action === 'encrypt' ? JSON.stringify(data) : data
    return new Promise((resolve, reject) => {
      if (action === 'encrypt') {
        const encryptor = new JSEncrypt()
        encryptor.setPublicKey(key)
        let result = encryptor.encrypt(_data)
        resolve(result)
        return resolve(result)
      }
    })
  } catch (error) {
    console.log(error, '转换报错？')
  }
}

/**
 * toast提示
 * @param {*} message
 * @param {*} duration
 * @param {*} gravity
 * @returns
 */
const showToast = (message, duration = 3000, gravity = 'center') => {
  console.log('触发了toast ', message)
  return prompt.showToast({
    message,
    duration,
    gravity,
  })
}

/**
 * 插屏广告
 */

const tablePlaque = (that) => {
  let Provider = $ad.getProvider()
  if (!Provider) {
    console.log('没有广告返回')
    return
  }
  let interstitialAd = $ad.createInterstitialAd({
    adUnitId: 'b1k2is3cbt',
  })

  interstitialAd
    .load()
    .then((res) => {
      console.log(res, '查屏加载成功')
      interstitialAd.show().then(
        () => {
          console.log('插屏广告show成功')
        },
        () => {
          console.log('插屏广告show失败')
        }
      )
    })
    .catch((err) => {
      console.log(err, '插屏加载失败')
    })
}

/**
 * 转化上传
 * @param {*} that 所在this
 */
function conversionUpload(that) {
  let param = {
    ...that.$app.$def.globalData.actiParam,
  }
  param.type = judgingAd(that) //转换类型
  if (Object.keys(param).length <= 0 || !param.type) {
    //无值的情况直接删除
    return
  }
  console.log('进入了回传上报')
  let conversionlicks = that.$app.$def.globalData.conversionlicks //第几次回传上报
  let clicksOnAdsNow = that.$app.$def.globalData.clicksOnAdsNow + 1 //现在是第几次任务
  console.log(conversionlicks, 'conversionlicks第几次回传上报')
  console.log(clicksOnAdsNow, 'clicksOnAdsNow现在是第几次任务')

  that.$app.$def.globalData.clicksOnAdsNow = clicksOnAdsNow
  if (conversionlicks <= 0 || clicksOnAdsNow !== conversionlicks) {
    console.log('取消转换上传')
    return
  }

  if (param.type === 'jh') {
    for (const key in param) {
      param[key] = param[key].replace(/\/$/, '')
    }
    param = convertKeysToCamelCase(param)
  }
  console.log(param, '查看上传的参数')
  $apis.task
    .postConvertUpload({
      ...param,
      deviceId: param.oaid || '',
      type: param.type,
    })
    .then((res) => {
      console.log(res, '转换成功')
    })
    .catch((err) => {
      console.log(err, '转换失败')
    })
}

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function convertKeysToCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeysToCamelCase(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelCaseKey = toCamelCase(key)
      result[camelCaseKey] = convertKeysToCamelCase(obj[key])
      return result
    }, {})
  }
  return obj
}

/**
 * 一天只触发一次 有意义的标识
 * @param {*} pageName
 * @returns
 */
const checkCurrentDay = (pageName = 'expiredTime') => {
  return new Promise(async (resolve, reject) => {
    $storage.get({
      key: pageName,
      success: function (data) {
        let date = data
        let dayTime = '' // 当天00时的时间戳
        const nowTime = new Date().getTime() // 当前时间戳
        const timestamp = 86400000 // 一天的时间戳
        const confirmTime = 1682006400000 // 具体某天00时的时间戳
        if (date) {
          dayTime = date
        } else {
          // 具体某天00时时间戳与当前时间戳的间隙
          const gapTime =
            confirmTime - nowTime > 0
              ? confirmTime - nowTime
              : -(confirmTime - nowTime)
          // 根据间隙 计算出具体某天00时到当前时间 间隔的天数
          const num = Math.floor(gapTime / timestamp)
          // 根据天数 计算出当天00时的时间戳大小
          dayTime = confirmTime + timestamp * num
        }
        if (dayTime < nowTime) {
          dayTime = dayTime + timestamp
          $storage.set({
            key: pageName,
            value: dayTime,
          })
          resolve(true)
          return true
        } else {
          resolve(false)
          return false
        }
      },
    })
  })
}

/**
 * @param {*} this //必传
 * @param {*} name //变量名
 * @param {*} data  // 数据值
 * @param {*} changeType  //get set 存储消除  前两参数都传默认为set
 * @returns
 */
function changeGlobalParam(that, name, data = '', changeType = 'get') {
  try {
    let type = name && data ? 'set' : changeType
    if (type === 'get') {
      return name ? that.$app.$def.globalData[name] : that.$app.$def.globalData
    } else if (type === 'set') {
      that.$app.$def.globalData[name] = data
      return that.$app.$def.globalData[name]
    }
  } catch (error) { }
}
/**
 * 判断广告商
 */
function judgingAd(context) {
  let param = {
    ...context.$app.$def.globalData.actiParam,
  }
  let type = param.type || ''
  if (type) {
    return type
  }
  if (
    param.adgroup_id &&
    param.content_id &&
    param.campaign_id &&
    param.callback
  ) {
    type = 'jh'
  } else if (param.btn_name && param.backurl) {
    type = 'vivo'
  }

  return type ? type : false
}

/**
 * 判断广告主id
 * @param {*} context
 */

function analyzeAdvertiserId(context) {
  const {
    backurl = '',
    corp_id = '',
    callback = '',
  } = context.$app.$def.globalData.actiParam
  if (backurl) {
    return backurl
  } else if (callback) {
    return corp_id ? corp_id : callback
  }
}

/**
 * 获取哪一次上报回传  context  指向
 */
function getConversionlicks(context) {
  const {
    type = '',
    corp_id = '',
    channelValue = '',
  } = context.$app.$def.globalData.actiParam
  let adType = type ? type : judgingAd(context) //有类型直接获取类型 没有则进行判断；
  let corpId = corp_id ? corp_id : analyzeAdvertiserId(context)
  $apis.task
    .getConversionlicks({ type: adType, corpId, channelValue })
    .then((res) => {
      console.log(res, '查看点击回传')
      if (res.data === 0) {
        $utils.conversionUpload(context)
      }
      context.$app.$def.globalData.conversionlicks = res.data
    })
    .catch((err) => {
      console.log(err, '查看点击回传失败')
    })
}

function convertToQueryString(objects) {
  // 初始化一个空字符串来存储结果
  let queryString = ''

  // 遍历对象数组
  Object.keys(objects).forEach((key, index) => {
    // 如果不是第一个键值对，则添加 '&'
    if (index > 0 || queryString !== '') {
      queryString += '&'
    }
    // 将键值对添加到查询字符串中
    queryString += `${key}=${objects[key]}`
  })

  return queryString
}

// 埋点上报
async function buriedPointReport(these, event = 'AppLaunch', adId = '') {
  try {
    let checkPaem = {
      ...these.$app.$def.globalData.actiParam,
    }
    console.log(these.$app.$def.globalData, 'these.$app.$def.globalData-')
    console.log(checkPaem, '查看是否有参数')
    if (Object.keys(checkPaem).length <= 0) {
      //无值的情况直接删除
      return
    }

    let token = await $storage.get({
      key: 'AUTH_TOKEN_DATA',
    })
    token = JSON.parse(token.data)
    console.log('查看这个token', token)
    const that = this
    let adBrand = $ad.getProvider()
    let param = {
      ...checkPaem,
      event: event === 'click' ? '$AdClick' : '$AppLaunch',
      pid: adBrand.toLowerCase(),
      appId: token.appId,
      userId: token.userId,
    }
    let urlQuery = convertToQueryString(checkPaem)
    $device.getInfo({
      success: function (res) {
        const phoninfo = res
        let param2 = {
          ...param,
          cid: param.channelValue,
          properties: {
            ...res,
            manufacturer: phoninfo.manufacturer,
            model: phoninfo.model,
            os: phoninfo.osType,
            product: phoninfo.product,
            analysis: {
              adId: adId,
              title: adId,
            },
            urlQuery: urlQuery,
          },
        }

        console.log('查看上报参数', param2)
        $apis.activity
          .postTrackCapture({ ...param2 })
          .then((res) => {
            console.log('上报成功', res)
          })
          .catch((err) => {
            console.log(err, '上传失败')
          })
      },
    })
  } catch (error) {
    console.log(error, '上传错误')
  }
}

//获取天气信息

const getWeatherInfo = async (onCatchCallback, lng, lat,area) => {

  const params = {
    appKey: '2D30bc634AA046B4A9f3f185F9eCB310',
    needAlarm: 0,
    needMoreDay: 1,
    need3HourForcast: 1,
    needIndex: 0,
    from: 1,
    needHourData: 0,
    lng: lng,
    lat: lat,
    area:area
  }
  $apis.weather.get7dayWeather({ ...params })
    .catch(onCatchCallback)
    
}
//使用城市信息获取天气
const getWeatherInfo2 = async (onCatchCallback,area) => {

  const params = {
    appKey: '2D30bc634AA046B4A9f3f185F9eCB310',
    needMoreDay: 1,
    need3HourForcast: 1,
    area:area
  }
  $apis.weather.get7dayWeatherforArea({ ...params })
    .catch(onCatchCallback)
    
}


export default {
  throttle,
  getUserId,
  extractYearMonth,
  startCountDown,
  dataEncryption,
  showToast,
  tablePlaque,
  conversionUpload, //转化
  checkCurrentDay, //一天触发一次
  changeGlobalParam, //修改全局变量
  getConversionlicks,
  buriedPointReport, //上传参数
  getWeatherInfo,
  getWeatherInfo2
}
