<template>
  <div>
    <el-menu default-active="1">
      <app-link v-for="(route, index) in routes.routes" :key="index" :to="resolvePath(route.path)">
        <el-menu-item>
          <template #title>{{ route.meta.title }}</template>
        </el-menu-item>
      </app-link>
    </el-menu>
  </div>
</template>

<script>
import AppLink from './Sidebar/Link.vue'
import path from 'path'
import { isExternal } from '@/utils/validate'
import { useChildRouteStore } from '@/store/childRoute'
export default {
  name: 'LeftMenu',
  components: {
    AppLink,
  },
  computed: {
    routes: () => useChildRouteStore(),
  },
  mounted() {
    // 默认第一个
    this.$router.push({
      path: this.resolvePath(this.routes.routes[0].path),
    })
  },
  methods: {
    resolvePath(routePath) {
      const basePath = this.routes.basePath
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(basePath)) {
        return basePath
      }
      return path.resolve(basePath, routePath)
    },
  },
}
</script>
