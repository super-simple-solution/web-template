// 统计页板页搜索
export const search = {
  props: {
    searchParams: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    searchParams: {
      immediate: true,
      deep: true,
      handler(newV) {
        if (newV && Object.keys(newV).length) {
          if (this.search) {
            this.search(newV)
          } else if (this.init) {
            this.init(newV)
          }
        }
      },
    },
  },
}

// 备用
export function searchFactory(options) {
  return {
    props: {
      searchParams: {
        type: Object,
        default: () => ({}),
      },
    },
    watch: {
      searchParams: {
        immediate: true,
        handler(newV) {
          let hasChange = false
          if (!newV) return
          Object.keys(options).forEach((key) => {
            if (Array.isArray(options[key]) && newV[key].length) {
              hasChange = true
            } else if (newV[key]) {
              hasChange = true
            }
          })
          if (hasChange) {
            this.init(newV)
          }
        },
      },
    },
  }
}

export const chartResize = {
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize() {
      this.chart && this.chart.resize()
    },
  },
}
