<template>
  <section :class="['app-main', containerClass]">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      containerClass: '',
    }
  },
  watch: {
    $route() {
      this.updateContainer()
    },
  },
  mounted() {
    this.updateContainer()
  },
  methods: {
    updateContainer() {
      // if (this.$route.path === '/index') {
      //   this.containerClass = 'app-main-full'
      // }
    },
  },
}
</script>

<style lang="scss">
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 48px);
  position: relative;
  overflow: hidden;
  background-color: #f5f7fd;
  // width: 100%;
  padding: 24px;
  &.full-screen {
    padding: 0;
  }
}
.app-main-full {
  padding: 0;
}
.page-content-height {
  display: flex;
  height: 100%;
  min-height: calc(100vh - 82px);
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
