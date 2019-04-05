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

export function allQuestionByWid(wid) {
  return request({
    url: '/api/question/allByWid?wid=' + wid,
    method: 'get'
  })
}

export function addQuestion(question) {
  return request({
    url: '/api/question/addQuestion',
    method: 'post',
    // data: qs.stringify(question)
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
