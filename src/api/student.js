import request from '@/utils/request'
import {
  createDate
} from '@/utils/date'
import qs from 'qs'

export function haveOne(number) {
  return request({
    url: '/api/student//oneByNumber?number=' + number,
    method: 'get'
  })
}

export function isExist(number) {
  return request({
    url: '/api/student/existsByNumber?number=' + number,
    method: 'get'
  })
}

export function addStudent(students) {
  return request({
    url: '/api/student/addStudent',
    method: 'post',
    data: students
  })
}

export function addSC(scArr) {
  return request({
    url: '/api/student/addSC',
    method: 'post',
    data: scArr
  })
}
export function deleteSC(sid, cid) {
  return request({
    url: '/api/student/deleteSC',
    method: 'post',
    data: qs.stringify({
      sid,
      cid
    })
  })
}

export function getOneStudent(cid) {
  return request({
    url: '/api/student/editStudent?id=' + cid,
    method: 'get'
  })
}

export function updateStudent(number, classname, name, sid) {
  return request({
    url: '/api/student/updateStudent',
    method: 'post',
    data: qs.stringify({
      number,
      classname,
      name,
      sid
    })
  })
}
export function deleteStudent(student) {
  return request({
    url: '/api/student/deleteStudent',
    method: 'post',
    data: qs.stringify(student)
  })
}
/**
 *
 * @param {number} cid 课程id
 * @param {number} start 第几页
 * @param {number} size 每页大小
 */
export function allStudentByCid(cid, start, size) {
  return request({
    url: '/api/student/allByCid?cid=' + cid + '&start=' + start + '&size=' + size,
    method: 'get'
  })
}
// export function allStudentByCid(cid, query) {
//   return request({
//     url: '/api/student/allByCid?cid=' + cid + '&start=' + (query.page - 1) + '&size=' + query.limit,
//     method: 'get'
//   })
// }
