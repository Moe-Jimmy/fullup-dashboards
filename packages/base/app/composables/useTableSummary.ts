import type { TableSummaryColumn } from "../../shared/types/table";

/**
 * Computes summary footer values (sum, count, static, or custom function).
 */
export function useTableSummary(
  items: MaybeRefOrGetter<Record<string, unknown>[]>,
  summaryColumns: MaybeRefOrGetter<TableSummaryColumn[]>,
  locale: Ref<string>,
) {
  const hasSummary = computed(() => toValue(summaryColumns).length > 0);

  const summaryMap = computed(() => {
    const map = new Map<string, TableSummaryColumn>();
    for (const sc of toValue(summaryColumns)) map.set(sc.key, sc);
    return map;
  });

  function summaryValue(sc: TableSummaryColumn): string | number {
    const rows = toValue(items);
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

  return { hasSummary, summaryMap, summaryValue };
}
