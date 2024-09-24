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
* 保存广告回传参数   router.push(OBJECT)  例：@param {Object} e='hap://app/com.company.app/index?param1=value1'
*/
const saveHapUri = (that, e) => {
  console.log('saveHapUri() 转化参数e= ', e)

  const { channelValue = '', backurl = '', type } = e
  if (channelValue) {
    that.$app.$def.dataApp.actiParam = {
      ...e
    }
  }
}

let acticityParam = {}
/**
 * 转化上传
 * @param {*} that 所在this  小说广告页面的转化方法
 */
async function conversionUpload(that, option = {}) {
  try {
    const {
      adType = '',
      adPositionId = '',
      isclick = false,
      ecpm = 0,
      clickCount = 0,
      splashData = {},
    } = option
    let param = {}
    if (adType !== 'OPEN_SCREEN' && that.$app) {
      param = {
        ...that.$app.$def.dataApp.actiParam,
      }
      param.type = judgingAd(that) //转换类型
      acticityParam = param
    } else {
      param = {
        ...splashData,
        ...acticityParam,
      }
    }
    console.log(param, '查看回传上报参数', "是否isclick", isclick)
    if (Object.keys(param).length <= 0 || !param.type) {
      console.log('转换上传无值状态直接弹出')
      //无值的情况直接删除
      return
    }
    let clickcount = isclick ? 1 : 0 //是否是点击

    if (param.type === 'jh') {
      for (const key in param) {
        param[key] = param[key].replace(/\/$/, '')
      }
      param = convertKeysToCamelCase(param)
    }
    const branch = $ad.getProvider().toLowerCase()
    const deviceInfo = await $device.getInfo({})
    const phoninfo = deviceInfo.data
    let manufacturer = phoninfo.manufacturer.toLowerCase()

    if (manufacturer === 'oppo' || branch === 'oppo' || param.type == 'oppo') {
      //机型广告唯一值相同都替换
      if (adType !== 'OPEN_SCREEN') {
        let oaid = acticityParam.oaid

        try {
          console.log('进来了oppo')
          let oaidData = ''
          if (!oaid) {
            oaidData = await $device.getOAID()
            acticityParam.oaid = oaidData.data.oaid
          } else {
            console.log('有oaid就不用在触发了')
          }
          param.oaid = oaid || oaidData.data.oaid
        } catch (error) {
          console.log(error, '')
        }
        console.log(param.oaid, '查看oaid')
      } else {
        let oaidData = await $device.getOAID()
        param.oaid = oaidData.data.oaid
      }
    }

    if (ecpm > 0) {
      param.ecpm = ecpm
    }
    let buriedPointData = await $storage.get({
      key: 'sensorsdata2015_quickapp',
    })
    try {
      buriedPointData = JSON.parse(buriedPointData.data)
    } catch (error) {
      buriedPointData = {
        distinct_id: '',
      }
    }

    let data = {
      ...param,
      deviceId: param.oaid || '',
      type: param.type,
      pid: manufacturer || branch,
      clickCount: clickcount, //是否是点击
      adType: adType, //广告类型，
      adPositionId: adPositionId, //广告id
      distinctId: buriedPointData.distinct_id, //设备id
    }
    console.log(data, '查看回传上报参数')
    $apis.task
      .postConvertUpload({
        ...data,
      })
      .then((res) => {
        console.log(res, '转换成功')
      })
      .catch((err) => {
        console.log(err, '转换失败')
      })

    if (data.type.toLowerCase() === 'uc') {
      $apis.task
        .postConvertUploadUc({
          ...data,
        })
        .then((res) => {
          console.log(res, '转换成功UC')
        })
        .catch((err) => {
          console.log(err, '转换失败UC')
        })
    }
  } catch (error) {
    console.log('转换失败', error)
  }
}

/**
 * 插屏广告
 */

