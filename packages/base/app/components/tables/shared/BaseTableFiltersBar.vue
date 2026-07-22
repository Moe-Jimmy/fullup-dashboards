<!--
  BaseTableFiltersBar — "below" mode filter rows:
  date-range preset tabs, select dropdowns, and date pickers.
-->
<script setup lang="ts">
import type { TableAlign, TableFilter, TableFilterValues } from "@fullup/base/types";

const props = defineProps<{
  dateRangeFilters: TableFilter[];
  selectFilters: TableFilter[];
  datePickerFilters: TableFilter[];
  filterValues: TableFilterValues;
  dateRangeAlign: TableAlign;
  filtersAlign: TableAlign;
}>();

const emit = defineEmits<{
  "update:filterValues": [TableFilterValues];
}>();

const { justifyClass, locale } = useTableContext();

function setFilter(key: string, value: string | number) {
  emit("update:filterValues", { ...props.filterValues, [key]: value });
}
</script>

<template>
  <!-- Date-range preset tabs -->
  <div
    v-if="dateRangeFilters.length > 0"
    class="mb-4 px-2 flex items-center gap-3 flex-wrap"
    :class="justifyClass(dateRangeAlign)"
  >
    <button
      type="button"
      class="size-10 rounded-xl border border-default flex items-center justify-center text-t-sec"
    >
      <UIcon name="i-lucide-calendar" class="size-4" />
    </button>

    <div
      v-for="drf in dateRangeFilters"
      :key="drf.key"
      class="flex gap-2 overflow-x-auto scrollbar-hide"
    >
      <button
        v-for="preset in drf.presets"
        :key="preset.value"
        type="button"
        class="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
        :class="
          filterValues[drf.key] === preset.value
            ? 'bg-primary text-white'
            : 'bg-bg-pages text-t-sec hover:bg-brand-bg/20 border border-default'
        "
        @click="setFilter(drf.key, preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>

  <!-- Select dropdown filters -->
  <div
    v-if="selectFilters.length > 0"
    class="mb-4 px-2 flex items-center gap-3 flex-wrap"
    :class="justifyClass(filtersAlign)"
  >
    <div
      v-for="sf in selectFilters"
      :key="sf.key"
      class="min-w-[140px] flex-1 max-w-[200px]"
    >
      <USelectMenu
        :model-value="filterValues[sf.key]"
        :items="sf.options || []"
        value-key="value"
        :placeholder="sf.placeholder || sf.label"
        :icon="sf.icon"
        trailing-icon="i-lucide-chevron-down"
        :dir="locale === 'ar' ? 'rtl' : 'ltr'"
        class="w-full cursor-pointer"
        :ui="{
          base: 'w-full h-10 ps-3 rounded-xl text-t-white bg-transparent text-sm',
          content: 'bg-bg-landingpage',
          item: 'data-highlighted:not-data-disabled:before:bg-primary/20',
          placeholder: 'text-t-placeholder',
        }"
        @update:model-value="(v: string | number) => setFilter(sf.key, v)"
      />
    </div>
  </div>

  <!-- Date pickers -->
  <div
    v-if="datePickerFilters.length > 0"
    class="mb-4 px-2 flex items-center gap-3 flex-wrap"
    :class="justifyClass(filtersAlign)"
  >
    <div
      v-for="dpf in datePickerFilters"
      :key="dpf.key"
      class="min-w-[180px]"
    >
      <FormsDatePicker
        :model-value="(filterValues[dpf.key] as string) ?? ''"
        @update:model-value="(v: string) => setFilter(dpf.key, v)"
      />
    </div>
  </div>
</template>
