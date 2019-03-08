/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isvalidStudentID(str) { // 学号
  const sIdReg = /^[0-9]{10}$/
  return sIdReg.test(str)
}
export function isvalidEmail(str) { // 邮箱
  const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  return emailReg.test(str)
}
export function isvalidVerifyCode(str) { // 验证码
  const codeReg = /^[0-9]{6}$/
  return codeReg.test(str)
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
