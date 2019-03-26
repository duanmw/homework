// import Cookies from 'js-cookie'
import store from '../store'
// const TokenKey = 'hms_token'
import md5 from 'blueimp-md5'
// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }
/**
 * 从session获取用户信息，并设置vuex的store
 */
export function getInfo() {
  const id = sessionStorage.getItem('hmwid')
  if (md5('hmw' + id) === sessionStorage.getItem('hmw')) { // md5‘加盐’
    const arr = id.split('|')
    if (arr[3]) {
      const roles = arr[3].split(',')
      store.commit('SET_ROLES', roles)
      if (roles.includes('student')) {
        store.commit('SET_ID', arr[0])
        store.commit('SET_NUMBER', arr[1])
        store.commit('SET_NAME', arr[2])
      } else if (roles.includes('teacher')) {
        store.commit('SET_ID', arr[0])
        store.commit('SET_EMAIL', arr[1])
        store.commit('SET_NAME', arr[2])
      }
    }
    return true
  } else {
    return false
  }

  // return Cookies.remove(TokenKey)
}
