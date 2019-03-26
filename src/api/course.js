import request from '@/utils/request'
import {
  createDate
} from '@/utils/date'
import qs from 'qs'
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

export function allCourseByTid(tid) {
  return request({
    url: '/api/course/allByTid?tid=' + tid,
    method: 'get'
  })
}
