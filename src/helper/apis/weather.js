import request from '../ajax.js'


//获取7天当前天气-坐标
const get7dayWeather = (data) => {

  // 构建完整的URL
  const url = `https://route.showapi.com/9-5?appKey=${data.appKey}&from=${data.from}&lng=${data.lng}&lat=${data.lat}&needMoreDay=${data.needMoreDay}&need3HourForcast=${data.need3HourForcast}`
  return request({
    method: 'GET',
    url: url,
    isforeignAddress: true,
  })
}

//获取7天当前天气-城市
const get7dayWeatherforArea = (data) => {

  // 构建完整的URL
  const url = `https://route.showapi.com/9-2?appKey=${data.appKey}&area=${data.area}&needMoreDay=${data.needMoreDay}&need3HourForcast=${data.need3HourForcast}`
  return request({
    method: 'GET',
    url: url,
    isforeignAddress: true,
  })
}


let weather = {
  get7dayWeather,
  get7dayWeatherforArea
}

export default weather
