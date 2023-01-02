import { reactive, watch, defineEmits } from 'vue'

interface Props {
  flag: number
  // 控制弹窗出现的值
  flagVal?: number
  rowInfo?: object
  detailText?: string
  confirmText?: string
}

interface Option {
  props?: Props
  emit?: (event: 'reset', ...args: any[]) => void
}

export default function useDetail(option: Option) {
  const state = reactive({
    visible: false,
  })

  const {
    props = {
      flag: 0,
      rowInfo: {},
    },
    emit = defineEmits(['reset']),
  } = option

  watch(
    () => props.flag,
    (val) => {
      if (props.flagVal) {
        state.visible = props.flag === props.flagVal
      } else {
        state.visible = val === 3
      }
    },
  )

  const cancel = () => emit('reset', false)

  return {
    cancel,
    state,
  }
}
