import request from '../ajax.js'

//扫描工具
const postUploadOcr = (data) => {
  return request({
    method: 'POST',
    url: `https://route.showapi.com/926-1?appKey=987B764e44e24b04b2dFc49D9D6e0ad0`,
    data,
    isforeignAddress: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })
}

//测吉凶

const postFortuneTelling = (data, id) => {
  return request({
    method: 'POST',
    url: `https://route.showapi.com/1617-${id}?appKey=987B764e44e24b04b2dFc49D9D6e0ad0`,
    data,
    isforeignAddress: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })
}

//创建二维码

const createQrcoed = (data) => {
  return request({
    method: 'POST',
    url: `https://route.showapi.com/887-1?appKey=987B764e44e24b04b2dFc49D9D6e0ad0`,
    data,
    isforeignAddress: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })
}

// 二维码识别(Base64)
const qrCodeRecognition = (data) => {
  return request({
    method: 'POST',
    url: `https://route.showapi.com/887-4?appKey=987B764e44e24b04b2dFc49D9D6e0ad0`,
    data,
    isforeignAddress: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })
}

// 手机号码归属地查询
const numberLocationQuery = (data) => {
  return request({
    method: 'POST',
    url: `https://route.showapi.com/6-1?appKey=987B764e44e24b04b2dFc49D9D6e0ad0`,
    data,
    isforeignAddress: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })
}

// 周公解梦
const untieDream = (data) => {
  return request({
    method: 'POST',
    url: `https://route.showapi.com/1601-2?appKey=987B764e44e24b04b2dFc49D9D6e0ad0`,
    data,
    isforeignAddress: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })
}

let tools = {
  postUploadOcr,
  postFortuneTelling,
  createQrcoed,
  qrCodeRecognition,
  numberLocationQuery,
  untieDream,
}

export default tools
