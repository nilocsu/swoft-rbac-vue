import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'

// 路由数据
import routes from './routes'
// 固定菜单与路由
// import menuHeader from '@/menu/header'
// import menuAside from '@/menu/aside'
import { frameInRoutes } from '@/router/routes'
// import layoutHeaderAside from '@/layout/header-aside'

// 模拟动态菜单与路由
// import { permissionMenu, permissionRouter } from '@/mock/permissionMenuAndRouter'
// 代码生成器生成的菜单与路由
import autoGenerateMenusAndRouters from '@/development'
import * as userService from '@/api/sys/user'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

let permissionMenu = []
let permissionRouter = [
  // {
  //   path: '/',
  //   redirect: { name: 'index' },
  //   component: layoutHeaderAside
  // }
]

let permission = {
  permissions: [],
  roles: []
}

// 标记是否已经拉取权限信息
let isFetchPermissionInfo = false

let fetchPermissionInfo = async () => {
  // 处理动态添加的路由
  try {
    let res = await userService.getProfileMenus()
    permissionMenu = parserTitle(res.menu)
    permissionRouter = [...filterAsyncRouter(res.menu)]
    permission.permissions = res.permissions
    permission.roles = res.roles
    permission.id = res.id
  } catch (ex) {
    console.log(ex)
  }

  // 组合代码生成器生成的菜单和路由
  permissionMenu = [...permissionMenu, ...autoGenerateMenusAndRouters.menus]
  let allMenuAside = [...[{ path: '/index', title: '首页', icon: 'home' }], ...permissionMenu]
  let allMenuHeader = [...[{ path: '/index', title: '首页', icon: 'home' }], ...permissionMenu]
  // 动态添加路由
  router.addRoutes(permissionRouter)
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  store.dispatch('d2admin/page/isLoaded')
  // 处理路由 得到每一级的路由设置
  store.commit('d2admin/page/init', [...frameInRoutes, ...permissionRouter])
  // 设置顶栏菜单
  store.commit('d2admin/menu/headerSet', allMenuHeader)
  // 设置侧边栏菜单
  store.commit('d2admin/menu/asideSet', allMenuAside)
  // 初始化菜单搜索功能
  store.commit('d2admin/search/init', allMenuHeader)
  // 设置权限信息
  store.commit('d2admin/permission/set', permission)
  // 加载上次退出时的多页列表
  store.dispatch('d2admin/page/openedLoad')
  await Promise.resolve()
}
// 免校验token白名单
let whiteList = ['/login']

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  const token = util.cookies.get('token')
  if (whiteList.indexOf(to.path) === -1) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    if (token && token !== 'undefined') {
      // 拉取权限信息
      if (!isFetchPermissionInfo) {
        await fetchPermissionInfo()
        isFetchPermissionInfo = true
        next(to.path, true)
      } else {
        next()
      }
    } else {
      // 将当前预计打开的页面完整地址临时存储 登录后继续跳转
      // 这个 cookie(redirect) 会在登录后自动删除
      util.cookies.set('redirect', to.fullPath)
      // 没有登录的时候跳转到登录界面
      next({
        name: 'login'
      })
    }
    // next()
    // await fetchPermissionInfo()
  } else {
    if (to.name === 'login') {
      // 如果已经登录，则直接进入系统
      if (token && token !== undefined) {
        next(from.path, true)
        NProgress.done()
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 需要的信息
  const app = router.app
  // const { name, params, query } = to
  // 多页控制 打开新的页面
  app.$store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

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
          'title': route.menuName,
          'name': route.menuName,
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
          'title': route.menuName,
          'name': route.menuName,
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

export default router
