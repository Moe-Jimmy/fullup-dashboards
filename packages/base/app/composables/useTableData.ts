import type { TableColumn, TableSort } from "../../shared/types/table";

interface UseTableDataOptions<T> {
  items: MaybeRefOrGetter<T[]>;
  columns: MaybeRefOrGetter<TableColumn<T>[]>;
  searchable: MaybeRefOrGetter<boolean>;
  manualSearch: MaybeRefOrGetter<boolean>;
  manualSort: MaybeRefOrGetter<boolean>;
  /** True when a controlled `pagination` prop drives the table (server mode). */
  server: MaybeRefOrGetter<boolean>;
}

/**
 * Owns client-side **search + sort** state and derives the visible, ordered rows.
 *
 * In server mode (controlled pagination) the rows are passed through untouched —
 * the parent is expected to fetch already-filtered/sorted data and react to the
 * emitted `search`/`sort` events instead.
 */
export function useTableData<T extends Record<string, unknown>>(
  opts: UseTableDataOptions<T>,
) {
  const { locale } = useI18n();
  const search = ref("");
  const sortState = ref<TableSort | null>(null);

  /** Cycle a column through asc → desc → unsorted. */
  function toggleSort(col: TableColumn<T>) {
    if (!col.sortable) return;
    if (sortState.value?.key !== col.key) {
      sortState.value = { key: col.key, direction: "asc" };
    } else if (sortState.value.direction === "asc") {
      sortState.value = { key: col.key, direction: "desc" };
    } else {
      sortState.value = null;
    }
  }

  function sortIcon(col: TableColumn<T>) {
    if (sortState.value?.key !== col.key) return "i-lucide-chevrons-up-down";
    return sortState.value.direction === "asc"
      ? "i-lucide-chevron-up"
      : "i-lucide-chevron-down";
  }

  const processedItems = computed<T[]>(() => {
    const server = toValue(opts.server);
    let rows = toValue(opts.items);

    const clientSearch =
      toValue(opts.searchable) && !toValue(opts.manualSearch) && !server;
    if (clientSearch && search.value.trim()) {
      const q = search.value.trim().toLowerCase();
      const columns = toValue(opts.columns);
      rows = rows.filter((row) =>
        columns.some((c) => {
          const v = row[c.key];
          return v != null && String(v).toLowerCase().includes(q);
        }),
      );
    }

    if (!toValue(opts.manualSort) && !server && sortState.value) {
      const { key, direction } = sortState.value;
      rows = [...rows].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (av == null) return 1;
        if (bv == null) return -1;
        const r =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv), locale.value);
        return direction === "asc" ? r : -r;
      });
    }

    return rows;
  });

  return { search, sortState, toggleSort, sortIcon, processedItems };
}
