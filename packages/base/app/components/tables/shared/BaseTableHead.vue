<!--
  BaseTableHead — table header row with optional checkbox, index, and sortable columns.
-->
<script setup lang="ts">
import type { TableColumn, TableSort } from "@fullup/base/types";

defineProps<{
  sortState: TableSort | null;
  sortIcon: (col: TableColumn) => string;
}>();

const emit = defineEmits<{
  "toggle-sort": [TableColumn];
  "toggle-select-all": [];
}>();

const ctx = useTableContext();
const { th, dense, selectable, showIndex, columns, alignClass } = ctx;
</script>

<template>
  <thead>
    <tr :class="['border-b', th.border]">
      <!-- Checkbox header -->
      <th
        v-if="selectable"
        class="w-12 px-4 text-center"
        :class="[dense ? 'py-2' : 'py-3', th.thead]"
      >
        <slot name="select-all" />
      </th>

      <!-- Index header -->
      <th
        v-if="showIndex"
        class="w-14 px-4 text-center font-medium text-sm"
        :class="[dense ? 'py-2' : 'py-3', th.thead]"
      >
        #
      </th>

      <!-- Data columns -->
      <th
        v-for="col in columns"
        :key="col.key"
        :style="col.width ? { width: col.width } : undefined"
        :class="[
          'font-medium text-sm px-4',
          dense ? 'py-2' : 'py-3',
          th.thead,
          alignClass(col.align),
          col.class,
          col.sortable ? 'cursor-pointer select-none' : '',
        ]"
        @click="emit('toggle-sort', col)"
      >
        <span class="inline-flex items-center gap-1">
          <slot :name="`${col.key}-header`" :column="col">
            {{ col.label }}
          </slot>
          <UIcon
            v-if="col.sortable"
            :name="sortIcon(col)"
            class="size-3.5 opacity-70"
          />
        </span>
      </th>
    </tr>
  </thead>
</template>
