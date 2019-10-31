import * as userService from '@/api/sys/user'
import { frameInRoutes } from '@/router/routes'
import autoGenerateMenusAndRouters from '@/development'

function filterAsyncRouter (routes) {
  let length = routes.length
  let routeMap = []
  for (let i = 0; i < length; i++) {
    let route = routes[i]
    let component = ''
    let r = {}
    switch (route.component) {
      case 'MenuView':
      case 'PageView':
      case 'EmptyPageView':
      case 'HomePageView':
        r = {
          'name': route.name && route.name !== '' ? route.name : route.menuName,
          'path': route.path,
          'icon': route.icon,
          'component': () => import(`@/layout/header-aside`),
          'meta': {
            'title': route.menuName,
            'cache': true
          }
        }
        break
      default:
        r = {
          'name': route.name && route.name !== '' ? route.name : route.menuName,
          'path': route.path,
          'icon': route.icon,
          'component': () => import(`@/views/` + component),
          'meta': {
            'title': route.menuName,
            'cache': true
          }
        }
        component = route.component
    }
    if (route.children && route.children.length) {
      r.children = filterAsyncRouter(route.children)
    }
    routeMap.push(r)
  }
  return routeMap
}

function parserTitle (routes) {
  return routes.filter((route) => {
    let component = route.component
    if (component) {
      route.title = route.menuName
      if (route.children && route.children.length) {
        route.children = parserTitle(route.children)
      }
      return true
    }
  })
}

export default {
  namespaced: true,
  state: {
    // 用户权限
    permissions: [],
    // 角色编码
    roles: [],
    id: 0,
    config: {},
    router: [],
    allMenuHeader: [],
    allMenuAside: []
  },
  mutations: {
    set (state, data) {
      state.permissions = data.permissions
      state.roles = data.roles
      state.config = data.config
      state.id = data.id
    }
  },
  actions: {
    reload ({ dispatch, state, commit }, fn) {
      return new Promise(async resolve => {
        await userService.getProfileMenus().then(async res => {
          let permissionMenu = parserTitle(res.menu)
          let permissionRouter = [...filterAsyncRouter(res.menu)]
          state.permissions = res.permissions
          state.roles = res.roles
          state.router = permissionRouter
          if (typeof fn === 'function') {
            fn()
          }
          // 组合代码生成器生成的菜单和路由
          permissionMenu = [...permissionMenu, ...autoGenerateMenusAndRouters.menus]
          state.allMenuAside = [...[{ path: '/index', title: '首页', icon: 'home' }], ...permissionMenu]
          state.allMenuHeader = [...[{ path: '/index', title: '首页', icon: 'home' }], ...permissionMenu]
          // // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
          dispatch('d2admin/page/isLoaded', null, { root: true })
          // 处理路由 得到每一级的路由设置
          commit('d2admin/page/init', [...frameInRoutes, ...state.router], { root: true })
          // // 设置顶栏菜单
          commit('d2admin/menu/headerSet', state.allMenuHeader, { root: true })
          // // 设置侧边栏菜单
          commit('d2admin/menu/asideSet', state.allMenuAside, { root: true })
          // // 初始化菜单搜索功能
          commit('d2admin/search/init', state.allMenuHeader, { root: true })
          // 加载上次退出时的多页列表
          dispatch('d2admin/page/openedLoad', null, { root: true })
          await Promise.resolve()
        })
        resolve()
      })
    },
    /**
    * @description 用户登录后从持久化数据加载一系列的设置
    * @param {Object} state vuex state
    */
    load ({ commit, dispatch, state }) {
      return new Promise(async resolve => {
        dispatch('d2admin/page/isLoaded', null, { root: true })
        // 处理路由 得到每一级的路由设置
        commit('d2admin/page/init', [...frameInRoutes, ...state.router], { root: true })
        // // 设置顶栏菜单
        commit('d2admin/menu/headerSet', state.allMenuHeader, { root: true })
        // // 设置侧边栏菜单
        commit('d2admin/menu/asideSet', state.allMenuAside, { root: true })
        // // 初始化菜单搜索功能
        commit('d2admin/search/init', state.allMenuHeader, { root: true })
        // 加载上次退出时的多页列表
        dispatch('d2admin/page/openedLoad', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
