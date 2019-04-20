import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  Message, MessageBox
} from 'element-ui'
import {
  getInfo
} from '@/utils/userinfo' // getInfo

NProgress.configure({
  showSpinner: false
}) // NProgress configuration

const whiteList = ['/login', '/register'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()

  // set page title
  document.title = (to.meta.title ? to.meta.title + ' - ' : '') + '作业管理系统'

  // if (getToken()) {
  if (sessionStorage.getItem('hmwid')) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        if (getInfo()) { // 拉取用户信息
          const roles = store.getters.roles // note: roles must be a array! such as: ['editor','develop']

          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        } else {
          store.dispatch('FedLogOut').then(() => {
            Message.error('身份验证失败，请重新登录')
            next({
              path: '/'
            })
          })
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
