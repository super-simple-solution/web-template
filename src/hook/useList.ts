import { pickParams } from '@/utils'
import { OpOption, TableConfig, TableAttrs, RowInfo, DataOptions } from '@/types/local'
import { ElMessage, ElMessageBox } from 'element-plus'
import { downloadExcel } from '@/utils/excel'

interface Option {
  autoInit?: boolean
  tableConfig: TableConfig
  tableAttrs?: TableAttrs
  listProcess: (arg0?: any, arg1?: any) => void
  processOptions?: any
  postSearch?: () => any
  postRefresh?: () => any
  api: any
  exportTitle?: string
  listApiKey?: string
  listKey?: string
  deleteKey?: string
  deleteType?: 'delete' | 'update'
  deleteOption?: DataOptions
  checkKey?: string
  searchOption?: { [key: string]: string }
  defaultRowInfo?: RowInfo
  opConfig?: { [key: string]: (data: RowInfo) => any }
}

interface Pagination {
  pageSize?: number
  pageNum?: number
}

export default function useList(option: Option) {
  const {
    autoInit = false,
    tableConfig,
    tableAttrs = {},
    listProcess,
    processOptions = {},
    api,
    exportTitle = '',
    listApiKey = 'list',
    listKey = 'item_list',
    deleteKey = 'id',
    deleteType = 'delete',
    deleteOption = {},
    checkKey = '', // 检查接口是否符合当前请求状态(接口返回慢，数据会串)
    searchOption = {},
    defaultRowInfo = {},
    postSearch,
    postRefresh,
    opConfig,
  } = option
  const events: { [key: string]: (arg0: any) => any } = {}
  if (tableConfig.selection) {
    events['selection-change'] = handleSelectionChange
  }
  const state = reactive({
    rowInfo: {} as RowInfo,
    flag: 0,
    deleteFlag: 0,
    table: {
      data: [],
      attrs: tableAttrs,
      config: tableConfig,
      events,
    },
    page: {
      total: 0,
      params: {
        pageSize: 10,
        pageNum: 1,
      },
    },
    selectionList: [],
    searchOption,
    loading: false,
  })

  onMounted(() => {
    if (!autoInit) return
    init()
  })

  const opHandlers: { [key: string]: (option: RowInfo | undefined) => void } = {
    add: toAdd,
    edit: toEdit,
    delete: toDelete,
    ...opConfig,
  }

  function op(msg: OpOption) {
    const name = msg.name
    if (name === 'search') {
      toSearch(msg.option || {})
    } else if (name === 'export') {
      toExport(msg.option || {})
    } else if (opHandlers[name]) {
      opHandlers[name](msg.option)
    }
  }

  function toSearch(option: object) {
    state.page.params.pageNum = 1
    state.searchOption = {
      ...state.searchOption,
      ...option,
    }
    init()
    postSearch && postSearch()
  }

  function init() {
    const tableClass = tableAttrs.class
    const config = {
      el: tableClass ? `.${tableClass}` : '.el-table',
    }
    const list = api[listApiKey]
    const checkKeyBefore = checkKey ? state.searchOption[checkKey] : ''
    Promise.all([
      list(
        {
          ...makeParams(state, false),
        },
        config,
      ),
      list({
        ...makeParams(state, true),
      }),
    ]).then((res) => {
      // 如果附加搜索条件变更, 则需要比对当前返回结果是否与搜索条件一致,如不一致则丢弃
      if (checkKey) {
        const checkKeyAfter = state.searchOption[checkKey] || ''
        if (checkKeyBefore !== checkKeyAfter) return
      }
      const [resList, resCount] = res
      const list = resList[listKey] || []
      listProcess(list, processOptions.value)
      state.table.data = list
      state.page.total = resCount.count || 0
    })
  }

  function toExport(option: object) {
    state.page.params.pageNum = 1
    state.searchOption = {
      ...state.searchOption,
      ...option,
    }
    const params = {
      ...makeParams(state, false),
      list_arg: {
        start: 0,
        count: state.page.total,
      },
    }
    const tableClass = tableAttrs.class
    const config = {
      el: tableClass ? `.${tableClass}` : '.el-table',
    }
    const list = api[listApiKey]
    const checkKeyBefore = checkKey ? state.searchOption[checkKey] : ''
    list(params, config).then((res: any) => {
      if (checkKey) {
        const checkKeyAfter = state.searchOption[checkKey] || ''
        if (checkKeyBefore !== checkKeyAfter) return
      }
      const list = res[listKey] || []
      listProcess(list, processOptions.value)
      const listFinal = list.map((item: any) => {
        return tableConfig.list.reduce((acc, cur) => {
          const prop = cur.prop
          if (prop.includes('.')) {
            acc[cur.label] = getKey(item, prop)
          } else {
            acc[cur.label] = item[prop]
          }
          return acc
        }, {})
      })
      // if parse location, should wait
      downloadExcel(listFinal, exportTitle)
    })
  }

  function pagination(options: Pagination) {
    state.page.params = {
      ...state.page.params,
      ...options,
    }
    if (!options.pageNum && !options.pageSize) return
    init()
  }

  function pagePrev() {
    state.page.params.pageNum--
    init()
  }

  function pageNext() {
    state.page.params.pageNum++
    init()
  }

  function handleSelectionChange(val: []) {
    state.selectionList = val
  }

  // 新增按钮
  function toAdd(options: RowInfo | undefined) {
    state.flag = 1
    state.rowInfo = { ...options } as RowInfo
  }

  // 编辑
  function toEdit(row: RowInfo | undefined) {
    state.flag = 2
    state.rowInfo = row || {}
  }

  function toDelete(data: RowInfo | undefined) {
    state.rowInfo = data || {}
    ElMessageBox.confirm('确认删除该条数据', '', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
    })
      .then(() => {
        deleteConfirm()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
  }

  function toDetail(data: RowInfo) {
    state.flag = 3
    state.rowInfo = data
  }

  function deleteCancel() {
    state.deleteFlag = 0
    state.rowInfo = defaultRowInfo
  }

  function deleteConfirm(bulk = false) {
    let paramsData
    if (bulk) {
      // 批量删除
      if (deleteType === 'update') {
        paramsData = state.selectionList.map((item: RowInfo) => ({
          ...item,
          ...deleteOption,
        }))
      } else {
        paramsData = state.selectionList.map((item: RowInfo) => item.id)
      }
    } else {
      if (deleteType === 'update') {
        const paramsDataTemp = {
          ...state.rowInfo,
          ...deleteOption,
        }
        paramsData = deleteKey.includes('list') ? [paramsDataTemp] : paramsDataTemp
      } else {
        paramsData = deleteKey.includes('list') ? [state.rowInfo.id] : state.rowInfo.id
      }
    }
    const params = {
      [`${deleteKey}`]: paramsData,
    }
    api.delete(params).then(() => {
      ElMessage.success('删除成功')
      init()
      state.deleteFlag = 0
    })
  }
  // 批量删除
  function bulkDelete() {
    if (state.selectionList.length === 0) {
      ElMessage.warning('请选择至少一条数据')
      return
    }
    state.deleteFlag = 2
  }
  function bulkDeleteConfirm() {
    deleteConfirm(true)
  }
  function reset(needRefresh: boolean) {
    state.flag = 0
    state.rowInfo = defaultRowInfo
    if (needRefresh) {
      // 如更新全局数据
      if (postRefresh) {
        postRefresh().then(() => {
          init()
        })
      } else {
        init()
      }
    }
  }

  return {
    state,
    op,
    init,
    pagination,
    pagePrev,
    pageNext,
    handleSelectionChange,
    toSearch,
    toAdd,
    toEdit,
    toDelete,
    toDetail,
    deleteCancel,
    deleteConfirm,
    bulkDelete,
    bulkDeleteConfirm,
    reset,
  }
}

function makeParams(state: any, countOnly = false, options = {}) {
  const params = {
    ...state.searchOption,
    ...options,
    list_arg: {
      count_only: false,
      start: 0,
      count: 10,
    },
  }
  const pageNum = state.page.params.pageNum || 1
  if (countOnly) {
    params.list_arg.count_only = true
  } else {
    params.list_arg.start = (pageNum - 1) * state.page.params.pageSize
    params.list_arg.count = state.page.params.pageSize
  }
  // 清除无效参数
  const paramsRes = pickParams(params)
  return paramsRes
}

function getKey(data: any, key: string) {
  const keyList = key.split('.')
  let res = data
  keyList.forEach((item: any) => {
    if (!res) return ''
    res = res[item]
  })
  return res
}
