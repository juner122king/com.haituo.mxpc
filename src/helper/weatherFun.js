/**
 * 您可以将常用的方法、或系统 API，统一封装，暴露全局，以便各页面、组件调用，而无需 require / import.
 */
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

export default {
  getWeatherInfo
}
