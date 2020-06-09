import request from '@/utils/request'

export function get(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/mydictDetail',
    method: 'get',
    params
  })
}

export function getDictMap(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/mydictDetail/map',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/mydictDetail',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/mydictDetail/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/mydictDetail',
    method: 'put',
    data
  })
}

export default { add, edit, del }
