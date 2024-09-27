import $fetch from '@system.fetch'
import $storage from '@system.storage'
import $device from '@system.device'
import $prompt from '@system.prompt'
import $router from '@system.router'
const config = require('../config').default
const getUserId = async () => {
  let userId = await $device.getUserId()

  return userId.data.userId
}

const quit = () => {
  $prompt.showDialog({
    title: '警告',
    message: '您已注销账号，请退出。',
    buttons: [
      {
        text: '退出',
        color: '#333333',
      },
    ],
    success: function (data) {
      $router.push({
        uri: 'setting/quit',
      })
    },
    cancel: function () {
      console.log('cancel')
    },
  })
}

const getTokenData = () => {
  return new Promise(async (resolve, reject) => {
    let branch = $ad.getProvider().toLowerCase()
    const example = require('./apis/example.js').default
    const deviceNum = await getUserId()
    // console.log('查看这个channel值', actiParam)
    // console.log('***************', deviceNum)
    // let cid =
    //   (
    //     await $storage.get({
    //       key: 'cid',
    //     })
    //   ).data || ''
    example
      .toLogin({
        loginType: 'DEVICE',
        appId: 'mxpc',
        deviceNum,
        loginAccount: deviceNum,
        pid: branch.toLowerCase(), //应用平台
      })
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err, '获取token报错')
        try {
          if (JSON.parse(err).code === '310001') {
            quit()
          }
        } catch (error) {
          console.log(error, '查看获取报错')
        }

        reject(err)
      })
  })
}

let isRefreshing = false // 是否正在请求刷新token的接口
const refreshSubscribers = [] // 存储请求的数组
const subscribeTokenRefresh = (cb) => {
  // 将所有的请求都push到数组中,其实数组是[function(token){}, function(token){},...]
  refreshSubscribers.push(cb)
}
const onRrefreshed = (token) => {
  // 数组中的请求得到新的token之后自执行，用新的token去请求数据
  refreshSubscribers.map((cb) => cb(token))
}
const isAccessTokenExpired = (authData) => {
  // 判断当前token是否过期
  if (new Date().getTime() - authData.expireAt > 10000 * 60) {
    return true
  }
  return false
}

const request = (options) => {
  return new Promise(async (resolve, reject) => {
    const {
      method,
      url,
      data,
      headers = {},
      isforeignAddress = false,
    } = options
    const authData =
      (await $storage.get({
        key: 'AUTH_TOKEN_DATA',
      })) || {}

    let accessToken = ''
    let userId = ''
    try {
      if (authData.data) {
        const parsedData = JSON.parse(authData.data)
        accessToken = parsedData.accessToken || ''
        userId = parsedData.userId || ''
      } else {
        accessToken = ''
        userId = ''
      }
    } catch (error) {
      console.log(error, '获取data有问题')
    }
    if (isAccessTokenExpired(authData) || !accessToken) {
      if (!options.url.includes('qa/mini/basic/user/login')) {
        if (!isRefreshing) {
          isRefreshing = true
          getTokenData()
            .then(async (res) => {
              let resData = ''
              try {
                resData = JSON.parse(res)
              } catch (error) {
                console.log(error, '获取token报错')
                getTokenData()
              }
              isRefreshing = false
              if (resData.code === '000000') {
                headers.Authorization = resData.data.accessToken
                await $storage.set({
                  key: 'AUTH_TOKEN_DATA',
                  value: JSON.stringify(resData.data),
                })
                console.log(
                  'resData.data.accessToken',
                  resData.data.accessToken
                )
                onRrefreshed(resData.data.accessToken)
              }
            })
            .catch((err) => {
              isRefreshing = false
            })
        }
        let retry = new Promise(() => {
          subscribeTokenRefresh((token) => {
            headers.Authorization = token // 用最新token请求数据
            return request(options).then(resolve).catch(reject)
          })
        })
        return retry
      }
    }
    headers.Authorization = accessToken || ''
    if (
      url.includes('/qa/track/capture') ||
      url.startsWith('/qa/mini/basic/ad/convert/upload')
    ) {
      options.data.userId = userId
      try {
        if (!options.data.distinct_id) {
          let buriedPointData = await $storage.get({
            key: 'sensorsdata2015_quickapp',
          })
          if (buriedPointData && buriedPointData.data) {
            buriedPointData = JSON.parse(buriedPointData.data)
          } else {
            throw new Error('Invalid buriedPointData')
          }
          options.data.distinct_id = buriedPointData.distinct_id
        }
      } catch (error) {
        console.log(error)
      }
    }
    $fetch.fetch({
      url: isforeignAddress ? url : config.BASEHOST + url,
      method,
      data,
      header: {
        'content-type': 'application/json', //默认值
        ...headers,
      },
      success: function (res) {
        try {
          const data = res.data
          if (data.code === '000000' || JSON.parse(data).code === '000000') {
            try {
              resolve(
                url.includes('qa/mini/basic/user/login')
                  ? res.data
                  : JSON.parse(res.data)
              )
            } catch (error) {
              console.log('返回报错')
              resolve(res.data)
            }
          } else {
            const resData = JSON.parse(data)
            if (resData.code === '300002') {
              $storage.delete({
                key: 'AUTH_TOKEN_DATA',
              })
              request(options).then(resolve).catch(reject)
            } else if (resData.code === '310001') {
              quit()
            } else {
              reject(res.data)
            }
          }
        } catch (error) { }
      },
      fail: function (err) {
        reject(err)
      },
      complete: function (res) { },
    })
  })
}

export default request
