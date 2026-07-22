<!--
  BaseTablePagination — pagination controls + rows-per-page selector.
-->
<script setup lang="ts">
import type { TableAlign } from "@fullup/base/types";

defineProps<{
  showPager: boolean;
  hasPerPageSelector: boolean;
  pagerPage: number;
  pagerPerPage: number;
  pagerTotal: number;
  currentPerPage: number;
  perPageItems: { label: string; value: number }[];
  paginationAlign: TableAlign;
}>();

const emit = defineEmits<{
  "update:page": [number];
  "update:perPage": [number];
}>();

const { th, justifyClass, locale, t } = useTableContext();
</script>

<template>
  <div
    v-if="showPager || hasPerPageSelector"
    class="flex items-center border-t pt-4 px-4 mt-2 gap-4 flex-wrap"
    :class="[th.border]"
  >
    <!-- Per-page selector -->
    <div v-if="hasPerPageSelector" class="flex items-center gap-2">
      <span class="text-xs" :class="th.muted">{{ t("common.table.rowsPerPage") }}</span>
      <USelectMenu
        :model-value="currentPerPage"
        :items="perPageItems"
        value-key="value"
        :search-input="false"
        :dir="locale === 'ar' ? 'rtl' : 'ltr'"
        class="w-20 cursor-pointer"
        :ui="{
          base: 'w-full h-9 ps-3 rounded-lg text-sm bg-transparent',
          content: 'bg-bg-landingpage',
          item: 'data-highlighted:not-data-disabled:before:bg-primary/20',
        }"
        @update:model-value="(v: number) => emit('update:perPage', v)"
      />
    </div>

    <div v-if="showPager" class="flex-1 flex" :class="justifyClass(paginationAlign)">
      <Pagination
        :page="pagerPage"
        :items-per-page="pagerPerPage"
        :total="pagerTotal"
        @update:page="(p: number) => emit('update:page', p)"
      />
    </div>
  </div>
</template>