const tablePlaque = async (onCloseCallback, onCatchCallback, that) => {

  let branch = $ad.getProvider();
  if (!branch) {
    console.log('没有广告商');
    return
  }
  let adid = adCodeData[branch].interstitialAdUnitId
  console.info('插屏广告id ', adid)

  let interstitialAd = $ad.createInterstitialAd({
    adUnitId: adid
  })
  var e
  interstitialAd.load().then((res) => {
    console.log(res, '查屏加载成功')

    e = interstitialAd.getECPM()
    console.log(`getECPM: 插屏广告获取实时竞价结果成功!ecpm=${e.ecpm}`)

    interstitialAd.show().then(
      () => {
        console.log('插屏广告show成功')

        if (Provider === 'oppo') {
          const ecpmData = interstitialAd.getECPM()
          console.log(
            `getECPM: 插屏广告获取实时竞价结果成功!ecpm=${ecpmData.ecpm}`
          )
          conversionUpload(that, {
            adType: 'INSERT_SCREEN',
            adPositionId: adid,
            isclick: false,
            ecpm: ecpmData.ecpm,
          })

          interstitialAd.setBidECPM({
            ecpm: ecpmData.ecpm,
          })
        }
      },
      () => { console.log('插屏广告show失败') }
    )
  })
    .catch(onCatchCallback)


  interstitialAd.onClick(() => {
    console.log('插屏广告点击了')

    let ecpmParam = {  //竞价相关参数
      ecpm: e.ecpm,
      adType: 'INSERT_SCREEN',
      adPositionId: adid,
      clickCount: '1'
    }
    console.log('竞价相关参数', ecpmParam)

    conversionUpload(that, ecpmParam)

  })

  interstitialAd.onClose(onCloseCallback)

};


/**
* banner广告  margin_bot底部缩进    @param isbuttom 是否显示在最底部
*/

let bannerAd; const showBannerAd = async () => {
  let branch = $ad.getProvider();
  console.info('广告商:', branch);

  let adid = adCodeData[branch].banner;
  console.info("banner广告位=" + adid);
  bannerAd = $ad.createBannerAd({
    adUnitId: adid,//banner广告位
    style: {
      width: 750,
      top: 1540
    }
  });

  console.info("annerAd.style=" + JSON.stringify(bannerAd.style));
  bannerAd.onLoad(e => {
    // console.info("load bannerAd  onload success e=" + JSON.stringify(e));
  });
  bannerAd.onError(e => {
    // console.error("load bannerAd  onError " + JSON.stringify(e));
  });
  bannerAd.onClose(e => {
    // console.info("load bannerAd  onClose");
  });
  bannerAd.show();

  bannerAd.onResize((data) => {
    console.log(data.width + "|" + data.height, 'onResize')
  })


}

const hideBanerAd = () => {
  if (bannerAd) {
    bannerAd.hide();
  }
}
const viewBanner = () => {
  if (bannerAd) {
    bannerAd.show();
  }
}
const destroyBanner = () => {
  if (bannerAd) {
    bannerAd.destroy()
  }
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
      return name ? that.$app.$def.dataApp[name] : that.$app.$def.dataApp
    } else if (type === 'set') {
      that.$app.$def.dataApp[name] = data
      return that.$app.$def.dataApp[name]
    }
  } catch (error) { }
}
/**
 * 判断广告商
 */
function judgingAd(context) {
  let param = {
    ...context.$app.$def.dataApp.actiParam,
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
  } = context.$app.$def.dataApp.actiParam
  if (backurl) {
    return backurl
  } else if (callback) {
    return corp_id ? corp_id : callback
  }
}


