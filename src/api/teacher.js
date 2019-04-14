import request from '@/utils/request'
import qs from 'qs'

export function addTeacher(teacher) {
  return request({
    url: '/api/teacher/addTeacher',
    method: 'post',
    data: teacher
  })
}

export function updateName(name, tid) {
  return request({
    url: '/api/teacher/updateName',
    method: 'post',
    data: qs.stringify({
      name,
      tid
    })
  })
}

export function rightOldPwd(pwd, tid) {
  return request({
    url: '/api/teacher/idAndPwd',
    method: 'post',
    data: qs.stringify({
      pwd,
      tid
    })
  })
}

export function updatePwd(pwd, tid) {
  return request({
    url: '/api/teacher/updatePwd',
    method: 'post',
    data: qs.stringify({
      pwd,
      tid
    })
  })
}
export function deleteTeacher(teacher) {
  return request({
    url: '/api/teacher/deleteTeacher',
    method: 'post',
    data: qs.stringify(teacher)
  })
}

export function allByPage(start, size) {
  return request({
    url: '/api/teacher/allByPage?start=' + start + '&size=' + size,
    method: 'get'
  })
}
