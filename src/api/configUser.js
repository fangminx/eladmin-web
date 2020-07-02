import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/configUser',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/configUser/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/configUser',
    method: 'put',
    data
  })
}

export function getHoliday(userName) {
  const params = {
    userName
  }
  return request({
    url: 'api/configUser/day',
    method: 'get',
    params,
  })
}

export default { add, edit, del }
