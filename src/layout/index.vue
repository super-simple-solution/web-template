<template>
  <div class="app-wrapper">
    <div :class="{ 'has-tags-view': needTagsView }" class="main-container" :style="mainStyle">
      <div class="header-wrapper">
        <navbar />
      </div>
      <div class="height-placeholder"></div>
      <app-main />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Navbar, AppMain } from './components'
import { useChildRouteStore } from '@/store/childRoute'
import { useSettingsStore } from '@/store/settings'

type obj = {
  [key: string]: string | number
}

const childRouteStore = useChildRouteStore()

const mainStyle = computed(() => {
  const obj: obj = {}
  if (!childRouteStore.hasRoute) {
    obj.marginLeft = 0
  }
  return obj
})

const { tagsView: needTagsView } = useSettingsStore()
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.height-placeholder {
  height: 48px;
  visibility: hidden;
}

.header-wrapper {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.sidebar-wrapper {
  width: 200px;
  background: #fff;
  box-shadow: 0px 2px 4px 0px #d2d4d6;
}
</style>
