<!--
  SharedTable — config-driven, RTL-aware data table shared across all dashboards.

  Logic lives in composables/utils (auto-imported), keeping this file focused on
  markup + prop wiring:
    • useTableData        — search + sort state → ordered/filtered rows
    • useTablePagination  — client (`perPage`) & controlled (`pagination`) paging
    • useTableAlign       — RTL-aware `align`/`justify` classes
    • useTableFilters     — config-driven filter state management
    • utils/tableFormat   — `formatCell` (date/number/format)
    • utils/tableStyles   — badge/action colors + per-theme class set

  Slots: `#header-start`, `#header-actions`, `#toolbar`, `#filters`,
         `#{key}-header`, `#column-{key}` (cell override), `#actions`,
         `#empty`, `#footer`.
  See COMPONENTS.md for the full prop/slot reference.
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

const props = withDefaults(
  defineProps<{
    /** Row data. */
    items: T[];
    /** Column definitions (key, label, type, align, sortable, …). */
    columns: TableColumn<T>[];
    /** Header title (with optional icon). Header is hidden when empty. */
    title?: string;
    titleIcon?: string;
    /** Alignment of the title zone within the header bar. */
    titleAlign?: TableAlign;
    /** Alignment of the header action buttons (`#header-actions`). */
    actionsAlign?: TableAlign;
    /** Alignment of the pagination bar. */
    paginationAlign?: TableAlign;
    /** Show skeleton rows instead of data. */
    loading?: boolean;
    /** Render a search box (client-side filter unless `manualSearch`). */
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Master switch for the pager (both client & controlled modes). */
    showPagination?: boolean;
    /** Controlled/server pagination. Overrides client-side `perPage`. */
    pagination?: TablePagination;
    /** Client-side pagination page size. `0` = show all rows (no pager). */
    perPage?: number;
    /** Row action buttons (rendered by an `actions`-type column). */
    rowActions?: TableRowAction<T>[];
    /** Tighter row padding. */
    dense?: boolean;
    /** Zebra striping. */
    striped?: boolean;
    /** `dark` forces a dark surface (e.g. transactions log). */
    theme?: "light" | "dark";
    emptyText?: string;
    /** Disable client-side sorting (emit `sort` only — e.g. server-paginated). */
    manualSort?: boolean;
    /** Disable client-side search filtering (emit `search` only). */
    manualSearch?: boolean;
    /** Row `:key` — a field name or a getter. */
    rowKey?: string | ((row: T, index: number) => string | number);

    // ── New features ──────────────────────────────────────────────────

    /** Enable row selection with checkboxes. */
    selectable?: boolean;
    /** Prepend an auto-numbered `#` column. */
    showIndex?: boolean;
    /** Config-driven filter bar (select, date-range, date-picker). */
    filters?: TableFilter[];
    /** Disable client-side filter matching (emit `filter` only). */
    manualFilter?: boolean;
    /** Summary footer row — auto-sum / count / static values. */
    summaryColumns?: TableSummaryColumn[];
    /** Bulk actions shown when rows are selected. */
    bulkActions?: TableBulkAction<T>[];
  }>(),
  {
    title: "",
    titleIcon: "",
    titleAlign: "start",
    actionsAlign: "end",
    paginationAlign: "end",
    loading: false,
    searchable: false,
    searchPlaceholder: "",
    pagination: undefined,
    perPage: 0,
    rowActions: () => [],
    showPagination: true,
    dense: false,
    striped: false,
    theme: "light",
    emptyText: "",
    manualSort: false,
    manualSearch: false,
    rowKey: "id",
    selectable: false,
    showIndex: false,
    filters: () => [],
    manualFilter: false,
    summaryColumns: () => [],
    bulkActions: () => [],
  },
);

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

const slots = useSlots();
const { t, locale } = useI18n();

// ── Alignment ──────────────────────────────────────────────────────────────
const { alignClass, justifyClass } = useTableAlign();

// ── Data (search + sort) ───────────────────────────────────────────────────
const { search, sortState, toggleSort, sortIcon, processedItems } =
  useTableData<T>({
    items: () => props.items,
    columns: () => props.columns,
    searchable: () => props.searchable,
    manualSearch: () => props.manualSearch,
    manualSort: () => props.manualSort,
    server: () => !!props.pagination,
  });

// ── Filters ────────────────────────────────────────────────────────────────
const { filterValues, resetFilters } = useTableFilters(
  () => props.filters,
);

