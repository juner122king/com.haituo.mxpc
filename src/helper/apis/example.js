import request from '../ajax.js'

// 登录
const toLogin = (data) => {
  return request({
    method: 'POST',
    url: `/qa/mini/basic/user/login`,
    data,
  })
}

const userPhoneLogout = (data) => {
  return request({
    method: 'PUT',
    url: `/qa/mini/basic/user/phone/logout`,
    data,
  })
}

export default {
  toLogin,
  userPhoneLogout
}
