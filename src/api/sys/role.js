import request from '@/plugin/axios'
export function getRolePagedList (query) {
  return request({
    url: '/system/role',
    method: 'get',
    params: query,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function getRole (id) {
  return request({
    url: `/system/role/${id}`,
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function checkRoleName (name) {
  return request({
    url: '/system/role/check',
    method: 'get',
    params: { 'name': name },
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function addRole (data) {
  return request({
    url: '/system/role',
    method: 'post',
    data,
    success: {
      type: 'message',
      options: {
        message: '保存成功',
        type: 'success'
      }
    }
  })
}
export function delRoles (ids) {
  return request({
    url: '/system/role',
    method: 'delete',
    data: { ids: ids },
    success: {
      type: 'message',
      options: {
        message: '删除成功',
        type: 'success'
      }
    }
  })
}
export function saveRole (roleId, data) {
  return request({
    url: '/system/role/' + roleId,
    method: 'put',
    data: data,
    success: {
      type: 'message',
      options: {
        message: '保存成功',
        type: 'success'
      }
    }
  })
}
export function getRoleUsers (roleId) {
  return request({
    url: '/system/role/' + roleId + '/user',
    method: 'get',
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
export function getRoleMenus (roleId) {
  return request({
    url: '/system/role/' + roleId + '/menu',
    method: 'get',
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
export function updateRoleMenus (roleId, data) {
  return request({
    url: '/system/role/' + roleId + '/menu',
    method: 'put',
    data,
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
