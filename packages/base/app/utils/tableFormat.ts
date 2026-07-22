import type { TableColumn } from "../../shared/types/table";

/**
 * Renders a cell's value to a display string based on the column `type`/`format`.
 * `date` and `number` are localized (Arabic vs. English digits/format); an
 * explicit `format` callback overrides everything. Empty values become `—`.
 */
export function formatCell<T extends Record<string, unknown>>(
  col: TableColumn<T>,
  row: T,
  locale: string,
): string {
  const raw = row[col.key];
  if (col.format) return col.format(raw, row);
  if (raw == null || raw === "") return "—";

  if (col.type === "date") {
    const d = new Date(raw as string | number | Date);
    return Number.isNaN(+d)
      ? String(raw)
      : d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  }

  if (col.type === "number" && typeof raw === "number") {
    return raw.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
  }

  return String(raw);
}
