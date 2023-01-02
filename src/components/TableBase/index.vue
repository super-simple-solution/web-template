<template>
  <el-table v-bind="tableAttrs" ref="multipleTable" v-adaptive="{ bottomOffset: 85 }" :data="list" v-on="events">
    <slot name="before" />
    <el-table-column v-if="config.selection" type="selection" width="75" />
    <el-table-column v-if="config.index" type="index" fixed width="75" label="序号" />
    <template v-for="(column, index) in config.list" :key="column.key || index">
      <template v-if="column.children || column.slot || column.component">
        <el-table-column v-bind="column.attr || {}" :label="column.label">
          <template v-if="column.children">
            <el-table-column
              v-for="(column_inner, _index) in column.children"
              :key="column_inner.key || _index"
              :prop="column_inner.prop"
              :label="column_inner.label"
              v-bind="column_inner.attr || {}"
            >
              <template v-if="column_inner.component" #default="context">
                <component :is="column_inner.component" :context="context.row" v-bind="column_inner.attrs"></component>
              </template>
            </el-table-column>
          </template>
          <template v-if="column.slot" #[column.slot]>
            <component :is="column[column.slot]"></component>
          </template>
          <template v-if="column.component" #default="context">
            <component :is="column.component" :context="context.row" v-bind="column.attrs"></component>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column v-bind="column.attr || {}" :prop="column.prop" :label="column.label"> </el-table-column>
      </template>
    </template>
    <!-- 操作列 -->
    <el-table-column v-if="operation" :label="operation.label" v-bind="operation.attr || {}">
      <template #default="scope">
        <span v-for="(operate, i) in operation.operations" :key="i">
          <el-button
            type="primary"
            link
            size="small"
            :icon="operate.icon"
            v-bind="operate.attr"
            :disabled="disabled(scope.row, operate.field, operate.condition)"
            class="mr10"
            @click="op(operate.op, scope.row)"
          >
            {{ operate.label }}
            <svg-icon v-if="operate.iconClass" :name="operate.iconClass" />
          </el-button>
        </span>
      </template>
    </el-table-column>
    <slot name="after" />
  </el-table>
</template>

<script>
import { tableDefaultConfig, opeConfig } from './const'

export default {
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    list: {
      type: Array,
      default: () => [],
    },
    attrs: {
      type: Object,
      default: () => ({}),
    },
    events: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['op'],
  computed: {
    tableAttrs() {
      return Object.assign({}, tableDefaultConfig, this.attrs || {})
    },
    operation() {
      const { operations, operationTitleConfig } = this.config
      if (!operations) return null
      const column = {
        label: operationTitleConfig?.label ? operationTitleConfig.label : '操作',
        attr: Object.assign({}, operationTitleConfig?.attr || {}, {
          // 默认操作居右
          attr: {
            fixed: 'right',
          },
        }),
      }
      column.operations = this.config.operations.map((ope) => {
        const curOpTemp = opeConfig[ope] || {}
        curOpTemp.op = ope
        if (typeof ope === 'string') {
          return curOpTemp
        } else {
          return Object.assign({}, ope, curOpTemp[ope.op])
        }
      })
      return column
    },
  },
  methods: {
    op(name, option) {
      this.$emit('op', {
        name,
        option,
      })
    },
    formatter(_, __, cellValue) {
      if (!cellValue && cellValue !== 0) {
        return '--'
      } else {
        return cellValue
      }
    },
    disabled(row, field, condition) {
      if (condition) {
        if (row[field] >= condition) {
          return true
        }
      }
    },
  },
}
</script>

<style scoped>
.el-table th.gutter {
  display: table-cell !important;
}
</style>
