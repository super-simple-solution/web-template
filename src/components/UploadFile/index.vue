<template>
  <div :style="props.helper ? 'min-width: 360px' : 'min-width: 100px'">
    <el-upload
      v-if="disabled === false"
      :show-file-list="false"
      :http-request="upload"
      :before-upload="beforeUpload"
      :multiple="props.multiple"
      style="display: inline-block"
    >
      <el-button type="primary" :size="props.size" :loading="uploading">{{ props.uploadButtonText }}</el-button>
    </el-upload>
    <slot></slot>
    <upload-helper
      v-if="helper"
      :disabled="props.disabled"
      :no-image-tip="disabled === false ? '' : props.noImageTip"
      :urls="props.urls"
      :upload-type="props.uploadType"
      @delete="deleteImage"
    >
      <template #default="index">
        <slot name="legend" v-bind="index"></slot>
      </template>
    </upload-helper>
  </div>
</template>

<script setup lang="ts">
import { uploadFile } from '@/api/upload'
import { PropType } from 'vue'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
type SizeType = '' | 'small' | 'large' | 'medium' | 'mini'

const props = defineProps({
  size: {
    type: String as PropType<SizeType>,
    default: () => 'small',
  },
  urls: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  uploadButtonText: {
    type: String,
    default: '点击上传',
  },
  noImageTip: {
    type: String,
    default: '暂无图片',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  helper: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  uploadType: {
    type: String,
    default: 'image',
  },
})
const uploading = ref(false)

const emit = defineEmits(['delete', 'upload'])

const deleteImage = (url: string, index: number) => emit('delete', url, index)
const upload = (data: any): unknown => {
  uploading.value = true
  return uploadFile(data.file)
    .then((res: string) => {
      emit('upload', res)
    })
    .finally(() => {
      uploading.value = false
    })
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const rawFileSize = rawFile.size / 1024 / 1024
  if (rawFile.type.indexOf('image') > -1 && rawFileSize > 10) {
    ElMessage.error('上传图片大小不能超过 10MB!')
    return false
  }
  if (rawFile.type.indexOf('video') > -1 && rawFileSize > 300) {
    ElMessage.error('上传图片大小不能超过 300MB!')
    return false
  }
  return true
}
</script>
