<template>
  <div>
    <table-base :list="table.data" :config="table.config" :attrs="table.attrs" :events="table.events" @op="op" />
    <Pagination
      v-show="page.total > 0"
      :total="page.total"
      layout="prev, pager, next"
      :page="page.params.pageNum"
      :limit="page.params.pageSize"
      background
      @pagination="pagination"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
defineProps({
  page: {
    type: Object,
    default: () => ({
      params: {},
      total: 0,
    }),
  },
  table: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['pagination', 'op'])

function pagination(options: any) {
  emit('pagination', options)
}

function op(options: any) {
  emit('op', options)
}
</script>

<style lang="scss" scoped></style>
