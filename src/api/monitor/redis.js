import request from '@/plugin/axios'

export function info () {
  return request({
    url: '/system/redis/info',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function keysSize () {
  return request({
    url: '/system/redis/keysSize',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function memoryInfo () {
  return request({
    url: '/system/redis/memoryInfo',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
