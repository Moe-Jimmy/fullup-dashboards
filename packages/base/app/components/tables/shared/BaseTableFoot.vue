<!--
  BaseTableFoot — summary footer row (auto-sum, count, static, or custom).
-->
<script setup lang="ts">
import type { TableSummaryColumn } from "@fullup/base/types";

defineProps<{
  hasSummary: boolean;
  summaryMap: Map<string, TableSummaryColumn>;
  summaryValue: (sc: TableSummaryColumn) => string | number;
  loading: boolean;
  hasData: boolean;
}>();

const { th, dense, selectable, showIndex, columns, alignClass } = useTableContext();
</script>

<template>
  <tfoot v-if="hasSummary && !loading && hasData">
    <tr :class="['border-t', th.border]">
      <td v-if="selectable" class="px-4" :class="dense ? 'py-2.5' : 'py-4'" />
      <td v-if="showIndex" class="px-4" :class="dense ? 'py-2.5' : 'py-4'" />

      <td
        v-for="col in columns"
        :key="`sum-${col.key}`"
        :class="[
          'px-4 text-sm font-semibold align-middle',
          dense ? 'py-2.5' : 'py-4',
          th.td,
          alignClass(col.align),
        ]"
      >
        <template v-if="summaryMap.has(col.key)">
          <span
            v-if="summaryMap.get(col.key)!.label"
            class="block text-xs font-normal"
            :class="th.muted"
          >
            {{ summaryMap.get(col.key)!.label }}
          </span>
          {{ summaryValue(summaryMap.get(col.key)!) }}
        </template>
      </td>
    </tr>
  </tfoot>
</template>
