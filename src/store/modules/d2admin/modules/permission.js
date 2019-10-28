export default {
  namespaced: true,
  state: {
    // 用户权限
    permissions: [],
    // 角色编码
    roles: [],
    id: 0,
    config: {}
  },
  mutations: {
    set (state, data) {
      state.permissions = data.permissions
      state.roles = data.roles
      state.config = data.config
      state.id = data.id
    }
  }
}
