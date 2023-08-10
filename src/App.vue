<script lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export default defineComponent({
  setup() {
    return {
      zhCn,
    }
  },
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>
