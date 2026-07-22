<!--
  BaseTable — config-driven, RTL-aware data table shared across all dashboards.

  This file is a thin orchestrator that composes sub-components and composables:

  Composables:
    • useTableData        — search + sort state → ordered/filtered rows
    • useTablePagination  — client (`perPage`) & controlled (`pagination`) paging
    • useTableAlign       — RTL-aware `align`/`justify` classes
    • useTableFilters     — config-driven filter state management
    • useTableSelection   — row selection (checkbox) state
    • useTableSummary     — footer summary computation
    • useTableContext     — provide/inject bridge to sub-components

  Sub-components (private, in `./shared/`):
    • BaseTableHeader       — title, icon, count, inline filters, header-actions
    • BaseTableBulkBar      — animated bar for bulk actions on selected rows
    • BaseTableFiltersBar   — "below" mode date-range tabs, selects, date pickers
    • BaseTableHead         — thead with checkbox, index, sortable columns
    • BaseTableBody         — loading skeleton, empty state, data rows
    • BaseTableFoot         — summary footer (sum, count, static, custom)
    • BaseTablePagination   — pager + rows-per-page selector

  Utils (auto-imported):
    • formatCell              — localized cell value rendering
    • tableThemeClasses       — light/dark theme class sets
    • BADGE_CLASS / ACTION_CLASS — badge & action button color maps

  Slots:
    #header-start, #header-actions, #bulk-actions, #toolbar, #filters,
    #{key}-header, #column-{key}, #actions, #empty, #footer
-->
<script setup lang="ts" generic="T extends Record<string, any> = Record<string, any>">
import type {
  TableAlign,
  TableColumn,
  TableRowAction,
  TablePagination,
  TableSort,
  TableToggleEvent,
  TableFilter,
  TableFilterValues,
  TableSummaryColumn,
  TableBulkAction,
} from "@fullup/base/types";

// Props
const props = withDefaults(
  defineProps<{
    items: T[];
    columns: TableColumn<T>[];
    title?: string;
    titleIcon?: string;
    showCount?: boolean;
    totalCount?: number;
    titleAlign?: TableAlign;
    actionsAlign?: TableAlign;
    paginationAlign?: TableAlign;
    loading?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    showPagination?: boolean;
    pagination?: TablePagination;
    perPage?: number;
    rowActions?: TableRowAction<T>[];
    dense?: boolean;
    striped?: boolean;
    theme?: "light" | "dark";
    emptyText?: string;
    manualSort?: boolean;
    manualSearch?: boolean;
    rowKey?: string | ((row: T, index: number) => string | number);
    selectable?: boolean;
    showIndex?: boolean;
    filters?: TableFilter[];
    manualFilter?: boolean;
    summaryColumns?: TableSummaryColumn[];
    bulkActions?: TableBulkAction<T>[];
    perPageOptions?: number[];
    filtersAlign?: TableAlign;
    dateRangeAlign?: TableAlign;
    filtersPosition?: "below" | "inline";
  }>(),
  {
    title: "", titleIcon: "", showCount: false, totalCount: undefined,
    titleAlign: "start", actionsAlign: "end", paginationAlign: "end",
    loading: false, searchable: false, searchPlaceholder: "",
    pagination: undefined, perPage: 0, rowActions: () => [],
    showPagination: true, dense: false, striped: false, theme: "light",
    emptyText: "", manualSort: false, manualSearch: false, rowKey: "id",
    selectable: false, showIndex: false, filters: () => [],
    manualFilter: false, summaryColumns: () => [], bulkActions: () => [],
    perPageOptions: () => [], filtersAlign: "end", dateRangeAlign: "end",
    filtersPosition: "below",
  },
);

// Emits & model
const emit = defineEmits<{
  sort: [TableSort | null];
  toggle: [TableToggleEvent<T>];
  search: [string];
  "row-click": [T];
  "update:page": [number];
  "update:selected": [T[]];
  filter: [TableFilterValues];
}>();

const selected = defineModel<T[]>("selected", { default: () => [] });
const { t, locale } = useI18n();

// Core composables
const { alignClass, justifyClass } = useTableAlign();

const { search, sortState, toggleSort, sortIcon, processedItems } =
  useTableData<T>({
    items: () => props.items,
    columns: () => props.columns,
    searchable: () => props.searchable,
    manualSearch: () => props.manualSearch,
    manualSort: () => props.manualSort,
    server: () => !!props.pagination,
  });

const { filterValues, resetFilters } = useTableFilters(() => props.filters);

// Client-side filter matching
const filteredItems = computed<T[]>(() => {
  if (props.manualFilter || !!props.pagination || props.filters.length === 0) {
    return processedItems.value;
  }
  return processedItems.value.filter((row) => {
    for (const f of props.filters) {
      const val = filterValues.value[f.key];
      if (val == null || val === "" || val === "all") continue;
      if (f.type === "select") {
        const rowVal = (row as Record<string, unknown>)[f.key];
        if (rowVal != null && String(rowVal) !== String(val)) return false;
      }
    }
    return true;
  });
});

