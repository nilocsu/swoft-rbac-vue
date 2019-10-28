import request from '@/plugin/axios'
export function getUser (id) {
  return request({
    url: '/system/admin/' + id,
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function getUserProfile () {
  return request({
    url: '/system/admin/profile',
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function getProfileMenus () {
  return request({
    url: '/system/admin/menu',
    method: 'get'
  })
}
export function checkName (query) {
  return request({
    url: '/system/admin/check',
    method: 'get',
    params: query
  })
}
export function getUserList (query) {
  return request({
    url: '/system/admin',
    method: 'get',
    params: query,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function addUser (data) {
  return request({
    url: '/system/admin',
    method: 'post',
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
export function updateUser (id, data) {
  return request({
    url: '/system/admin/' + id,
    method: 'put',
    data: data,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function getUserRole (id) {
  return request({
    url: `/system/admin/${id}/role`,
    method: 'get',
    success: {
      type: 'message',
      options: {
        message: '保存成功',
        type: 'success'
      }
    }
  })
}
export function updateUserRole (id, data) {
  return request({
    url: `/system/admin/${id}/role`,
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
export function delUsers (ids) {
  return request({
    url: '/system/admin',
    method: 'delete',
    data: { 'ids': ids },
    success: {
      type: 'message',
      options: {
        message: '删除成功',
        type: 'success'
      }
    }
  })
}
export function updateProfile (data) {
  return request({
    url: '/system/admin/profile',
    method: 'put',
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
export function updateAvatar (avatar) {
  return request({
    url: '/system/admin/avatar',
    method: 'put',
    data: {
      'avatar': avatar
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
export function updatePassword (password) {
  return request({
    url: '/system/admin/password',
    method: 'put',
    data: {
      'password': password
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
