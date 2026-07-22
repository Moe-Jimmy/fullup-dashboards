// Config-driven table contract shared by BaseTable across all dashboards.
// Exposed to apps via the "@fullup/base/types" package export.

export type TableColumnType =
  | "text"
  | "number"
  | "date"
  | "toggle"
  | "badge"
  | "actions"
  | "custom";

// `start`/`end` are logical (flip with locale direction — RTL-aware);
// `left`/`right` are physical (always that visual side).
export type TableAlign = "start" | "center" | "end" | "left" | "right";

export type TableBadgeColor =
  | "green"
  | "red"
  | "blue"
  | "purple"
  | "brand"
  | "gray";

export interface TableBadge {
  label: string;
  color?: TableBadgeColor;
}

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  type?: TableColumnType;
  sortable?: boolean;
  width?: string;
  align?: TableAlign;
  class?: string;
  /** Optional value formatter (overrides the built-in text/number/date rendering). */
  format?: (value: unknown, row: T) => string;
  /** For `type: 'badge'` — map a row to a colored pill. */
  badge?: (value: unknown, row: T) => TableBadge;
}

export type RowActionVariant = "default" | "danger" | "warning";

export interface TableRowAction<T = Record<string, unknown>> {
  icon: string;
  /** Accessible label / tooltip. */
  label?: string;
  variant?: RowActionVariant;
  show?: (row: T) => boolean;
  onClick: (row: T) => void;
}

export interface TableBulkAction<T = Record<string, unknown>> {
  icon: string;
  label: string;
  variant?: RowActionVariant;
  /** Called with all currently selected rows. */
  onClick: (rows: T[]) => void;
}

export interface TablePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

export type SortDirection = "asc" | "desc";

export interface TableSort {
  key: string;
  direction: SortDirection;
}

export interface TableToggleEvent<T = Record<string, unknown>> {
  row: T;
  key: string;
  value: boolean;
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

export type TableFilterType = "select" | "date-range" | "date-picker";

export interface TableFilterOption {
  label: string;
  value: string | number;
}

/** A date-range preset tab (e.g. "week", "30 days", "6 months"). */
export interface TableDatePreset {
  label: string;
  value: string;
}

export interface TableFilter {
  /** Unique key — used as the field name in the emitted filter object. */
  key: string;
  label: string;
  type: TableFilterType;
  /** For `select` — dropdown options. First option is typically "All". */
  options?: TableFilterOption[];
  /** For `date-range` — preset tabs (week, 30d, 6m, 12m …). */
  presets?: TableDatePreset[];
  /** Default value (string for select/date-range, string for date-picker). */
  defaultValue?: string | number;
  placeholder?: string;
  /** Icon shown in the select input. */
  icon?: string;
}

/** Map of filter key → current value, emitted by the table on change. */
export type TableFilterValues = Record<string, string | number | undefined>;

// ---------------------------------------------------------------------------
// Summary footer
// ---------------------------------------------------------------------------

export interface TableSummaryColumn {
  /** Column key to place the summary value under. */
  key: string;
  /** Label displayed in the summary cell (e.g. "الاجمالي"). */
  label?: string;
  /**
   * How to compute the value:
   * - `"sum"` — auto-sum all rows for this column key
   * - `"count"` — count of rows
   * - a static value (string/number) — displayed as-is
   * - a function — called with all rows, returns the display string
   */
  value: "sum" | "count" | string | number | ((rows: Record<string, unknown>[]) => string | number);
}
