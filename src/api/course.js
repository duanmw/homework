import request from '@/utils/request'
import {
  createDate
} from '@/utils/date'
import qs from 'qs'
export function isExist(tid, name) {
  return request({
    url: '/api/course/existsByName?tid=' + tid + '&name=' + name,
    method: 'get'
  })
}
export function addCourse(tid, name, info) {
  return request({
    url: '/api/course/addCourse',
    method: 'post',
    data: qs.stringify({
      tid,
      name,
      info,
      createtime: createDate()
    })
  })
}

export function getOneCourse(cid) {
  return request({
    url: '/api/course/editCourse?id=' + cid,
    method: 'get'
  })
}
export function updateCourse(course) {
  return request({
    url: '/api/course/updateCourse',
    method: 'post',
    data: qs.stringify(course)
  })
}
export function deleteCourse(course) {
  return request({
    url: '/api/course/deleteCourse',
    method: 'post',
    data: qs.stringify(course)
  })
}

export function allCourseByTid(tid) {
  return request({
    url: '/api/course/allByTid?tid=' + tid,
    method: 'get'
  })
}
