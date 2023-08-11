<template>
  <div v-if="urls.length === 0">{{ noImageTip }}</div>
  <div v-else class="flex-wrap">
    <div v-for="(url, index) in urls" :key="`${url} + ${index}`" class="box">
      <a class="image-wrap" :href="url" target="_blank" rel="noopener noreferrer">
        <template v-if="url">
          <img v-if="uploadType === 'image'" :src="url" class="cover" referrerpolicy="no-referrer" />
          <video v-if="uploadType === 'video'" class="cover" controls>
            <source :src="url" />
          </video>
        </template>
      </a>
      <img v-if="!disabled" src="@/assets/delete.png" class="icon el-icon-error" @click="$emit('delete', url, index)" />
      <slot :index="index"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'

defineEmits(['delete'])
defineProps({
  urls: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  noImageTip: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: () => false,
  },
  uploadType: {
    type: String,
    default: 'image',
  },
})
</script>
<style scoped>
.box {
  display: inline-block;
  margin-top: 24px;
  position: relative;
  margin-right: 24px;
}
.image-wrap {
  display: block;
  width: 200px;
  height: 200px;
  background: #f7f7f7;
}
.cover {
  display: block;
  margin: 0 auto;
  object-fit: contain;
  height: 100%;
  max-width: 200px;
}
.icon {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  transform: translate(50%, -50%);
  font-size: 20px;
  cursor: pointer;
}
</style>
