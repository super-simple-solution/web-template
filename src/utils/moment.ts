export function dateTimeFormat(time: number | string): string {
  if (!time) return ''
  const t = parseDate(time)
  if (!t) return ''
  const month = timePad(t.getMonth() + 1)
  const date = timePad(t.getDate())
  const hour = timePad(t.getHours())
  const minute = timePad(t.getMinutes())
  const second = timePad(t.getSeconds())
  return `${t.getFullYear()}-${month}-${date} ${hour}:${minute}:${second}`
}

export function dateFormat(time: number | string): string {
  if (!time) return ''
  const t = parseDate(time)
  if (!t) return ''
  const month = timePad(t.getMonth() + 1)
  const date = timePad(t.getDate())
  return `${t.getFullYear()}-${month}-${date}`
}

export function hourFormat(time: number | string): string {
  //时分
  if (!time) return ''
  const t = parseDate(time)
  if (!t) return ''
  const hour = timePad(t.getHours())
  const minute = timePad(t.getMinutes())
  return `${hour}:${minute}`
}

export function timeFormat(time: number | string): string {
  if (!time) return ''
  const t = parseDate(time)
  if (!t) return ''
  const hour = timePad(t.getHours())
  const minute = timePad(t.getMinutes())
  const second = timePad(t.getSeconds())
  return `${hour}:${minute}:${second}`
}

export function getTimestamp(datetime: number | string) {
  return new Date(datetime).getTime()
}

export function getDateRange(range: Date[]) {
  const t = range || []
  const day = 24 * 60 * 60
  return {
    from: t[0] ? Math.floor(t[0].getTime() / 1000) : 0,
    to: t[1] ? Math.floor(t[1].getTime() / 1000) + day - 1 : 0,
  }
}

const REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/

function parseDate(date: string | number | Date) {
  if (!date && date !== 0) return
  if (date instanceof Date) return new Date(date)
  if (typeof date === 'string' && !/Z$/i.test(date)) {
    const d = date.match(REGEX_PARSE)
    if (d) {
      const m = +d[2] - 1 || 0
      const ms = (d[7] || '0').substring(0, 3)
      return new Date(+d[1], m, +d[3] || 1, +d[4] || 0, +d[5] || 0, +d[6] || 0, +ms)
    }
  }

  const t = new Date(date)

  if (!isValidDate(t)) return

  return t // everything else
}

export function formatTimeToSeconds(time: number): number {
  if (!time) return 0
  const timeStr = time.toString()
  if (timeStr.length > 10) {
    time = Math.ceil(time / 1000)
  }
  return time
}

export function getTodayTimestampSecond(): number {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.ceil(startOfDay / 1000)
}

export function getTomorrowTimestampSecond(): number {
  const today = getTodayTimestampSecond()
  return today + 86400
}

export function dateFormatMonth(timestamp: number, format = ''): string {
  if (!timestamp) return ''
  if (typeof timestamp === 'string') {
    timestamp = +timestamp
  }
  const t = new Date(timestamp)
  const month = (t.getMonth() + 1 + '').padStart(2, '0')
  if (format) {
    return `${t.getFullYear()}${format}${month}`
  }
  return `${t.getFullYear()}年${month}月`
}

export function getYesterdayTimestampSecond() {
  const today = getTodayTimestampSecond()
  return today - 86400
}

export function getNumberOfWeek(date: number): number {
  const today = date ? new Date(date) : new Date()
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
  const pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

const isValidDate = (dateObject: string | number | Date) => new Date(dateObject).toString() !== 'Invalid Date'

function timePad(time: number) {
  return (time + '').padStart(2, '0')
}
