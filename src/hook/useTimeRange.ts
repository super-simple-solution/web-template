import { ElMessage } from 'element-plus'
const oneDay = 86400000

interface Option {
  required?: true
  dateOnly?: true
  shortcuts?: [1, 7, 30]
  pickerOptions?: any
  dayRangeLimit?: 30
  disabledAfterNow?: false
  disabledBeforeNow?: false
  defaultRange?: 0
  minTime?: null | number
  maxTime?: null | number
  requiredCb: () => boolean
}

export default function useSearch(options: Option) {
  const {
    required = true,
    dateOnly = true,
    shortcuts = [1, 7, 30],
    pickerOptions = {},
    // dayRangeLimit = 30,
    // disabledAfterNow = false,
    disabledBeforeNow = false,
    defaultRange = 0,
    requiredCb = () => {
      ElMessage.warning('请选择时间')
      return false
    },
  } = options
  const shortcutRes = shortcuts.map((day) => shortcutGene(day, disabledBeforeNow))
  let timeRange: any[] = [null, null]
  // const minTime = null
  // const maxTime = null
  // const optionGene = pickerOptions.dateOptionGene || dateOptionGene
  // let optionGeneRes = {}
  // if (optionGene) {
  //   delete pickerOptions.dateOptionGene
  //   optionGeneRes = optionGene({
  //     minTime,
  //     maxTime,
  //     dayRangeLimit,
  //     disabledAfterNow,
  //     disabledBeforeNow,
  //   })
  // }
  const now = Date.now()
  if (defaultRange) {
    timeRange = [now - defaultRange * oneDay, now]
  }
  const state = reactive({
    timeRange,
    timeRangeType: dateOnly ? 'daterange' : 'datetimerange',
    shortcuts: shortcutRes,
    ...pickerOptions,
    // TODO: 按elementplus新api实现后放开
    // ...optionGeneRes,
  })
  const time_range_params = computed(() => {
    const timeRange = state.timeRange || []
    if (!timeRange.length)
      return {
        from: 0,
        to: 0,
      }
    return {
      from: parseTime(timeRange[0], dateOnly),
      to: parseTime(timeRange[1], dateOnly),
    }
  })

  function timeRangeValid() {
    if (required && (!state.timeRange || !state.timeRange.length)) {
      return requiredCb()
    } else {
      return true
    }
  }
  function timeRangeReset() {
    state.timeRange = []
  }
  return {
    state,
    time_range_params,
    timeRangeValid,
    timeRangeReset,
  }
}

const shortcutTextEnum: textEnumOptions = {
  1: '最近一天',
  7: '最近一周',
  30: '最近一月',
}

function shortcutGene(day: number, disabledBeforeNow?: boolean) {
  return {
    text: shortcutTextEnum[day],
    value: () => {
      const end = new Date()
      const start = new Date()
      // 1天填0，因为后端已对start = end当1天处理
      const days = (day === 1 ? 0 : day) * oneDay
      if (disabledBeforeNow) {
        end.setTime(start.getTime() + days)
      } else {
        start.setTime(start.getTime() - days)
      }
      start.setHours(0, 0, 0)
      // 最近1天，当天0点到当前时间; 其它为0点到23:59:59
      if (day !== 1) {
        end.setHours(23, 59, 59)
      }
      return [start, end]
    },
  }
}

function parseTime(time: number, dateOnly?: boolean) {
  if (!time) return 0
  time = dateOnly ? new Date(time).setHours(0, 0, 0) : time
  return Math.ceil(time / 1000)
}

// function dateOptionGene(options: Option) {
//   const { dayRangeLimit = 30, disabledAfterNow = true, disabledBeforeNow = false } = options
//   let { minTime = new Date().getTime() - oneDay * dayRangeLimit, maxTime = new Date().getTime() } = options
//   return {
//     onClick(time: any) {
//       // 如果选择了只选择了一个时间
//       const timeRange = dayRangeLimit * 24 * 60 * 60 * 1000 // 默认30天
//       // 如果选了两个时间，那就清空本次范围判断数据，以备重选
//       if (!time.minDate) {
//         minTime = time.maxDate.getTime() - timeRange // 最小时间
//         maxTime = time.maxDate.getTime() + timeRange // 最大时间
//       } else if (!time.maxDate) {
//         minTime = time.minDate.getTime() - timeRange // 最小时间
//         maxTime = time.minDate.getTime() + timeRange // 最大时间
//       } else {
//         minTime = maxTime = null
//       }
//     },
//     disabledDate(time: Date) {
//       // onPick后触发
//       if (minTime && maxTime) {
//         // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
//         return (
//           time.getTime() < minTime ||
//           time.getTime() > maxTime ||
//           (disabledAfterNow ? time.getTime() > Date.now() : false) ||
//           (disabledBeforeNow ? time.getTime() < Date.now() : false)
//         )
//       }
//     },
//   }
// }
