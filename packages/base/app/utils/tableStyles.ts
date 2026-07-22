import type { RowActionVariant, TableBadgeColor } from "../../shared/types/table";

/** Badge pill classes keyed by semantic color (see `TableColumn.badge`). */
export const BADGE_CLASS: Record<TableBadgeColor, string> = {
  green: "bg-green-bg text-t-green",
  red: "bg-red-bg text-t-red",
  blue: "bg-blue-bg text-t-blue",
  purple: "bg-purple-bg text-t-purple",
  brand: "bg-brand-bg text-t-brand",
  gray: "bg-bg-icon-gray text-t-sec",
};

/** Row-action button classes keyed by variant (see `TableRowAction.variant`). */
export const ACTION_CLASS: Record<RowActionVariant, string> = {
  default: "bg-purple-bg text-t-purple",
  danger: "bg-red-bg text-t-red",
  warning: "bg-bg-orange-light text-t-brand",
};

export interface TableThemeClasses {
  thead: string;
  td: string;
  border: string;
  rowHover: string;
  stripe: string;
  title: string;
  icon: string;
  muted: string;
  skeleton: string;
}

/**
 * Theme-specific class set for the table surface. `dark` forces a dark look
 * (e.g. the transactions log) regardless of the app's color mode; `light`
 * uses semantic tokens so it still adapts to the app's dark mode.
 */
export function tableThemeClasses(isDark: boolean): TableThemeClasses {
  return isDark
    ? {
        thead: "text-[#a9b4be]",
        td: "text-white",
        border: "border-white/5",
        rowHover: "hover:bg-white/[0.03]",
        stripe: "bg-white/[0.02]",
        title: "text-white",
        icon: "text-[#a9b4be]",
        muted: "text-[#a9b4be]",
        skeleton: "bg-white/10",
      }
    : {
        thead: "text-t-sec",
        td: "text-t-primary-gray",
        border: "border-black/5 dark:border-white/5",
        rowHover: "hover:bg-bg-icon-gray/40",
        stripe: "bg-bg-pages/60 dark:bg-white/[0.02]",
        title: "text-t-white",
        icon: "text-t-sec",
        muted: "text-t-sec",
        skeleton: "bg-bg-icon-gray",
      };
}
