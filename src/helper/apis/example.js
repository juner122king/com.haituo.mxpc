import request from '../ajax.js'

// 登录
const toLogin = (data) => {
  return request({
    method: 'POST',
    url: `/qa/mini/basic/user/login`,
    data,
  })
}

// 获取本月收支信息
const getMoonInfo = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/ac/moon/info`,
    data,
  })
}
// 获取月流水账单列表
const getSummaryList = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/ac/summary/list`,
    data,
  })
}
// 流水账单列表
const getAcList = (data) => {
  return request({
    method: 'GET',
    url: `/qa/mini/basic/ac/list`,
    data,
  })
}

// 记一笔
const postMakeANote = (data) => {
  return request({
    method: 'POST',
    url: `/qa/mini/basic/ac/makeANote`,
    data,
  })
}

// 删除账单收支记录
const delectBillRecord = (data) => {
  return request({
    method: 'DELETE',
    url: `/qa/mini/basic/ac/${data.id}`,
    data,
  })
}

// 修改账单收支记录
const changeBillRecord = (data) => {
  return request({
    method: 'PUT',
    url: `/qa/mini/basic/ac/update/${data.id}`,
    data,
  })
}

// 修改账单收支记录
const userPhoneLogout = (data) => {
  return request({
    method: 'PUT',
    url: `/qa/mini/basic/user/phone/logout`,
    data,
  })
}

export default {
  toLogin,
  getMoonInfo,
  postMakeANote,
  getSummaryList,
  getAcList,
  delectBillRecord,
  changeBillRecord,
  userPhoneLogout
}
