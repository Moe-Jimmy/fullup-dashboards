import type { TableFilter, TableFilterValues } from "../../shared/types/table";

/**
 * Manages the reactive state of config-driven table filters.
 *
 * Initialises each filter with its `defaultValue` (or `undefined`), exposes
 * a flat `filterValues` record, and provides a `resetFilters` helper.
 */
export function useTableFilters(
  filters: MaybeRefOrGetter<TableFilter[]>,
) {
  const filterValues = ref<TableFilterValues>({});

  // Initialise defaults whenever the filter config changes.
  watch(
    () => toValue(filters),
    (list) => {
      const current = filterValues.value;
      const next: TableFilterValues = {};
      for (const f of list) {
        // Keep existing value if already set, otherwise use default.
        next[f.key] = current[f.key] ?? f.defaultValue ?? undefined;
      }
      filterValues.value = next;
    },
    { immediate: true },
  );

  function resetFilters() {
    const list = toValue(filters);
    const next: TableFilterValues = {};
    for (const f of list) {
      next[f.key] = f.defaultValue ?? undefined;
    }
    filterValues.value = next;
  }

  return { filterValues, resetFilters };
}
