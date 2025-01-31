import request from '@/utils/request'

export function get(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/realDetail',
    method: 'get',
    params
  })
}

export function getRealMap(realName) {
  const params = {
    realName,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/realDetail/map',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/realDetail',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/realDetail/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/realDetail',
    method: 'put',
    data
  })
}

export default { add, edit, del }