/** Rows after client-side filter matching (skipped in manual/server mode). */
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
      // date-range and date-picker are typically server-driven; skip client match.
    }
    return true;
  });
});

// Emit filter changes.
watch(filterValues, (v) => emit("filter", { ...v }), { deep: true });

// ── Pagination ─────────────────────────────────────────────────────────────
const {
  pagedItems,
  showPager,
  pagerPage,
  pagerPerPage,
  pagerTotal,
  clientPage,
  resetPage,
} = useTablePagination<T>(filteredItems, {
  perPage: () => props.perPage,
  pagination: () => props.pagination,
  showPagination: () => props.showPagination,
});

// Bubble state changes up; reset to page 1 whenever the search or filters change.
watch(search, (v) => {
  emit("search", v);
  resetPage();
});
watch(sortState, (s) => emit("sort", s));
watch(filterValues, () => resetPage(), { deep: true });

// ── Theme ──────────────────────────────────────────────────────────────────
const isDark = computed(() => props.theme === "dark");
const th = computed(() => tableThemeClasses(isDark.value));

// ── Selection ──────────────────────────────────────────────────────────────
const allPageSelected = computed(() => {
  if (!props.selectable || pagedItems.value.length === 0) return false;
  return pagedItems.value.every((row) => selected.value.includes(row));
});

const somePageSelected = computed(() => {
  if (!props.selectable) return false;
  return (
    selected.value.length > 0 &&
    pagedItems.value.some((row) => selected.value.includes(row)) &&
    !allPageSelected.value
  );
});

const selectAllRef = useTemplateRef<HTMLInputElement>("selectAllCheckbox");

watchEffect(() => {
  const el = selectAllRef.value;
  if (!el) return;
  el.checked = allPageSelected.value;
  el.indeterminate = somePageSelected.value;
});

function toggleSelectAll() {
  if (allPageSelected.value) {
    selected.value = selected.value.filter(
      (r) => !pagedItems.value.includes(r),
    );
  } else {
    const set = new Set(selected.value);
    for (const row of pagedItems.value) set.add(row);
    selected.value = [...set];
  }
}

function toggleSelectRow(row: T) {
  const idx = selected.value.indexOf(row);
  if (idx >= 0) {
    selected.value = selected.value.filter((_, i) => i !== idx);
  } else {
    selected.value = [...selected.value, row];
  }
}

function isRowSelected(row: T) {
  return selected.value.includes(row);
}

// ── Bulk actions ───────────────────────────────────────────────────────────
const showBulkBar = computed(
  () => props.selectable && props.bulkActions.length > 0 && selected.value.length > 0,
);

function clearSelection() {
  selected.value = [];
}

function executeBulkAction(action: TableBulkAction<T>) {
  action.onClick([...selected.value]);
}

/** Directive to set the `checked` DOM property reactively. */
const vChecked = {
  mounted(el: HTMLInputElement, binding: { value: boolean }) {
    el.checked = binding.value;
  },
  updated(el: HTMLInputElement, binding: { value: boolean }) {
    el.checked = binding.value;
  },
};

// ── Row index ──────────────────────────────────────────────────────────────
/** 1-based row number, page-aware. */
function rowNumber(index: number): number {
  const pageOffset = props.pagination
    ? (props.pagination.currentPage - 1) * props.pagination.perPage
    : props.perPage > 0
      ? (clientPage.value - 1) * props.perPage
      : 0;
  return pageOffset + index + 1;
}

// ── Summary ────────────────────────────────────────────────────────────────
function summaryValue(sc: TableSummaryColumn): string | number {
  const rows = props.items as Record<string, unknown>[];
  if (typeof sc.value === "function") return sc.value(rows);
  if (sc.value === "count") return rows.length;
  if (sc.value === "sum") {
    const total = rows.reduce((acc, row) => {
      const v = Number(row[sc.key]);
      return acc + (Number.isNaN(v) ? 0 : v);
    }, 0);
    return total.toLocaleString(locale.value === "ar" ? "ar-EG" : "en-US");
  }
  return sc.value;
}

/** Map summary columns by key for quick lookup. */
const summaryMap = computed(() => {
  const map = new Map<string, TableSummaryColumn>();
  for (const sc of props.summaryColumns) map.set(sc.key, sc);
  return map;
});

const hasSummary = computed(() => props.summaryColumns.length > 0);

