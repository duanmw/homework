import request from '@/utils/request'

export function register(registerForm) {
  return request({
    url: '/api/teacher/register',
    method: 'post',
    data: {
      email: registerForm.email,
      password: registerForm.password
    }
  })
}

export function sendVCode(email) {
  return request({
    url: '/api/teacher/sendvcode?email=' + email,
    method: 'get'
  })
}
