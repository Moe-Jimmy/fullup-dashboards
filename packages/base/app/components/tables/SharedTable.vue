<!--
  SharedTable — config-driven, RTL-aware data table shared across all dashboards.

  Logic lives in composables/utils (auto-imported), keeping this file focused on
  markup + prop wiring:
    • useTableData        — search + sort state → ordered/filtered rows
    • useTablePagination  — client (`perPage`) & controlled (`pagination`) paging
    • useTableAlign       — RTL-aware `align`/`justify` classes
    • utils/tableFormat   — `formatCell` (date/number/format)
    • utils/tableStyles   — badge/action colors + per-theme class set

  Slots: `#header-start`, `#header-actions`, `#toolbar`, `#{key}-header`,
         `#column-{key}` (cell override), `#actions`, `#empty`.
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
  },
);

const emit = defineEmits<{
  sort: [TableSort | null];
  toggle: [TableToggleEvent<T>];
  search: [string];
  "row-click": [T];
  "update:page": [number];
}>();

const slots = useSlots();
const { t, locale } = useI18n();

// Alignment (RTL-aware), data (search + sort), and pagination logic.
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

const {
  pagedItems,
  showPager,
  pagerPage,
  pagerPerPage,
  pagerTotal,
  clientPage,
  resetPage,
} = useTablePagination<T>(processedItems, {
  perPage: () => props.perPage,
  pagination: () => props.pagination,
  showPagination: () => props.showPagination,
});

// Bubble state changes up; reset to page 1 whenever the search changes.
watch(search, (v) => {
  emit("search", v);
  resetPage();
});
watch(sortState, (s) => emit("sort", s));

// Theme class set (consolidates the light/dark branching).
const isDark = computed(() => props.theme === "dark");
const th = computed(() => tableThemeClasses(isDark.value));

function onToggle(col: TableColumn<T>, row: T, value: boolean) {
  // Mutate the reactive row (drop-in with v-model), then notify the parent.
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
</script>

<template>
  <div class="w-full" :class="isDark ? 'bg-surface-dark rounded-2xl p-2' : ''">
    <!-- Header: title zone (`titleAlign`) + action buttons (`actionsAlign`).
         Each zone only renders when it has content, so a lone zone can span
         the full width and align across it. -->
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

    <!-- Secondary toolbar (filter tabs, date ranges, etc.) -->
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
        :placeholder="searchPlaceholder || t('common.search', 'Search…')"
        class="w-full sm:max-w-xs"
      />
    </div>

    <!-- Scroll container (mobile responsiveness) -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[600px] border-collapse">
        <!-- Head -->
        <thead>
          <tr :class="['border-b', th.border]">
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
              v-for="col in columns"
              :key="col.key"
              :class="['px-4', dense ? 'py-2.5' : 'py-4']"
            >
              <div class="h-4 rounded-md animate-pulse" :class="th.skeleton" />
            </td>
          </tr>
        </tbody>

        <!-- Empty -->
        <tbody v-else-if="processedItems.length === 0">
          <tr>
            <td :colspan="columns.length" class="px-4">
              <slot name="empty">
                <div class="py-10 text-center text-sm" :class="th.muted">
                  {{ emptyText || t("common.empty", "No data available") }}
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
            ]"
            @click="emit('row-click', row)"
          >
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
      </table>
    </div>

    <!-- Pagination (client-side via `perPage`, or controlled via `pagination`) -->
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
