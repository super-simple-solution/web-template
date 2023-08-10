<template>
  <el-menu-item
    v-if="onlyOne && onlyOneChild.meta"
    :index="resolvePath(onlyOneChild.path)"
    class="submenu-title-noDropdown"
  >
    <app-link :to="resolvePath(onlyOneChild.path)">
      <svg-icon v-if="onlyOneChild.meta.icon" :name="onlyOneChild.meta.icon" aria-hidden="true" font-size="17px" />
      <span v-if="onlyOneChild.meta.title">{{ onlyOneChild.meta.title }}</span>
    </app-link>
  </el-menu-item>

  <el-sub-menu v-else :index="resolvePath(item.path)" @click.enter="select(item)">
    <template #title>
      <svg-icon v-if="item.meta && item.meta.icon" :name="item.meta.icon" aria-hidden="true" font-size="16px" />
      <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
    </template>
    <sidebar-item
      v-for="child in item.children"
      :key="child.path"
      :is-nest="true"
      :item="child"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
    />
  </el-sub-menu>
</template>

<script>
import path from 'path-browserify'
import { isExternal } from '@/utils/validate'
import AppLink from './Link.vue'
import { useChildRouteStore } from '@/store/childRoute'

export default defineComponent({
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      onlyOneChild: null,
    }
  },
  computed: {
    onlyOne() {
      return (
        this.hasOneShowingChild(this.item.children, this.item) ||
        (((this.onlyOneChild.children && this.onlyOneChild.children.length < 2) ||
          this.onlyOneChild.noShowingChildren) &&
          !this.item.alwaysShow)
      )
    },
  },
  methods: {
    select(item) {
      if (!item.meta.step || item.meta.step !== 2) return
      // set global menu
      useChildRouteStore.setRoutes({
        basePath: item.parentPath + '/' + item.path,
        routes: item.children,
      })
      // 默认展示第一个child
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
  },
})
</script>
