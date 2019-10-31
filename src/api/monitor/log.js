import request from '@/plugin/axios'

export function getLogList (query) {
  return request({
    url: '/system/log',
    method: 'get',
    params: query,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function delLog (data) {
  return request({
    url: '/system/log',
    method: 'delete',
    data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function loginLog (query) {
  return request({
    url: '/system/login/log',
    method: 'get',
    params: query,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function delLoginLog (data) {
  return request({
    url: '/system/login/log',
    method: 'delete',
    data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
