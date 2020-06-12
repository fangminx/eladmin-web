import request from '@/utils/request'

export function getReals() {
  return request({
    url: 'api/real/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/real',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/real/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/real',
    method: 'put',
    data
  })
}

export default { add, edit, del }
