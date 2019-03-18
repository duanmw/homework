import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  Message
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
          next()
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
