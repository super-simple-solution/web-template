import { pickParams } from '@/utils'
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { RowInfo } from '@/types/local'

interface Props {
  flag: number
  flagVal?: number
  rowInfo: object
}

interface Api {
  [key: number]: any
}

interface Option {
  defaultText?: string
  entityKey?: string
  formInit: (arg0?: any) => RowInfo
  formParse?: (data: any) => object
  apiMap: Api
  rules: object
  formKey?: string
  props?: Props
  emit: (event: 'reset', ...args: any[]) => void
  image_url?: string
}

export default function useEdit(option: Option) {
  const {
    defaultText = '',
    entityKey = '',
    formInit,
    formParse = (obj, option: object = {}) => ({ ...obj, ...option }),
    apiMap,
    rules = {},
    props = {
      flag: 0,
      rowInfo: {},
    },
    emit,
    image_url = 'image_url',
  } = option

  const state = reactive({
    form: formInit(),
    visible: false,
    rules,
    loading: false,
  })

  const ruleReactive = reactive<FormRules>(rules)

  const editText = computed(() => `${defaultText}-${props.flag === 1 ? '新增' : '编辑'}`)

  watch(
    () => props.flag,
    () => {
      if (props.flagVal) {
        state.visible = props.flag === props.flagVal
      } else {
        state.visible = [1, 2].includes(props.flag)
      }
      if (!state.visible) return
      state.form = props.rowInfo ? formInit(props.rowInfo) : formInit()
    },
  )

  function reset(form: FormInstance, needRefresh = false, options = {}) {
    state.form = formInit()
    emit('reset', needRefresh, options)
    form.clearValidate()
  }

  function cancel(form: FormInstance | undefined) {
    if (!form) return
    reset(form)
  }

  function save(form: FormInstance, options = {}) {
    state.loading = true
    const api = apiMap[props.flag]
    let params = formParse({ ...state.form }, { ...options })
    if (entityKey) {
      params = {
        [`${entityKey}`]: pickParams(params),
      }
    }
    return api(params)
      .then((res: any) => {
        ElMessage.success('操作成功')
        reset(form, true, res)
        return res
      })
      .finally(() => {
        state.loading = false
      })
  }

  function confirm(form: FormInstance | undefined) {
    if (!form) return
    form.validate((valid: boolean) => {
      if (valid) {
        save(form)
      }
    })
  }

  function deleteImage() {
    state.form[image_url] = ''
  }

  function afterUpload(url: string) {
    state.form[image_url] = url
  }

  return {
    rules: ruleReactive,
    editText,
    state,
    save,
    confirm,
    cancel,
    deleteImage,
    afterUpload,
    defaultRule,
  }
}

type Rule = {
  required?: boolean
  message: string
  trigger?: string
}

// TODO: 自动生成规则
function defaultRule(key: string, labelMap: any, needTrigger = true) {
  const rule: Rule = {
    required: true,
    message: `请输入${labelMap[key]}`,
  }
  if (needTrigger) {
    rule.trigger = 'blur'
  }
  return {}
}

// function ruleGene(obj, keys) {}
