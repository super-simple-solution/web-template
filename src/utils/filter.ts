// 百分比
export function percentage(value: number | string, digts = 2, canOverflow = false) {
  value = Number(value)
  if (isNaN(value)) return '0%'
  if (value < 0) {
    return '0%'
  } else if (value > 1 && !canOverflow) {
    return '100%'
  } else {
    return (value * 100).toFixed(digts) + '%'
  }
}

export function toFixed(value: number | string, digts = 2) {
  value = Number(value)
  if (isNaN(value)) return '0.00'
  return value.toFixed(digts)
}

// 超出省略
export function overlength(value: string, len: number) {
  if (!value || value.length < len) return value
  return value.slice(0, len) + '...'
}

export default {
  percentage,
  overlength,
  toFixed,
}