// ── Helpers ────────────────────────────────────────────────────────────────
/** Total visual columns including checkbox + index. */
const totalColSpan = computed(() => {
  let count = props.columns.length;
  if (props.selectable) count++;
  if (props.showIndex) count++;
  return count;
});

function onToggle(col: TableColumn<T>, row: T, value: boolean) {
  (row as Record<string, unknown>)[col.key] = value;
  emit("toggle", { row, key: col.key, value });
}

function onPagerUpdate(p: number) {
  if (props.pagination) emit("update:page", p);
  else clientPage.value = p;
}

function hasColumnSlot(key: string) {
  return !!slots[`column-${key}`];
}

function keyFor(row: T, index: number) {
  if (typeof props.rowKey === "function") return props.rowKey(row, index);
  return (row[props.rowKey] as string | number | undefined) ?? index;
}

// ── Filter bar helpers ─────────────────────────────────────────────────────
const hasFilters = computed(() => props.filters.length > 0);

const dateRangeFilters = computed(() =>
  props.filters.filter((f) => f.type === "date-range"),
);

const datePickerFilters = computed(() =>
  props.filters.filter((f) => f.type === "date-picker"),
);

const selectFilters = computed(() =>
  props.filters.filter((f) => f.type === "select"),
);
</script>

<template>
  <div class="w-full" :class="isDark ? 'bg-surface-dark rounded-2xl p-2' : ''">
    <!-- ═══ Header: title + action buttons ═══ -->
    <div
      v-if="title || titleIcon || $slots['header-start'] || $slots['header-actions']"
      class="flex items-center gap-4 flex-wrap mb-5 px-2"
    >
      <div
        v-if="title || titleIcon || $slots['header-start']"
        class="flex-1 min-w-0 flex items-center"
        :class="justifyClass(titleAlign)"
      >
        <slot name="header-start">
          <div v-if="title || titleIcon" class="flex items-center gap-2">
            <UIcon
              v-if="titleIcon"
              :name="titleIcon"
              class="size-5"
              :class="th.icon"
            />
            <h3 class="font-semibold text-base" :class="th.title">
              {{ title }}
            </h3>
          </div>
        </slot>
      </div>

      <div
        v-if="$slots['header-actions']"
        class="flex-1 flex items-center gap-3 flex-wrap"
        :class="justifyClass(actionsAlign)"
      >
        <slot name="header-actions" />
      </div>
    </div>

    <!-- ═══ Bulk action bar (visible when rows are selected) ═══ -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showBulkBar"
        class="mb-4 mx-2 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3"
      >
        <span class="text-sm font-medium text-t-white">
          {{ t("common.table.selected") }}:
          <span class="font-bold text-primary">{{ selected.length }}</span>
        </span>

        <div class="flex items-center gap-2 ms-auto">
          <slot name="bulk-actions" :selected="selected" :clear="clearSelection">
            <button
              v-for="(action, i) in bulkActions"
              :key="i"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              :class="ACTION_CLASS[action.variant || 'default']"
              :title="action.label"
              @click="executeBulkAction(action)"
            >
              <UIcon :name="action.icon" class="size-4" />
              {{ action.label }}
            </button>
          </slot>

          <button
            type="button"
            class="size-8 rounded-lg flex items-center justify-center text-t-sec hover:text-t-white hover:bg-black/5 transition-colors cursor-pointer ms-1"
            :title="t('common.table.clearSelection')"
            @click="clearSelection"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- ═══ Date-range preset tabs ═══ -->
    <div
      v-if="dateRangeFilters.length > 0"
      class="mb-4 px-2 flex items-center gap-3 flex-wrap"
    >
      <!-- Calendar icon (decorative, matching the screenshots) -->
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
          @click="filterValues[drf.key] = preset.value"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- ═══ Select dropdown filters ═══ -->
    <div
      v-if="selectFilters.length > 0"
      class="mb-4 px-2 flex items-center gap-3 flex-wrap"
    >
      <div
        v-for="sf in selectFilters"
        :key="sf.key"
        class="min-w-[140px] flex-1 max-w-[200px]"
      >
        <USelectMenu
          v-model="filterValues[sf.key]"
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
        />
      </div>
    </div>

    <!-- ═══ Date pickers ═══ -->
    <div
      v-if="datePickerFilters.length > 0"
      class="mb-4 px-2 flex items-center gap-3 flex-wrap"
    >
      <div
        v-for="dpf in datePickerFilters"
        :key="dpf.key"
        class="min-w-[180px]"
      >
        <FormsDatePicker v-model="filterValues[dpf.key] as string" />
      </div>
    </div>

    <!-- ═══ Custom filters slot (override or extend) ═══ -->
    <div v-if="$slots.filters" class="mb-4 px-2">
      <slot name="filters" :values="filterValues" :reset="resetFilters" />
    </div>

    <!-- ═══ Secondary toolbar (filter tabs, date ranges, etc.) ═══ -->
    <div v-if="$slots.toolbar" class="mb-4 px-2">
      <slot name="toolbar" />
    </div>

    <!-- ═══ Search ═══ -->
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

    <!-- ═══ Scroll container ═══ -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[600px] border-collapse">
        <!-- Head -->
        <thead>
          <tr :class="['border-b', th.border]">
            <!-- Checkbox header -->
            <th
              v-if="selectable"
              class="w-12 px-4 text-center"
              :class="[dense ? 'py-2' : 'py-3', th.thead]"
            >
              <input
                ref="selectAllCheckbox"
                type="checkbox"
                class="size-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                @change="toggleSelectAll"
              />
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
              @click="toggleSort(col)"
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

        <!-- Loading skeleton -->
        <tbody v-if="loading">
          <tr
            v-for="n in dense ? 6 : 5"
            :key="`sk-${n}`"
            :class="['border-b', th.border]"
          >
            <td
              v-if="selectable"
              class="px-4 text-center"
              :class="[dense ? 'py-2.5' : 'py-4']"
            >
              <div class="h-4 w-4 rounded animate-pulse mx-auto" :class="th.skeleton" />
            </td>
            <td
              v-if="showIndex"
              class="px-4 text-center"
              :class="[dense ? 'py-2.5' : 'py-4']"
            >
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
        <tbody v-else-if="filteredItems.length === 0">
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

        <!-- Rows -->
        <tbody v-else>
          <tr
            v-for="(row, index) in pagedItems"
            :key="keyFor(row, index)"
            :class="[
              'border-b last:border-0 transition-colors',
              th.border,
              th.rowHover,
              striped && index % 2 === 1 ? th.stripe : '',
              selectable && isRowSelected(row) ? 'bg-primary/5' : '',
            ]"
            @click="emit('row-click', row)"
          >
            <!-- Checkbox cell -->
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
                @change="toggleSelectRow(row)"
              />
            </td>

            <!-- Index cell -->
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
              <!-- 1. Full per-column override -->
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
                  @update:model-value="(v: boolean) => onToggle(col, row, v)"
                  @click.stop
                />
              </div>

              <!-- 3. Badge -->
              <span
                v-else-if="col.type === 'badge'"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                :class="
                  BADGE_CLASS[col.badge?.(row[col.key], row)?.color || 'gray']
                "
              >
                <span class="size-1.5 rounded-full bg-current" />
                {{
                  col.badge?.(row[col.key], row)?.label ??
                  formatCell(col, row, locale)
                }}
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

              <!-- 5. Text / number / date / custom -->
              <template v-else>{{ formatCell(col, row, locale) }}</template>
            </td>
          </tr>
        </tbody>

        <!-- ═══ Summary footer ═══ -->
        <tfoot v-if="hasSummary && !loading && filteredItems.length > 0">
          <tr :class="['border-t', th.border]">
            <!-- Checkbox placeholder -->
            <td v-if="selectable" class="px-4" :class="dense ? 'py-2.5' : 'py-4'" />
            <!-- Index placeholder -->
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
                <span v-if="summaryMap.get(col.key)!.label" class="block text-xs font-normal" :class="th.muted">
                  {{ summaryMap.get(col.key)!.label }}
                </span>
                {{ summaryValue(summaryMap.get(col.key)!) }}
              </template>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- ═══ Footer slot (below table, above pagination) ═══ -->
    <div v-if="$slots.footer" class="px-2 mt-2">
      <slot name="footer" />
    </div>

    <!-- ═══ Pagination ═══ -->
    <div
      v-if="showPager"
      class="flex border-t pt-4 px-4 mt-2"
      :class="[th.border, justifyClass(paginationAlign)]"
    >
      <Pagination
        :page="pagerPage"
        :items-per-page="pagerPerPage"
        :total="pagerTotal"
        @update:page="onPagerUpdate"
      />
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