//  Per-page selector 
const currentPerPage = ref(props.perPage);
watch(() => props.perPage, (v) => { currentPerPage.value = v; });

const hasPerPageSelector = computed(
  () => props.perPageOptions.length > 0 && !props.pagination,
);
const perPageItems = computed(() =>
  props.perPageOptions.map((n) => ({ label: String(n), value: n })),
);

//  Pagination 
const { pagedItems, showPager, pagerPage, pagerPerPage, pagerTotal, clientPage, resetPage } =
  useTablePagination<T>(filteredItems, {
    perPage: () => currentPerPage.value,
    pagination: () => props.pagination,
    showPagination: () => props.showPagination,
  });

//  Selection 
const {
  allPageSelected, somePageSelected,
  toggleSelectAll, toggleSelectRow, isRowSelected, clearSelection, vChecked,
} = useTableSelection<T>(pagedItems, selected, () => props.selectable);

const selectAllRef = useTemplateRef<HTMLInputElement>("selectAllCheckbox");
watchEffect(() => {
  const el = selectAllRef.value;
  if (!el) return;
  el.checked = allPageSelected.value;
  el.indeterminate = somePageSelected.value;
});

//  Summary 
const { hasSummary, summaryMap, summaryValue } = useTableSummary(
  () => props.items as Record<string, unknown>[],
  () => props.summaryColumns,
  locale,
);

//  Theme 
const isDark = computed(() => props.theme === "dark");
const th = computed(() => tableThemeClasses(isDark.value));

//  Provide context to sub-components 
provideTableContext({
  th, isDark, locale, t,
  dense: computed(() => props.dense),
  selectable: computed(() => props.selectable),
  showIndex: computed(() => props.showIndex),
  striped: computed(() => props.striped),
  columns: computed(() => props.columns as TableColumn[]),
  alignClass, justifyClass,
});

//  Watchers (emit bubbling + page resets) 
watch(search, (v) => { emit("search", v); resetPage(); });
watch(sortState, (s) => emit("sort", s));
watch(filterValues, (v) => { emit("filter", { ...v }); resetPage(); }, { deep: true });
watch(currentPerPage, () => resetPage());

//  Helpers ─
const showBulkBar = computed(
  () => props.selectable && props.bulkActions.length > 0 && selected.value.length > 0,
);

const isInlineFilters = computed(() => props.filtersPosition === "inline");
const showHeader = computed(() =>
  !!(props.title || props.titleIcon || useSlots()["header-start"] || useSlots()["header-actions"] || isInlineFilters.value),
);
const displayCount = computed(() => props.totalCount ?? pagerTotal.value);

const dateRangeFilters = computed(() => props.filters.filter((f) => f.type === "date-range"));
const selectFilters = computed(() => props.filters.filter((f) => f.type === "select"));
const datePickerFilters = computed(() => props.filters.filter((f) => f.type === "date-picker"));

// Only forward slots the consumer actually provided (avoids empty slot overrides).
const parentSlots = useSlots();
const columnSlotKeys = computed(() =>
  props.columns.map((c) => c.key).filter((k) => `column-${k}` in parentSlots),
);
const headerSlotKeys = computed(() =>
  props.columns.map((c) => c.key).filter((k) => `${k}-header` in parentSlots),
);

const totalColSpan = computed(() => {
  let n = props.columns.length;
  if (props.selectable) n++;
  if (props.showIndex) n++;
  return n;
});

function keyFor(row: T, index: number) {
  if (typeof props.rowKey === "function") return props.rowKey(row, index);
  return (row[props.rowKey] as string | number | undefined) ?? index;
}

function rowNumber(index: number): number {
  const offset = props.pagination
    ? (props.pagination.currentPage - 1) * props.pagination.perPage
    : props.perPage > 0 ? (clientPage.value - 1) * props.perPage : 0;
  return offset + index + 1;
}

function onPagerUpdate(p: number) {
  if (props.pagination) emit("update:page", p);
  else clientPage.value = p;
}

function onToggle(payload: { col: TableColumn; row: Record<string, any>; value: boolean }) {
  (payload.row as Record<string, unknown>)[payload.col.key] = payload.value;
  emit("toggle", { row: payload.row as T, key: payload.col.key, value: payload.value });
}

function onFilterUpdate(values: TableFilterValues) {
  Object.assign(filterValues.value, values);
}

function onBulkExecute(action: TableBulkAction<T>) {
  action.onClick([...selected.value]);
}
</script>

