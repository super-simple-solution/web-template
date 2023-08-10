import Adaptive from '@/directive/el-table/adaptive'
import { App } from 'vue'
export default function performLoader(app: App<Element>) {
  // thirdparty component
  app.directive('adaptive', Adaptive)
  // mixin
  app.mixin({
    methods: {
      tableRowClassName({ rowIndex }: { rowIndex: number }) {
        if (rowIndex % 2 == 0) {
          return 'even'
        } else {
          return 'odd'
        }
      },
    },
  })
}
