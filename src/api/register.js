import request from '@/utils/request'
import md5 from 'blueimp-md5'
import qs from 'qs'
export function register(email, password) {
  return request({
    url: '/api/teacher/addTeacher',
    method: 'post',
    data: qs.stringify({
      email,
      password: md5(password)
    })
  })
}

export function sendVCode(email) {
  return request({
    url: '/api/teacher/sendvcode?email=' + email,
    method: 'get'
  })
}
export function isExist(email) {
  return request({
    url: '/api/teacher/findByEmail?email=' + email,
    method: 'get'
  })
}
