/**
 * Manages row selection state for BaseTable.
 *
 * Handles select-all (current page), individual row toggle,
 * and exposes the `vChecked` directive for native checkbox sync.
 */
export function useTableSelection<T>(
  pagedItems: Ref<T[]>,
  selected: Ref<T[]>,
  selectable: MaybeRefOrGetter<boolean>,
) {
  const allPageSelected = computed(() => {
    if (!toValue(selectable) || pagedItems.value.length === 0) return false;
    return pagedItems.value.every((row) => selected.value.includes(row));
  });

  const somePageSelected = computed(() => {
    if (!toValue(selectable)) return false;
    return (
      selected.value.length > 0 &&
      pagedItems.value.some((row) => selected.value.includes(row)) &&
      !allPageSelected.value
    );
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

  function clearSelection() {
    selected.value = [];
  }

  /** Directive that sets the `checked` DOM property (`:checked` attr doesn't work). */
  const vChecked = {
    mounted(el: HTMLInputElement, binding: { value: boolean }) {
      el.checked = binding.value;
    },
    updated(el: HTMLInputElement, binding: { value: boolean }) {
      el.checked = binding.value;
    },
  };

  return {
    allPageSelected,
    somePageSelected,
    toggleSelectAll,
    toggleSelectRow,
    isRowSelected,
    clearSelection,
    vChecked,
  };
}
