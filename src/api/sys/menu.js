import request from '@/plugin/axios'

export function getMenuList () {
  return request({
    url: '/system/menu',
    method: 'get',
    interfaceCheck: true,
    loading: {
      type: 'loading',
      options: {
        fullscreen: true,
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      }
    }
  })
}
export function getMenuListTree () {
  return request({
    url: '/system/menu/tree',
    method: 'get',
    interfaceCheck: true,
    loading: {
      type: 'loading',
      options: {
        fullscreen: true,
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      }
    }
  })
}
export function getMenu (id) {
  return request({
    url: '/system/menu/' + id,
    method: 'get',
    interfaceCheck: true,
    loading: {
      type: 'nprogress',
      interval: 1000
    }
  })
}
export function addMenu (data) {
  return request({
    url: '/system/menu',
    method: 'post',
    interfaceCheck: true,
    data,
    loading: {
      type: 'nprogress',
      interval: 1000
    },
    success: {
      type: 'message',
      options: {
        message: '保存成功',
        type: 'success'
      }
    }
  })
}
export function updateMenu (id, data) {
  return request({
    url: '/system/menu/' + id,
    method: 'put',
    interfaceCheck: true,
    data,
    loading: {
      type: 'nprogress',
      interval: 1000
    },
    success: {
      type: 'message',
      options: {
        message: '更新成功',
        type: 'success'
      }
    }
  })
}
export function delMenu (data) {
  return request({
    url: '/system/menu',
    interfaceCheck: true,
    method: 'delete',
    data,
    success: {
      type: 'message',
      options: {
        message: '删除成功',
        type: 'success'
      }
    }
  })
}
export function getMenuParentIds (id) {
  return request({
    url: `/system/menu/${id}/parentId`,
    method: 'get',
    interfaceCheck: true,
    loading: {
      type: 'nprogress',
      interval: 1000
    }
  })
}
export function exportMenu (data) {
  return request({
    url: '/system/menu',
    interfaceCheck: true,
    method: 'post',
    data,
    success: {
      type: 'message',
      options: {
        message: '导出成功',
        type: 'success'
      }
    }
  })
}
