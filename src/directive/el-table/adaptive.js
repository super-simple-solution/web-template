import { addResizeListener, removeResizeListener } from './resize'

// 设置表格高度
const doResize = async (el, binding) => {
  // 获取表格Dom对象
  const { instance: $multipleTable } = binding

  // 获取调用传递过来的数据
  const { value } = binding

  // if (!$multipleTable.height) {
  //   $multipleTable.height = '400px'
  //   console.warn('el-$multipleTable must set the height. Such as height="100px"')
  // }
  // 获取距底部距离（用于展示页码等信息）
  const bottomOffset = (value && value.bottomOffset) || 30

  if (!$multipleTable) return

  // 计算列表高度并设置
  const height = window.innerHeight - el.getBoundingClientRect().top - bottomOffset
  const tableNode = $multipleTable.$refs.multipleTable
  if (!tableNode) return
  tableNode.layout.setHeight(height)
  tableNode.doLayout()
}

export default {
  // 初始化设置
  beforeMount(el, binding, vnode) {
    // 设置resize监听方法
    el.resizeListener = async () => {
      await doResize(el, binding, vnode)
    }
    // 绑定监听方法到addResizeListener
    addResizeListener(window.document.body, el.resizeListener)
  },
  // 绑定默认高度
  async mounted(el, binding, vnode) {
    await doResize(el, binding, vnode)
  },
  // 销毁时设置
  unmounted(el) {
    // 移除resize监听
    removeResizeListener(el, el.resizeListener)
  },
}
