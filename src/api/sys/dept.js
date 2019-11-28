import request from '@/plugin/axios'
export function getDeptTree (query) {
  return request({
    url: '/system/dept/tree',
    method: 'get',
    params: query,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function getDeptList (query) {
  return request({
    url: '/system/dept',
    method: 'get',
    params: query,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function getDept (id) {
  return request({
    url: `/system/dept/${id}`,
    method: 'get',
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}
export function addDept (data) {
  return request({
    url: '/system/dept',
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
export function delDept (ids) {
  return request({
    url: '/system/dept',
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
    url: '/system/dept/' + roleId,
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
