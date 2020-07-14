import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/holidayRecord',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/holidayRecord/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/holidayRecord',
    method: 'put',
    data
  })
}

export function getCanlendarInfo(userName) {
  const params = {
    userName
  }
  return request({
    url: 'api/holidayRecord/canlendarInfo',
    method: 'get',
    params,
  })
}

export default { add, edit, del }
