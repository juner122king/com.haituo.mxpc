import request from '../ajax.js'


//获取当前天气
const getNowWeather = (data) => {

  // 构建完整的URL
  const url = `https://route.showapi.com/9-5?appKey=${data.appKey}&from=${data.from}&lng=${data.lng}&lat=${data.lat}`
  return request({
    method: 'GET',
    url: url,
    isforeignAddress: true,
  })
}



let weather = {
  getNowWeather,
}

export default weather
