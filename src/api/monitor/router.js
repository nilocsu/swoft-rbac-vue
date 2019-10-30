import request from '@/plugin/axios'

export function getHttpRoutes () {
  return request({
    url: '/system/http/routes',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function getWsRoutes () {
  return request({
    url: '/system/ws/routes',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function getRpcRoutes () {
  return request({
    url: '/system/rpc/routes',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
