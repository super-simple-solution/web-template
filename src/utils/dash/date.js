import { getNumberOfWeek, dateFormat } from '@/utils/moment'

const oneDay = 60 * 60 * 24

export function getTimeRange(options = {}) {
  const { from, to } = options
  if (!from || !to) return 1
  const timeRange = Math.ceil((to - from) / oneDay)
  if (timeRange < 30) {
    return 1
  } else if (timeRange < 90) {
    return 2
  } else {
    return 3
  }
}

// 按周、月聚合数据
export function groupByDateType(list, type) {
  const res = {}
  const resKeyList = []
  let prevWeek
  let prevMonth
  let key
  let weekNamePre
  list.forEach((item, i) => {
    const time = item.time * 1000
    let week
    let month
    const year = new Date(time).getFullYear()
    if (type === 'week') {
      week = getNumberOfWeek(time)
      key = `${year}_${week}`
      if (prevWeek === week) {
        res[key].value += item.value
      } else {
        resKeyList.push(key)
        res[key] = {
          key,
          value: item.value,
        }
        if (weekNamePre) {
          // 补全上一个
          weekNamePre +=
            '--' +
            dateFormat(list[i - 1].time * 1000)
              .slice(-5)
              .replace('-', '.')
          res[resKeyList[resKeyList.indexOf(key) - 1]].name = weekNamePre
        }
        // 设置当前
        weekNamePre = dateFormat(time).slice(-5).replace('-', '.')
        prevWeek = week
      }
      // 补全最后一个
      if (i === list.length - 1) {
        weekNamePre += '--' + dateFormat(time).slice(-5).replace('-', '.')
        res[resKeyList[resKeyList.length - 1]].name = weekNamePre
      }
    } else if (type === 'month') {
      month = new Date(time).getMonth() + 1
      key = `${year}_${month}`
      if (prevMonth === month) {
        res[key].value += item.value
      } else {
        resKeyList.push(key)
        res[key] = {
          key,
          name: `${month}月`,
          value: item.value,
        }
        prevMonth = month
      }
    }
  })
  return resKeyList.map((key) => res[key])
}
