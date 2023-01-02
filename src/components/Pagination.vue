<template>
  <div :class="{ hidden: hidden }" class="pagination-container clearfix">
    <el-pagination
      class="right"
      :total="total"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page="currentPage"
      :layout="layout"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  total: {
    required: true,
    type: Number,
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    },
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 20,
  },
})

const { total, pageSizes, layout, hidden } = toRefs(props)
const currentPage = computed(() => props.page)
const pageSize = computed(() => props.limit)

const emit = defineEmits(['pagination'])
const handleSizeChange = (val: number) => emit('pagination', { pageSize: val })
const handleCurrentChange = (val: number) => emit('pagination', { pageNum: val })
</script>

<style scoped lang="scss">
.pagination-container {
  margin-top: 32px;
  .el-pagination__jump {
    color: #fff;
  }
}
.pagination-container.hidden {
  display: none;
}
</style>
