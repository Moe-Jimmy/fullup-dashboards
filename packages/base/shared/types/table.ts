// Config-driven table contract shared by SharedTable across all dashboards.
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
