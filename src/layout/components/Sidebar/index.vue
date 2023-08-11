<template>
  <div>
    <el-menu
      :default-active="activeMenu"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :unique-opened="true"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="horizontal"
      style="width: 600px"
    >
      <SidebarItem
        v-for="(route, index) in routes"
        :key="index"
        :item="route"
        :base-path="route.path"
        :index="index + ''"
      />
    </el-menu>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.scss?inline'
import { parseScssVariable } from '@/utils'

console.log(variables, 'variables')

export default {
  name: 'Sidebar',
  components: { SidebarItem },
  data() {
    return {
      variables: parseScssVariable(variables),
    }
  },
  computed: {
    routes() {
      return this.$router.options.routes.filter((item) => !item.hidden && item.meta)
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
  },
}
</script>
