<!--
  BaseTableHeader — title bar with optional icon, count badge,
  inline filters, and header-action slot.
-->
<script setup lang="ts">
import type {
  TableAlign,
  TableFilter,
  TableFilterValues,
} from "@fullup/base/types";

const props = defineProps<{
  title: string;
  titleIcon: string;
  showCount: boolean;
  displayCount: number;
  titleAlign: TableAlign;
  actionsAlign: TableAlign;
  isInline: boolean;
  dateRangeAlign: TableAlign;
  filtersAlign: TableAlign;
  dateRangeFilters: TableFilter[];
  selectFilters: TableFilter[];
  filterValues: TableFilterValues;
}>();

const emit = defineEmits<{
  "update:filterValues": [TableFilterValues];
}>();

const ctx = useTableContext();
const { th, justifyClass, locale } = ctx;

function setFilter(key: string, value: string | number) {
  emit("update:filterValues", { ...props.filterValues, [key]: value });
}
</script>

<template>
  <div class="flex items-center gap-4 flex-wrap mb-5 px-2">
    <!-- Title zone -->
    <div
      v-if="title || titleIcon || $slots['header-start']"
      class="min-w-0 flex items-center"
      :class="[justifyClass(titleAlign), isInline ? '' : 'flex-1']"
    >
      <slot name="header-start">
        <div v-if="title || titleIcon" class="flex items-center gap-2">
          <UIcon v-if="titleIcon" :name="titleIcon" class="size-5" :class="th.icon" />
          <h3 class="font-semibold text-base" :class="th.title">{{ title }}</h3>
          <span v-if="showCount" class="text-sm font-medium text-t-sec">
            ({{ displayCount.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US') }})
          </span>
        </div>
      </slot>
    </div>

    <!-- Inline date-range tabs -->
    <div
      v-if="isInline && dateRangeFilters.length > 0"
      class="flex items-center gap-3"
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

    <!-- Inline select filters -->
    <div
      v-if="isInline && selectFilters.length > 0"
      class="flex items-center gap-3 flex-wrap"
      :class="justifyClass(filtersAlign)"
    >
      <div
        v-for="sf in selectFilters"
        :key="sf.key"
        class="min-w-[140px] max-w-[200px]"
      >
        <USelectMenu
          :model-value="filterValues[sf.key]"
          :items="sf.options || []"
          value-key="value"
          :placeholder="sf.placeholder || sf.label"
          :icon="sf.icon"
          :search-input="false"
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

    <!-- Spacer (inline mode) -->
    <div v-if="isInline" class="flex-1" />

    <!-- Header actions -->
    <div
      v-if="$slots['header-actions']"
      class="flex items-center gap-3 flex-wrap"
      :class="justifyClass(actionsAlign)"
    >
      <slot name="header-actions" />
    </div>
  </div>
</template>