// 埋点上报
async function buriedPointReport(these, options = {}) {
  try {
    const { event = 'AppLaunch', adId = '', splashData = {} } = options
    let checkPaem = {
      channelValue: '',
      oaid: '',
      type: '',
      ...splashData,
    }
    if (event !== 'Splash' && event !== 'SplashLaunch' && these.$app) {
      //不是开屏正常逻辑
      const isEnabled = these.$app.$def.dataApp.isEnabled
      if (event === 'AppLaunch' && isEnabled) {
        // console.log('取消启动上报', isEnabled)
        return
      } else {
        // console.log('成功启动上报')
        these.$app.$def.dataApp.isEnabled = true
      }
      acticityParam = {
        ...these.$app.$def.dataApp.actiParam,
      }
      checkPaem = {
        channelValue: '',
        ...these.$app.$def.dataApp.actiParam,
      }
    }

    if (!these.$app) {
      console.log('没有$app')
      try {
        checkPaem = {
          ...acticityParam,
        }
        console.log(checkPaem, '查看是否有参数')
      } catch (error) { }
    }

    console.log(checkPaem, '查看是否有参数')
    let token = await $storage.get({
      key: 'AUTH_TOKEN_DATA',
    })
    let buriedPointData = await $storage.get({
      key: 'sensorsdata2015_quickapp',
    })

    try {
      token = JSON.parse(token.data)
      buriedPointData = JSON.parse(buriedPointData.data)
    } catch (error) {
      console.log('无token状态')
      token = {
        userId: 'null',
        appId: '',
      }
      buriedPointData = {
        distinct_id: '',
      }
    }
    let adBrand = $ad.getProvider().toLowerCase()
    let urlQuery = convertToQueryString(checkPaem)
    const eventData = {
      click: '$AdClick',
      Splash: '$AdClick',
      AppLaunch: '$AppLaunch',
      SplashLaunch: '$AppLaunch',
    }
    $device.getInfo({
      success: function (ret) {
        let phoninfo = ret
        let manufacturer = phoninfo.manufacturer.toLowerCase()
        let param = {
          ...checkPaem,
          ...splashData,
          event: eventData[event],
          cid: checkPaem.channelValue,
          pid: manufacturer || adBrand,
          appId: token.appId || 'mxpc',
          userId: token.userId,
          properties: {
            ...phoninfo,
            manufacturer: phoninfo.manufacturer,
            model: phoninfo.model,
            os: phoninfo.osType,
            product: phoninfo.product,
            analysis: {
              adId: adId,
              title: adId,
            },
            urlQuery: urlQuery,
            distinct_id: buriedPointData.distinct_id,
          },
        }
        console.log('查看埋点上报参数', param)
        $apis.task
          .postTrackCapture({ ...param })
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
    $apis.task
      .postTrackCapture({
        event: event === 'click' ? '$AdClick' : '$AppLaunch',
        appId: 'mxpc',
        properties: {
          analysis: {
            adId: adId,
            title: adId,
          },
        },
      })
      .then((res) => {
        console.log('上报成功', res)
      })
      .catch((err) => {
        console.log(err, '上传失败')
      })
  }
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

async function setChannelValue(channel) {
  if (!channel) {
    return
  }
  $storage.set({
    key: 'cid',
    value: channel,
    success: function (data) {
      console.log(data, '查看是否保存成功')
      // console.log('handling success')；
      $storage.delete({
        key: 'AUTH_TOKEN_DATA',
      })
    },
    fail: function (data, code) {
      console.log(`handling fail, code = ${code}`)
    },
  })
}
let isShowAd = false //状态

function changeShowAd(state) {
  isShowAd = state
}

/**
 *
 * count  次数
 * seconds 时间
 * status 是否开启
 *jumpNum 跳转次数
 *timer 定时器
 * 拉起快应用
 * maxAdJump 次数
 * type 类型 app 快应用本身    ad广告本身
 */

function openApp() {
  let showApp = null
  const adBrand = $ad.getProvider().toLowerCase()
  let lastCallTime = 0
  const throttleDelay = 1000 // 1.5 seconds
  async function getOpenAppConfig() {
    if (showApp) return showApp
    try {
      const res = await $apis.activity.getOpenAppConfig({ type: adBrand })
      console.log(res, '查看调起app配置')
      const {
        count = 0,
        seconds = 0,
        status = false,
        maxAdJump = 5,
        linkUrl = '',
      } = res.data
      showApp = {
        count,
        seconds,
        status,
        jumpNum: 0,
        timer: null,
        maxAdJump,
        adJump: 0,
        linkUrl: linkUrl,
      }
      return showApp
    } catch (error) {
      console.error('获取调起app配置失败', error)
      return null
    }
  }
  getOpenAppConfig()
  return async function (type = 'app') {
    console.log('进来调起app', type)
    if (isShowAd) {
      console.log('这是在激励视屏中直接return')
      return
    }
    // 获取当前时间戳
    const now = Date.now()
    // 检查是否在节流时间内
    if (now - lastCallTime < throttleDelay && type !== 'ad') {
      console.log('函数调用被节流')
      return // 如果在节流时间内,直接返回不执行后续代码
    }
    // 更新最后调用时间
    lastCallTime = now
    clearTimeout(showApp.timer)
    if (
      (showApp.jumpNum > showApp.count && type === 'app') ||
      !showApp.status
    ) {
      return
    }
    if (type === 'app') {
      showApp.jumpNum++
    } else {
      showApp.adJump++
      if (showApp.adJump > showApp.maxAdJump) {
        return
      }
    }

    let seconds = type === 'app' ? showApp.seconds * 1000 : 100
    console.log('进来的调起秒数', seconds)
    showApp.timer = setTimeout(() => {
      if (showApp.linkUrl.length > 10) {
        $router.push({
          uri: showApp.linkUrl,
        })
      }
      console.log('调起拉回了')
      $image.editImage({
        uri: '/Common/',
        success: function (data) {
          console.log(`handling success: ${data.uri}`)
        },
        cancel: function () {
          console.log('handling cancel')
        },
        fail: function (data, code) {
          console.log(`handling fail, code = ${code}`)
        },
      })
    }, seconds)
  }
}

/***
 * 跳转
 */
function jumpoOutside(option = {}) {
  const { url = '' } = option
  if (!url) return
  let param = handleParam(option)
  console.log(param, '查看跳转参数')
  $router.push({
    uri: url + '?' + param,
  })
}

/**
 * 参数处理 除去url 将参数以&拼接
 */
function handleParam(option = {}) {
  if (Object.keys(option).length <= 0) {
    return ''
  }
  delete option.url
  let params = []
  for (const key in option) {
    if (option[key] !== '') {
      params.push(`${key}=${option[key]}`)
    }
  }
  return params.join('&')
}
//获取天气信息
const getWeatherInfo = async (onCatchCallback, lng, lat, area) => {

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
    area: area
  }
  $apis.weather.get7dayWeather({ ...params })
    .catch(onCatchCallback)

}
//使用城市信息获取天气
const getWeatherInfo2 = async (onCatchCallback, area) => {

  const params = {
    appKey: '2D30bc634AA046B4A9f3f185F9eCB310',
    needMoreDay: 1,
    need3HourForcast: 1,
    area: area
  }
  $apis.weather.get7dayWeatherforArea({ ...params })
    .catch(onCatchCallback)

}



export default {
  throttle,
  getUserId,
  extractYearMonth,
  saveHapUri,
  startCountDown,
  dataEncryption,
  showToast,
  tablePlaque,
  showBannerAd,
  hideBanerAd,
  viewBanner,
  destroyBanner,
  getWeatherInfo,
  getWeatherInfo2,
  conversionUpload, //转化
  checkCurrentDay, //一天触发一次
  changeGlobalParam, //修改全局变量
  buriedPointReport, //上传参数 
  setChannelValue,
  openApp, //拉起快应用
  jumpoOutside, //跳转
  changeShowAd, //修改状态
}
