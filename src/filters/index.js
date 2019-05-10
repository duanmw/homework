export function substrDate(value) { // 过滤器，19位日期取前16位
  if (!value) return ''
  if (value.length === 19) {
    return value.substring(0, 16)
  } else {
    return value
  }
}

export function showType(type) { // 根据字母显示习题类型
  if (!type) return ''
  switch (type) {
    case 'a':
      return '单选题'
    case 'b':
      return '多选题'
    case 'c':
      return '判断题'
    case 'd':
      return '填空题'
    default:
      return '题'
  }
}
