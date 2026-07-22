<!--
  BaseTableBody — loading skeleton, empty state, and data rows
  with all cell types (slot, toggle, badge, actions, text/number/date).
-->
<script setup lang="ts">
import type { TableColumn, TableRowAction } from "@fullup/base/types";

defineProps<{
  loading: boolean;
  pagedItems: Record<string, any>[];
  filteredCount: number;
  totalColSpan: number;
  emptyText: string;
  rowActions: TableRowAction[];
  rowKey: (row: Record<string, any>, index: number) => string | number;
  rowNumber: (index: number) => number;
  isRowSelected: (row: Record<string, any>) => boolean;
  vChecked: { mounted: Function; updated: Function };
}>();

const emit = defineEmits<{
  "row-click": [Record<string, any>];
  toggle: [{ col: TableColumn; row: Record<string, any>; value: boolean }];
  "select-row": [Record<string, any>];
}>();

const ctx = useTableContext();
const { th, dense, selectable, showIndex, striped, columns, alignClass, justifyClass, locale } = ctx;
const { t } = ctx;
const slots = useSlots();

function hasColumnSlot(key: string) {
  return !!slots[`column-${key}`];
}
</script>

<template>
  <!-- Loading skeleton -->
  <tbody v-if="loading">
    <tr
      v-for="n in dense ? 6 : 5"
      :key="`sk-${n}`"
      :class="['border-b', th.border]"
    >
      <td v-if="selectable" class="px-4 text-center" :class="[dense ? 'py-2.5' : 'py-4']">
        <div class="h-4 w-4 rounded animate-pulse mx-auto" :class="th.skeleton" />
      </td>
      <td v-if="showIndex" class="px-4 text-center" :class="[dense ? 'py-2.5' : 'py-4']">
        <div class="h-4 w-6 rounded animate-pulse mx-auto" :class="th.skeleton" />
      </td>
      <td
        v-for="col in columns"
        :key="col.key"
        :class="['px-4', dense ? 'py-2.5' : 'py-4']"
      >
        <div class="h-4 rounded-md animate-pulse" :class="th.skeleton" />
      </td>
    </tr>
  </tbody>

  <!-- Empty -->
  <tbody v-else-if="filteredCount === 0">
    <tr>
      <td :colspan="totalColSpan" class="px-4">
        <slot name="empty">
          <div class="py-10 text-center text-sm" :class="th.muted">
            {{ emptyText || t("common.empty") }}
          </div>
        </slot>
      </td>
    </tr>
  </tbody>

  <!-- Data rows -->
  <tbody v-else>
    <tr
      v-for="(row, index) in pagedItems"
      :key="rowKey(row, index)"
      :class="[
        'border-b last:border-0 transition-colors',
        th.border,
        th.rowHover,
        striped && index % 2 === 1 ? th.stripe : '',
        selectable && isRowSelected(row) ? 'bg-primary/5' : '',
      ]"
      @click="emit('row-click', row)"
    >
      <!-- Checkbox -->
      <td
        v-if="selectable"
        class="px-4 text-center align-middle"
        :class="[dense ? 'py-2.5' : 'py-4']"
        @click.stop
      >
        <input
          v-checked="isRowSelected(row)"
          type="checkbox"
          class="size-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
          @change="emit('select-row', row)"
        />
      </td>

      <!-- Index -->
      <td
        v-if="showIndex"
        class="px-4 text-center text-sm align-middle"
        :class="[dense ? 'py-2.5' : 'py-4', th.td]"
      >
        {{ rowNumber(index) }}
      </td>

      <!-- Data cells -->
      <td
        v-for="col in columns"
        :key="col.key"
        :class="[
          'px-4 text-sm align-middle',
          dense ? 'py-2.5' : 'py-4',
          th.td,
          alignClass(col.align),
          col.class,
        ]"
      >
        <!-- 1. Slot override -->
        <slot
          v-if="hasColumnSlot(col.key)"
          :name="`column-${col.key}`"
          :row="row"
          :value="row[col.key]"
          :index="index"
        />

        <!-- 2. Toggle -->
        <div
          v-else-if="col.type === 'toggle'"
          class="flex items-center"
          :class="justifyClass(col.align)"
        >
          <FormsToggleSwitch
            :boxed="false"
            :model-value="!!row[col.key]"
            @update:model-value="(v: boolean) => emit('toggle', { col, row, value: v })"
            @click.stop
          />
        </div>

        <!-- 3. Badge -->
        <span
          v-else-if="col.type === 'badge'"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          :class="BADGE_CLASS[col.badge?.(row[col.key], row)?.color || 'gray']"
        >
          <span class="size-1.5 rounded-full bg-current" />
          {{ col.badge?.(row[col.key], row)?.label ?? formatCell(col, row, locale) }}
        </span>

        <!-- 4. Actions -->
        <div
          v-else-if="col.type === 'actions'"
          class="flex items-center gap-2"
          :class="justifyClass(col.align)"
          @click.stop
        >
          <slot name="actions" :row="row" :index="index">
            <template v-for="(action, ai) in rowActions" :key="ai">
              <button
                v-if="!action.show || action.show(row)"
                type="button"
                :title="action.label"
                :aria-label="action.label"
                class="size-8 rounded-xl flex items-center justify-center hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                :class="ACTION_CLASS[action.variant || 'default']"
                @click="action.onClick(row)"
              >
                <UIcon :name="action.icon" class="size-4" />
              </button>
            </template>
          </slot>
        </div>

        <!-- 5. Text / number / date -->
        <template v-else>{{ formatCell(col, row, locale) }}</template>
      </td>
    </tr>
  </tbody>
</template>
