import request from '@/utils/request'

// 查询用户列表
export function test(query) {
  return request({
    url: 'api/websocket/send',
    method: 'get',
    params: query
  })
}
