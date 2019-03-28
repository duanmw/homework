import request from '@/utils/request'
import {
  createDate
} from '@/utils/date'
import qs from 'qs'
// 待修改
export function addWork(tid, name, info) {
  return request({
    url: '/api/work/addWork',
    method: 'post',
    data: qs.stringify({
      tid,
      name,
      info,
      createtime: createDate()
    })
  })
}
export function updateWork(homework) {
  return request({
    url: '/api/work/updateWork',
    method: 'post',
    data: qs.stringify(homework)
  })
}
export function deleteWork(homework) {
  return request({
    url: '/api/work/deleteWork',
    method: 'post',
    data: qs.stringify(homework)
  })
}

export function allWorkByCid(cid) {
  return request({
    url: '/api/work/allByCid?cid=' + cid,
    method: 'get'
  })
}
