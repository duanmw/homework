import request from '@/utils/request'
import md5 from 'blueimp-md5'
import qs from 'qs'
export function studentLogin(sid, password) {
  return request({
    url: '/api/student/login',
    method: 'post',
    data: qs.stringify({
      number: sid,
      password: md5(password)
    })
  })
}

export function teacherLogin(email, password) {
  return request({
    url: '/api/teacher/login',
    method: 'post',
    data: qs.stringify({
      email,
      password: md5(password)
    })
  })
}

// export function getTeacherInfo(token) {
//   return request({
//     url: '/api/teacher/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout() {
  return request({
    url: '/api/teacher/logout',
    method: 'post'
  })
}
