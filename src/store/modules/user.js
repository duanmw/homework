import {
  studentLogin,
  teacherLogin,
  logout
  // getInfo
} from '@/api/login'
// import {
//   getToken,
//   setToken,
//   removeToken
// } from '@/utils/auth'
import md5 from 'blueimp-md5'

const user = {
  state: {
    // token: getToken(),
    id: '',
    name: '',
    number: '',
    email: '',
    // avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif', // 暂时写死
    avatar: 'src/assets/img/student.png', // 暂时写死
    roles: []
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_NUMBER: (state, number) => {
      state.number = number
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, loginForm) {
      return new Promise((resolve, reject) => {
        if (loginForm.role === 'student') {
          const id = loginForm.studentId
          studentLogin(id, loginForm.password).then(response => {
            const data = response.data
            // setToken(data.token)
            // commit('SET_TOKEN', data.token)
            // md5('hmw'+id)
            const sid = data.id + '|' + data.number + '|' + data.name + '|' + data.roles
            // sessionStorage.setItem('roles', data.roles)
            // sessionStorage.setItem('s_number', data.number)
            sessionStorage.setItem('hmw', md5('hmw' + sid))
            sessionStorage.setItem('hmwid', sid)
            // commit('SET_NUMBER', data.number)
            // commit('SET_NAME', data.name)
            // commit('SET_ROLES', data.roles)
            resolve()
          }).catch(error => {
            reject(error)
          })
        } else if (loginForm.role === 'teacher') {
          const email = loginForm.email
          teacherLogin(email, loginForm.password).then(response => {
            const data = response.data
            // console.log(data)
            const tid = data.id + '|' + data.email + '|' + data.name + '|' + data.roles
            // sessionStorage.setItem('roles', data.roles)
            // sessionStorage.setItem('t_name', data.name)
            // sessionStorage.setItem('t_email', data.email)
            sessionStorage.setItem('hmw', md5('hmw' + tid))
            sessionStorage.setItem('hmwid', tid)

            // commit('SET_EMAIL', data.email)
            // commit('SET_NAME', data.name)
            // commit('SET_ROLES', data.roles)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    },

    // 获取用户信息
    // GetInfo({
    //   commit,
    //   state
    // }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(state.token).then(response => {
    //       const data = response.data
    //       if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //         commit('SET_ROLES', data.roles)
    //       } else {
    //         reject('getInfo: roles must be a non-null array !')
    //       }
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        // 后端登出请求
        logout(state.token).then(() => {
          // commit('SET_TOKEN', '')
          commit('SET_NAME', '')
          commit('SET_ROLES', [])
          // sessionStorage.removeItem('roles')
          sessionStorage.clear()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        // commit('SET_TOKEN', '')
        // removeToken()
        // sessionStorage.removeItem('roles')
        sessionStorage.clear()
        resolve()
      })
    }
  }
}

export default user