<template>
  <div class="w-full" :class="isDark ? 'bg-surface-dark rounded-2xl p-2' : ''">
    <!-- Header -->
    <TablesSharedBaseTableHeader
      v-if="showHeader"
      :title="title"
      :title-icon="titleIcon"
      :show-count="showCount"
      :display-count="displayCount"
      :title-align="titleAlign"
      :actions-align="actionsAlign"
      :is-inline="isInlineFilters"
      :date-range-align="dateRangeAlign"
      :filters-align="filtersAlign"
      :date-range-filters="dateRangeFilters"
      :select-filters="selectFilters"
      :filter-values="filterValues"
      @update:filter-values="onFilterUpdate"
    >
      <template v-if="$slots['header-start']" #header-start>
        <slot name="header-start" />
      </template>
      <template v-if="$slots['header-actions']" #header-actions>
        <slot name="header-actions" />
      </template>
    </TablesSharedBaseTableHeader>

    <!-- Bulk actions -->
    <TablesSharedBaseTableBulkBar
      :show="showBulkBar"
      :selected-count="selected.length"
      :bulk-actions="(bulkActions as TableBulkAction[])"
      @execute="onBulkExecute"
      @clear="clearSelection"
    >
      <template v-if="$slots['bulk-actions']" #bulk-actions>
        <slot name="bulk-actions" :selected="selected" :clear="clearSelection" />
      </template>
    </TablesSharedBaseTableBulkBar>

    <!-- Filters (below mode) -->
    <TablesSharedBaseTableFiltersBar
      v-if="!isInlineFilters"
      :date-range-filters="dateRangeFilters"
      :select-filters="selectFilters"
      :date-picker-filters="datePickerFilters"
      :filter-values="filterValues"
      :date-range-align="dateRangeAlign"
      :filters-align="filtersAlign"
      @update:filter-values="onFilterUpdate"
    />

    <!-- Custom filters slot -->
    <div v-if="$slots.filters" class="mb-4 px-2">
      <slot name="filters" :values="filterValues" :reset="resetFilters" />
    </div>

    <!-- Toolbar slot -->
    <div v-if="$slots.toolbar" class="mb-4 px-2">
      <slot name="toolbar" />
    </div>

    <!-- Search -->
    <div v-if="searchable" class="mb-4 px-2">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        color="neutral"
        variant="outline"
        :placeholder="searchPlaceholder || t('common.search')"
        class="w-full sm:max-w-xs"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[600px] border-collapse">
        <TablesSharedBaseTableHead
          :sort-state="sortState"
          :sort-icon="(sortIcon as any)"
          @toggle-sort="(col: any) => toggleSort(col)"
        >
          <template #select-all>
            <input
              ref="selectAllCheckbox"
              type="checkbox"
              class="size-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
              @change="toggleSelectAll"
            />
          </template>
          <template v-for="col in headerSlotKeys" :key="col" #[`${col}-header`]="slotProps">
            <slot :name="`${col}-header`" v-bind="slotProps" />
          </template>
        </TablesSharedBaseTableHead>

        <TablesSharedBaseTableBody
          :loading="loading"
          :paged-items="(pagedItems as any[])"
          :filtered-count="filteredItems.length"
          :total-col-span="totalColSpan"
          :empty-text="emptyText"
          :row-actions="(rowActions as TableRowAction[])"
          :row-key="(keyFor as any)"
          :row-number="rowNumber"
          :is-row-selected="(isRowSelected as any)"
          :v-checked="vChecked"
          @row-click="(row: any) => emit('row-click', row)"
          @toggle="onToggle"
          @select-row="(row: any) => toggleSelectRow(row)"
        >
          <template v-if="$slots.empty" #empty>
            <slot name="empty" />
          </template>
          <template v-for="col in columnSlotKeys" :key="col" #[`column-${col}`]="slotProps">
            <slot :name="`column-${col}`" v-bind="slotProps" />
          </template>
          <template v-if="$slots.actions" #actions="slotProps">
            <slot name="actions" v-bind="slotProps" />
          </template>
        </TablesSharedBaseTableBody>

        <TablesSharedBaseTableFoot
          :has-summary="hasSummary"
          :summary-map="summaryMap"
          :summary-value="summaryValue"
          :loading="loading"
          :has-data="filteredItems.length > 0"
        />
      </table>
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="px-2 mt-2">
      <slot name="footer" />
    </div>

    <!-- Pagination -->
    <TablesSharedBaseTablePagination
      :show-pager="showPager"
      :has-per-page-selector="hasPerPageSelector"
      :pager-page="pagerPage"
      :pager-per-page="pagerPerPage"
      :pager-total="pagerTotal"
      :current-per-page="currentPerPage"
      :per-page-items="perPageItems"
      :pagination-align="paginationAlign"
      @update:page="onPagerUpdate"
      @update:per-page="(v: number) => { currentPerPage = v; }"
    />
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
