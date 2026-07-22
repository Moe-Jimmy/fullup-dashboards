import type { TablePagination } from "../../shared/types/table";

interface UseTablePaginationOptions {
  perPage: MaybeRefOrGetter<number>;
  pagination: MaybeRefOrGetter<TablePagination | undefined>;
  showPagination: MaybeRefOrGetter<boolean>;
}

/**
 * Unifies **client-side** (`perPage`) and **controlled/server** (`pagination`)
 * paging behind one set of pager props. A controlled `pagination` prop always
 * wins; otherwise rows are sliced locally to the current page.
 *
 * @param source getter/ref of the already-filtered rows to paginate
 */
export function useTablePagination<T>(
  source: MaybeRefOrGetter<T[]>,
  opts: UseTablePaginationOptions,
) {
  const rows = computed(() => toValue(source));
  const perPage = computed(() => toValue(opts.perPage));
  const controlled = computed(() => toValue(opts.pagination));
  const clientPage = ref(1);

  const isClientPaginated = computed(
    () => !controlled.value && perPage.value > 0,
  );

  const clientTotalPages = computed(() =>
    isClientPaginated.value
      ? Math.max(1, Math.ceil(rows.value.length / perPage.value))
      : 1,
  );

  /** Rows for the current page (all rows when client paging is off). */
  const pagedItems = computed<T[]>(() => {
    if (!isClientPaginated.value) return rows.value;
    const start = (clientPage.value - 1) * perPage.value;
    return rows.value.slice(start, start + perPage.value);
  });

  // Keep the page in range when the row set shrinks (e.g. after filtering).
  watch(clientTotalPages, (total) => {
    if (clientPage.value > total) clientPage.value = total;
  });

  const showPager = computed(() => {
    if (!toValue(opts.showPagination)) return false;
    if (controlled.value) return controlled.value.totalPages > 1;
    return isClientPaginated.value && clientTotalPages.value > 1;
  });
  const pagerPage = computed(() =>
    controlled.value ? controlled.value.currentPage : clientPage.value,
  );
  const pagerPerPage = computed(() =>
    controlled.value ? controlled.value.perPage : perPage.value,
  );
  const pagerTotal = computed(() =>
    controlled.value ? controlled.value.totalItems : rows.value.length,
  );

  /** Jump back to the first page (used when search/filters change). */
  function resetPage() {
    clientPage.value = 1;
  }

  return {
    pagedItems,
    showPager,
    pagerPage,
    pagerPerPage,
    pagerTotal,
    clientPage,
    resetPage,
  };
}
