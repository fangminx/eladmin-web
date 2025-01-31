import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/holidayPassedRecord',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/holidayPassedRecord/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/holidayPassedRecord',
    method: 'put',
    data
  })
}

export function getPassedRecord(id) {
  const params = {
    id
  }
  return request({
    url: 'api/holidayPassedRecord/record',
    method: 'get',
    params,
  })
}

export default { add, edit, del }
