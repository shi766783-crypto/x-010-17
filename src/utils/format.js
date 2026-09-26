// 金额格式化：¥1,234.5（整数时不显示小数）
export function formatMoney(value) {
  const n = Number(value) || 0
  const fixed = Number.isInteger(n) ? n.toLocaleString('zh-CN') : n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  return `¥${fixed}`
}

// 日期格式化：YYYY-MM-DD -> YYYY年M月D日
export function formatDate(date) {
  if (!date) return ''
  const [y, m, d] = date.split('-')
  return `${y}年${Number(m)}月${Number(d)}日`
}

// 计算两个日期之间的天数（含首尾）
export function daysBetween(start, end) {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0
  const diff = Math.round((e - s) / 86400000)
  return diff >= 0 ? diff + 1 : 0
}
