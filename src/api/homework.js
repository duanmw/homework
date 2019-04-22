import request from '@/utils/request'
import {
  createDate
} from '@/utils/date'
import qs from 'qs'

export function addWork(cid, name, starttime, closetime, showanswer, maxsubmit) {
  return request({
    url: '/api/work/addWork',
    method: 'post',
    data: qs.stringify({
      cid,
      name,
      createtime: createDate(),
      starttime: createDate('', starttime),
      closetime: createDate('', closetime),
      showanswer: showanswer ? 'yes' : 'no',
      maxsubmit
    })
  })
}
export function updateWork(homework) {
  return request({
    url: '/api/work/updateWork',
    method: 'post',
    data: qs.stringify({
      id: homework.id,
      cid: homework.cid,
      name: homework.name,
      createtime: homework.createtime,
      starttime: createDate('', homework.starttime),
      closetime: createDate('', homework.closetime),
      showanswer: homework.showanswer ? 'yes' : 'no',
      maxsubmit: homework.maxsubmit
    })
  })
}
export function deleteWork(homework) {
  return request({
    url: '/api/work/deleteWork',
    method: 'post',
    data: qs.stringify(homework)
  })
}

export function oneWork(wid) {
  return request({
    url: '/api/work/oneWork?id=' + wid,
    method: 'get'
  })
}

export function allWorkByCid(cid) {
  return request({
    url: '/api/work/allByCid?cid=' + cid,
    method: 'get'
  })
}

export function workAndScore(cid, sid) {
  return request({
    url: '/api/work/workAndScore?cid=' + cid + '&sid=' + sid,
    method: 'get'
  })
}

export function allByPage(start, size) {
  return request({
    url: '/api/work/allByPage?start=' + start + '&size=' + size,
    method: 'get'
  })
}

export function allQByWid1(wid) { // 学生访问，后端会判断是否有答案
  return request({
    url: '/api/question/allByWid?wid=' + wid,
    method: 'get'
  })
}

export function allQByWid2(wid) { // 教师访问,有答案
  return request({
    url: '/api/question/allQByWid?wid=' + wid,
    method: 'get'
  })
}

export function addQuestion(question) {
  return request({
    url: '/api/question/addQuestion',
    method: 'post',
    // data: qs.stringify(question)
    // 直接传对象，后端要使用 @RequestBody 接收
    data: question
  })
}

export function addWQ(wqArr) {
  return request({
    url: '/api/question/addWQ',
    method: 'post',
    // data: qs.stringify(question)
    data: wqArr
  })
}

export function addAnswer(answer) {
  return request({
    url: '/api/answer/addAnswer',
    method: 'post',
    // data: qs.stringify(answer)
    data: answer
  })
}

export function submitWork(sid, wid, spendtime, answers) {
  return request({
    url: '/api/answer/submitWork',
    method: 'post',
    data: {
      sid,
      wid,
      spendtime,
      answers,
      submittime: createDate()
    }
  })
}
