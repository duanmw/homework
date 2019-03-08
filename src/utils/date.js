export function createDate(pattern = '') {
  let symbol = '-'
  if (pattern.match(/^[y]{4}(\D+)[m]{2}/i)) {
    symbol = RegExp.$1
  }

  const dt = new Date()
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2, '0')
  const d = dt.getDate().toString().padStart(2, '0')

  if (pattern.match(/^[y]{4}(\D+)[m]{2}$/i)) { // yyyy-mm
    return y + symbol + m
  } else if (pattern.match(/^[y]{4}\D+[m]{2}\D+[d]{2}$/i)) { // yyyy-mm-dd
    return y + symbol + m + symbol + d
  } else {
    const hh = dt.getHours().toString().padStart(2, '0')
    const mm = dt.getMinutes().toString().padStart(2, '0')
    const ss = dt.getSeconds().toString().padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
}
