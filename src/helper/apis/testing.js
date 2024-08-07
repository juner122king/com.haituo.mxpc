import request from '../ajax.js'


//列表
const list = () => {

  // 构建完整的URL
  const url = `/qa/mini/mxpc/problem/list?size=99`
  return request({
    method: 'GET',
    url: url
  })
}

//详情
const detail = (id) => {
  // 构建完整的URL
  const url = `/qa/mini/mxpc/problem/detail?id=${id}`
  return request({
    method: 'GET',
    url: url
  })
}


let testing = {
  list,
  detail
}

export default testing
