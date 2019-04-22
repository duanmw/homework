import request from '@/utils/request'
import qs from 'qs'

export function rightOldPwd(pwd, sid) {
  return request({
    url: '/api/student/idAndPwd',
    method: 'post',
    data: qs.stringify({
      pwd,
      sid
    })
  })
}

export function updatePwd(pwd, sid) {
  return request({
    url: '/api/student/updatePwd',
    method: 'post',
    data: qs.stringify({
      pwd,
      sid
    })
  })
}

/**
 * 判断,存在返回学生数据，不存在返回null
 * @param {string} number
 */
export function haveOne(number) {
  return request({
    url: '/api/student//oneByNumber?number=' + number,
    method: 'get'
  })
}
/**
 * 判断是否存在返回bool
 * @param {string} number
 */
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

export function allByPage(start, size) {
  return request({
    url: '/api/student/allByPage?start=' + start + '&size=' + size,
    method: 'get'
  })
}
