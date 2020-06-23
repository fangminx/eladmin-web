import request from '@/utils/request'

export function getDicts() {
  return request({
    url: 'api/mydict/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/mydict',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mydict/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mydict',
    method: 'put',
    data
  })
}

export function getAllConditions() {
  return request({
    url: 'api/mydict/all/condition',
    method: 'get'
  })
}

export default { add, edit, del }
