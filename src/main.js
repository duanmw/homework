import 'babel-polyfill' // 浏览器兼容性
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import animate from 'animate.css'
Vue.use(animate)
/**
 * This project originally used easy-mock to simulate data,
 * but its official service is very unstable,
 * and you can build your own service if you need it.
 * So here I use Mock.js for local emulation,
 * it will intercept your request, so you won't see the request in the network.
 * If you remove `../mock` it will automatically request easy-mock data.
 */
// import '../mock' // simulation data

Vue.use(ElementUI, {
  // locale
})

Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//   // console.log(to)

//   if (to.path === '/login') {
//     document.title = '登录 | 作业管理系统'
//   } else if (to.path === '/register') {
//     document.title = '注册 | 作业管理系统'
//   } else {
//     document.title = '作业管理系统'
//   }
//   next()
// })

Vue.filter('substrDate', function(value) { // 全局过滤器，19位日期取前16位
  if (!value) return ''
  if (value.length === 19) {
    return value.substring(0, 16)
  } else {
    return value
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
