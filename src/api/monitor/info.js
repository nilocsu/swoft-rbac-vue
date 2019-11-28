import request from '@/plugin/axios'

export function information () {
  return request({
    url: '/system/information',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function stats () {
  return request({
    url: '/system/stats',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function processes () {
  return request({
    url: '/system/processes',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function swooleInfo () {
  return request({
    url: '/system/swoole-info',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function phpExts () {
  return request({
    url: '/system/php-exts',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
