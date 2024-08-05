import request from '../ajax.js'


//获取7天当前天气
const get7dayWeather = (data) => {

  // 构建完整的URL
  const url = `https://route.showapi.com/9-5?appKey=${data.appKey}&from=${data.from}&lng=${data.lng}&lat=${data.lat}&needMoreDay=${data.needMoreDay}&need3HourForcast=${data.need3HourForcast}`
  return request({
    method: 'GET',
    url: url,
    isforeignAddress: true,
  })
}

let weather = {
  get7dayWeather,
}

export default weather
