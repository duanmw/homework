// import Cookies from 'js-cookie'
import store from '../store'
// const TokenKey = 'hms_token'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

export function getInfo() {
  if (sessionStorage.getItem('roles').includes('student')) {
    store.commit('SET_NAME', sessionStorage.getItem('s_name'))
    store.commit('SET_NUMBER', sessionStorage.getItem('s_number'))
  } else if (sessionStorage.getItem('roles').includes('teacher')) {
    store.commit('SET_NAME', sessionStorage.getItem('t_name'))
    store.commit('SET_EMAIL', sessionStorage.getItem('t_email'))
  }
  // return Cookies.remove(TokenKey)
}
