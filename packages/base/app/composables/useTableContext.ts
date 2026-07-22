import type { InjectionKey } from "vue";
import type { TableAlign, TableColumn } from "../../shared/types/table";
import type { TableThemeClasses } from "../utils/tableStyles";

/**
 * Shared context injected by `BaseTable` into all private sub-components.
 * Avoids prop-drilling theme, alignment, locale, and layout flags.
 */
export interface TableContext {
  th: Readonly<Ref<TableThemeClasses>>;
  isDark: Readonly<Ref<boolean>>;
  locale: Readonly<Ref<string>>;
  t: (key: string) => string;
  dense: Readonly<Ref<boolean>>;
  selectable: Readonly<Ref<boolean>>;
  showIndex: Readonly<Ref<boolean>>;
  striped: Readonly<Ref<boolean>>;
  columns: Readonly<Ref<TableColumn[]>>;
  alignClass: (align?: TableAlign) => string;
  justifyClass: (align?: TableAlign) => string;
}

const TABLE_CTX_KEY: InjectionKey<TableContext> = Symbol("BaseTableContext");

/** Called once by `BaseTable.vue` to expose shared state to sub-components. */
export function provideTableContext(ctx: TableContext) {
  provide(TABLE_CTX_KEY, ctx);
}

/** Called by each sub-component to access the shared table context. */
export function useTableContext(): TableContext {
  const ctx = inject(TABLE_CTX_KEY);
  if (!ctx) throw new Error("[BaseTable] sub-component used outside BaseTable");
  return ctx;
}
