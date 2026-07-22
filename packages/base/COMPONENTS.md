# `@fullup/base` — Components & Composables Reference

Every component below is **auto-imported** into all apps (superadmin, admin, company, provider) via the Nuxt layer. Nested folders flatten into the component name prefix:

| File path | Component name |
|-----------|----------------|
| `components/global/Forms/TextInput.vue` | `<FormsTextInput>` |
| `components/global/Details/info.vue` | `<DetailsInfo>` |
| `components/layout/DashboardSidebar.vue` | `<LayoutDashboardSidebar>` |
| `components/svg/LightMainLogo.vue` | `<SvgLightMainLogo>` |

All form inputs share one convention: `v-model` for the value, `:ui` styling pulled from `utils/formUi.ts`, and an absolutely-positioned error slot styled in scoped CSS. Labels/placeholders are passed in already-translated (caller calls `$t`).

---

## Form inputs (`components/global/Forms`)

### `<FormsTextInput>`
Single-line text field wrapped in `UFormField`.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model` | `string \| number` | `""` | field value |
| `label` | `string` | — | **required** |
| `name` | `string` | — | **required**, form field name (validation key) |
| `placeholder` | `string` | `""` | |
| `icon` | `string` | — | leading icon |
| `type` | `"text" \| "email" \| "number" \| "tel" \| "url"` | `"text"` | |
| `disabled` | `boolean` | `false` | dims + blocks input |

### `<FormsPasswordInput>`
Password field with show/hide eye toggle.

| Prop | Type | Default |
|------|------|---------|
| `v-model` | `string` | `""` |
| `label` | `string` | **required** |
| `name` | `string` | **required** |
| `placeholder` | `string` | `""` |
| `icon` | `string` | `"i-lets-icons:lock-light"` |

No `type`/`disabled` prop — toggle handled internally.

### `<FormsSelectInput>`
`USelectMenu` dropdown, optional search + multi-select.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model` | `string \| number \| null \| string[] \| number[]` | `""` | array when `multiple` |
| `label` | `string` | — | **required** |
| `name` | `string` | — | **required** |
| `items` | `SelectItem[]` | — | **required**; `{label,value}` or any record |
| `placeholder` | `string` | `""` | |
| `icon` | `string` | — | |
| `valueKey` | `string` | `"value"` | which key becomes the model value |
| `multiple` | `boolean` | `false` | |
| `searchable` | `boolean` | `false` | shows search box |
| `searchPlaceholder` | `string` | `""` | falls back to `placeholder` |
| `filterFields` | `string[]` | `["label"]` | keys the search matches |
| `disabled` | `boolean` | `false` | |

### `<FormsLocaleInput>`
Bilingual text/textarea — one field, AR/EN toggle, green dot marks filled langs.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model:ar` | `string` | `""` | Arabic value |
| `v-model:en` | `string` | `""` | English value |
| `label` | `string` | — | **required** |
| `name` | `string` | — | **required**; emits `${name}Ar` / `${name}En` as field name |
| `placeholder` | `string` | `""` | |
| `icon` | `string` | — | |
| `type` | `"text"` | `"text"` | |
| `disabled` | `boolean` | `false` | |
| `multiline` | `boolean` | `false` | renders `UTextarea` |
| `rows` | `number` | `4` | textarea rows |

### `<FormsPhoneInput>`
Country-code select + masked phone input. Mask/example/validation come from `countriesData` (15 countries). Default country Saudi (`+966`).

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model` | `string` | `""` | raw digits (masked) |
| `v-model:dialCode` | `string` | `"+966"` | selected dial code |
| `v-model:valid` | `boolean` | `false` | **read-only out** — true when digits match country regex |

Switching country clears the number and updates the dial code.

### `<FormsDatePicker>`
`UInputDate` + calendar popover. Model is an ISO `YYYY-MM-DD` string (converts to/from `CalendarDate` internally). RTL/locale-aware.

| Prop | Type | Default |
|------|------|---------|
| `v-model` | `string` | `""` (ISO `YYYY-MM-DD`) |

No other props — styling fixed.

### `<FormsToggleSwitch>`
`USwitch` with donut-style thumb. Optionally boxed with title/description.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model` | `boolean` | `false` | |
| `title` | `string` | `""` | boxed only |
| `description` | `string` | `""` | boxed only |
| `boxed` | `boolean` | `true` | `false` = bare switch |

### `<FormsFileUpload>`
`UFileUpload` dropzone, single or multi.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model` | `File \| File[] \| null` | `null` | |
| `label` | `string` | — | **required** |
| `name` | `string` | — | **required** |
| `accept` | `string` | — | e.g. `"image/*"` |
| `fileIcon` | `string` | `"i-codicon:file-pdf"` | |
| `description` | `string` | `""` | falls back to localized "drag file here" |
| `optional` | `boolean` | `false` | shows "optional" hint |
| `multiple` | `boolean` | `false` | |
| `inputClass` | `string` | `""` | extra classes on dropzone |

### `<FormsImageCropModal>`
Modal pan/zoom/pinch image cropper. Exports a cropped `File` at source resolution. Pair it with the `useCroppableImage()` composable.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model:open` | `boolean` | `false` | modal visibility |
| `v-model:crop` | `CropState \| null` | `null` | saved pan/zoom; re-opens on original without compounding crops |
| `src` | `string \| File \| Blob \| null` | — | **required** image source |
| `aspectRatio` | `number` | `483/292` | crop frame ratio |
| `outputType` | `string` | `"image/png"` | export MIME |
| `quality` | `number` | `0.92` | export quality |
| `title` | `string` | `""` | falls back to `common.crop.title` i18n |
| `maxZoom` | `number` | `4` | |

**Emits:** `cropped(file: File, dataUrl: string)`.

### `<FormsSuccessModal>`
Centered success dialog with one action button (link or close).

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model:open` | `boolean` | `false` | |
| `title` | `string` | — | **required** |
| `description` | `string` | — | **required** |
| `buttonText` | `string` | — | **required** |
| `link` | `string \| null` | `null` | if set, button navigates (`NuxtLinkLocale`) else just closes |

### `<FormsFieldDetach>`
Utility wrapper. Calls `useFormField()` and renders `<slot/>` — detaches a child control from its parent form field context (used inside `PhoneInput`). No props.

---

## Global components (`components/global`)

### `<ConfirmDialog>`
Destructive-action confirm modal (red icon, confirm/cancel).

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model:open` | `boolean` | `false` | |
| `title` | `string` | — | **required** |
| `message` | `string` | — | **required**; preserves line breaks |
| `confirmLabel` | `string` | — | **required** |
| `cancelLabel` | `string` | — | **required** |
| `icon` | `string` | `"i-lucide-trash-2"` | |
| `loading` | `boolean` | `false` | spinner + disables confirm |

**Emits:** `confirm`. (Cancel closes internally.)

### `<FilterTabs>`
Card of horizontally-scrollable filter buttons with optional counts.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model` | `string` | — | **required**; selected `value` |
| `items` | `FilterTabItem[]` | — | **required**; `{label, value, count?}` |
| `title` | `string` | `""` | card header |
| `icon` | `string` | `""` | header icon |

### `<Pagination>`
`UPagination` wrapper — long-arrow prev/next, RTL-aware, responsive sibling count.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `v-model:page` | `number` | `1` | |
| `total` | `number` | — | **required**; total item count |
| `itemsPerPage` | `number` | `10` | |
| `siblingCount` | `number` | `2` | 1 on mobile |
| `showEdges` | `boolean` | `true` | off on mobile |

### `<SectionTitle>`
Pill title + brand subtitle heading block.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `title` | `string` | — | **required**; pill text |
| `subtitle` | `string` | — | **required**; large brand heading |
| `isCenter` | `boolean` | `true` | `false` = start-aligned on `lg` |

### `<LangSwitcher>`
Renders a button per non-active locale, switches route. No props.

### `<ColorModeSwitcher>`
Sun/moon toggle for `useColorMode()`, tooltip label. No props.

### `<DetailsInfo>` (`Details/info.vue`)
Icon + label/value read-only row (for detail pages).

| Prop | Type | Notes |
|------|------|-------|
| `label` | `string` | **required** |
| `value` | `string` | **required** |
| `icon` | `string` | **required** |

### `<DetailsImage>` (`Details/image.vue`)
File attachment row with type icon + open-in-new-tab eye button.

| Prop | Type | Notes |
|------|------|-------|
| `label` | `string` | **required** |
| `fileName` | `string` | **required** |
| `fileUrl` | `string` | **required**; opens in new tab |
| `fileType` | `"image" \| "pdf"` | **required**; picks icon + color |

---

## Table (`components/tables`)

### `<TablesBaseTable>`
Config-driven, RTL-aware data table used across all dashboards. Thin orchestrator that composes private sub-components (`tables/shared/`) and composables. Generic over the row type `T`.

**Architecture:** `BaseTable.vue` (~250 lines) provides shared state via `useTableContext` (provide/inject) to 7 private sub-components: `BaseTableHeader`, `BaseTableBulkBar`, `BaseTableFiltersBar`, `BaseTableHead`, `BaseTableBody`, `BaseTableFoot`, `BaseTablePagination`.

#### Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `items` | `T[]` | — | **required**; row data |
| `columns` | `TableColumn<T>[]` | — | **required**; column config |
| `title` | `string` | `""` | header title (header hidden when empty) |
| `titleIcon` | `string` | `""` | icon before the title |
| `showCount` | `boolean` | `false` | show total row count badge beside the title |
| `totalCount` | `number` | — | override displayed count (e.g. backend total); falls back to computed total |
| `titleAlign` | `TableAlign` | `"start"` | title zone alignment |
| `actionsAlign` | `TableAlign` | `"end"` | `#header-actions` alignment |
| `paginationAlign` | `TableAlign` | `"end"` | pager alignment |
| `loading` | `boolean` | `false` | skeleton rows |
| `searchable` | `boolean` | `false` | search box (client filter unless `manualSearch`) |
| `searchPlaceholder` | `string` | `""` | |
| `showPagination` | `boolean` | `true` | master switch for the pager |
| `pagination` | `TablePagination` | — | controlled/server paging (wins over `perPage`) |
| `perPage` | `number` | `0` | client page size; `0` = show all (no pager) |
| `perPageOptions` | `number[]` | `[]` | rows-per-page dropdown (e.g. `[5, 10, 20, 50]`) |
| `rowActions` | `TableRowAction<T>[]` | `[]` | buttons for an `actions`-type column |
| `dense` | `boolean` | `false` | tighter rows |
| `striped` | `boolean` | `false` | zebra rows |
| `theme` | `"light" \| "dark"` | `"light"` | `dark` forces a dark surface |
| `emptyText` | `string` | `""` | empty-state message |
| `manualSort` | `boolean` | `false` | emit `sort` only (server sorts) |
| `manualSearch` | `boolean` | `false` | emit `search` only (server filters) |
| `rowKey` | `string \| ((row, i) => string\|number)` | `"id"` | row `:key` |
| `selectable` | `boolean` | `false` | enable row selection with checkboxes |
| `showIndex` | `boolean` | `false` | prepend auto-numbered `#` column (page-aware) |
| `filters` | `TableFilter[]` | `[]` | config-driven filter bar (select, date-range, date-picker) |
| `manualFilter` | `boolean` | `false` | emit `filter` only (server filters) |
| `filtersPosition` | `"below" \| "inline"` | `"below"` | `"inline"` renders filters beside the title |
| `filtersAlign` | `TableAlign` | `"end"` | alignment of select dropdown filters row |
| `dateRangeAlign` | `TableAlign` | `"end"` | alignment of date-range preset tabs row |
| `summaryColumns` | `TableSummaryColumn[]` | `[]` | footer summary row (auto-sum, count, static, or custom fn) |
| `bulkActions` | `TableBulkAction<T>[]` | `[]` | bulk actions shown when rows are selected |

#### Models

| Model | Type | Notes |
|-------|------|-------|
| `v-model:selected` | `T[]` | selected rows (requires `selectable`) |

#### Emits

| Event | Payload | Notes |
|-------|---------|-------|
| `sort` | `TableSort \| null` | column sort changed |
| `toggle` | `TableToggleEvent<T>` | toggle switch flipped |
| `search` | `string` | search query changed |
| `row-click` | `T` | row clicked |
| `update:page` | `number` | page changed (server mode) |
| `update:selected` | `T[]` | selection changed |
| `filter` | `TableFilterValues` | filter values changed |

#### Slots

| Slot | Scope | Purpose |
|------|-------|---------|
| `#header-start` | — | replace the title area |
| `#header-actions` | — | header buttons (add / filter / export / back) |
| `#bulk-actions` | `{ selected, clear }` | replace bulk action buttons |
| `#toolbar` | — | secondary row (filter tabs, date ranges) |
| `#filters` | `{ values, reset }` | custom filter content (override or extend) |
| `#{key}-header` | `{ column }` | custom header cell for a column |
| `#column-{key}` | `{ row, value, index }` | custom body cell (overrides `type`) |
| `#actions` | `{ row, index }` | replace the row-action buttons |
| `#empty` | — | custom empty state |
| `#footer` | — | content below table, above pagination |

#### Column types

`TableColumn.type`: `text` (default) · `number` · `date` · `toggle` · `badge` (needs `badge(value,row)`) · `actions` (renders `rowActions`) · `custom`.

#### Filter types

`TableFilter.type`: `select` (dropdown with searchable options) · `date-range` (preset tabs like week/30d/6m/12m) · `date-picker` (calendar input).

#### Alignment

`TableAlign` = `start | center | end | left | right`. `start`/`end` are **logical** (flip with locale — RTL-aware), `left`/`right` are **physical**. Applies to columns, title, actions, pagination, filters, date-range tabs.

#### Pagination modes

- **None** — `perPage` unset; shows all rows.
- **Client-side** — `:per-page="N"` slices locally. Add `:per-page-options="[5, 10, 20]"` for a rows-per-page dropdown.
- **Controlled/server** — `:pagination` prop + `@update:page` event. All search/sort/filter are emit-only (parent re-fetches).

#### Summary footer

Pass `:summary-columns` to render a `<tfoot>` with per-column totals:
- `"sum"` — auto-sum all rows for that column key
- `"count"` — count of rows
- static `string | number` — displayed as-is
- `(rows) => string | number` — custom function

---

## Layout components (`components/layout`)

### `<LayoutDashboardSidebar>`
Generic collapsible sidebar shell (logo, tooltips, profile footer, custom scrollbar). **Menu data is per-app** — pulls entries from `useDashboardNav()`, which each app overrides. Renders `link` and `group` (collapsible) entries; supports `active`/`danger` states. Always mounts expanded (avoids collapsed-hydration mismatch). No props — driven by the composable + i18n (`dashboard.profile.*`).

### `<LayoutDashboardNavbar>`
Top bar: page title from `route.meta.title` (i18n key or array → breadcrumb), search box, `LangSwitcher`, `ColorModeSwitcher`, notifications bell. No props. Set `definePageMeta({ title: 'some.i18n.key' })` per page.

### `<LayoutDashboardFooter>`
Copyright + privacy link + social icons. No props (socials hardcoded, `#` hrefs).

---

## SVG components (`components/svg`)

Presentational, **no props** — inline `<svg>` renders. Swap by light/dark via `dark:hidden` / `hidden dark:block`.

| Component | Purpose |
|-----------|---------|
| `<SvgLightMainLogo>` / `<SvgDarkMainLogo>` | full wordmark logo (light/dark) |
| `<SvgLightFLogo>` / `<SvgDarkFLogo>` | collapsed "F" mark (light/dark) |

---

## Composables (`composables/`)

### `useDashboardNav(): ComputedRef<SidebarEntry[]>`
Base version returns `[]`. **Each app overrides** `app/composables/useDashboardNav.ts` to supply its sidebar menu. Consumed by `<LayoutDashboardSidebar>`.

### `useSidebarLink()`
Helper apps use to build sidebar link entries.

```ts
const { link } = useSidebarLink();
link(key, labelKey, icon, { to?, active?, danger? }): SidebarLink
```
- `labelKey` resolves from i18n namespace `dashboard.sidebar.items.*`.
- `active` auto-computed from the current route if not passed (root = exact match, else `startsWith`).

### `useCountries()`
Returns `{ countries }` — a `computed` of `{ label, value }` (label localized AR/EN, value = ISO code) from `countriesData`. For country select inputs.

### `useCroppableImage(initialUrl?)`
State machine pairing a file picker + `<FormsImageCropModal>`. Handles object-URL lifecycle (creates/revokes), tracks server vs. cropped vs. source image.

**Returns:**
| Key | Type | Notes |
|-----|------|-------|
| `sourceFile` | `Ref<File \| null>` | set from a file picker → opens crop flow |
| `file` | `Ref<File \| null>` | the file to submit (cropped or original) |
| `cropSource` | `ComputedRef<string \| null>` | image to feed the crop modal's `src` |
| `preview` | `ComputedRef<string \| null>` | cropped preview → falls back to source → server |
| `cropState` | `Ref<CropState \| null>` | bind to modal's `v-model:crop` |
| `cropOpen` | `Ref<boolean>` | bind to modal's `v-model:open` |
| `onCropped(file, dataUrl)` | fn | pass to modal's `@cropped` |
| `clear()` | fn | reset everything |

### `useTableData({ items, columns, searchable, manualSearch, manualSort, server })`
Owns `<TablesBaseTable>` search + sort state and derives the filtered/ordered rows. Returns `{ search, sortState, toggleSort, sortIcon, processedItems }`. Filtering/sorting are skipped in server mode (controlled pagination) — the parent reacts to the emitted `search`/`sort` events instead. Options are ref/getter-friendly (`MaybeRefOrGetter`).

### `useTablePagination(source, { perPage, pagination, showPagination })`
Unifies client-side (`perPage`) and controlled/server (`pagination`) paging behind one pager. Returns `{ pagedItems, showPager, pagerPage, pagerPerPage, pagerTotal, clientPage, resetPage }`. Controlled `pagination` always wins; auto-clamps the client page when the row set shrinks.

### `useTableAlign()`
RTL-aware alignment classes. Returns `{ isRtl, alignClass(align), justifyClass(align) }` where `align: TableAlign`. `start`/`end` are logical (flip with locale); `left`/`right` are physical (mapped through direction for flex content).

### `useTableFilters(filters)`
Manages reactive state for config-driven table filters. Initialises each filter with its `defaultValue`. Returns `{ filterValues, resetFilters }`.

### `useTableSelection(pagedItems, selected, selectable)`
Manages row selection state — select-all (current page), individual toggle, clear. Returns `{ allPageSelected, somePageSelected, toggleSelectAll, toggleSelectRow, isRowSelected, clearSelection, vChecked }`. The `vChecked` directive sets the native checkbox `checked` DOM property reactively.

### `useTableSummary(items, summaryColumns, locale)`
Computes summary footer values. Returns `{ hasSummary, summaryMap, summaryValue(sc) }`. Supports `"sum"`, `"count"`, static values, and custom functions.

### `useTableContext()` / `provideTableContext(ctx)`
Provide/inject bridge for `BaseTable` sub-components. `provideTableContext` is called once by `BaseTable.vue`; `useTableContext` is called by each sub-component to access shared state (theme classes, alignment helpers, locale, dense/selectable/showIndex/striped flags, columns).

---

## Utilities (`utils/`)

### `utils/formUi.ts` — shared `:ui` presets
Auto-imported constants used by the form inputs so styling stays consistent:

| Export | Type | Used by |
|--------|------|---------|
| `inputUi` | object | `TextInput`, `PasswordInput`, `LocaleInput` |
| `selectUi` | object | `SelectInput` |
| `fieldUi` | object | all `UFormField` labels/containers |
| `searchInput(placeholder)` | fn → config | searchable selects |

### `utils/countries.ts` — `countriesData`
`CountryData[]` (15 countries). Each: `nameEn`, `nameAr`, `code` (ISO2), `dialCode`, `phoneMask`, `phoneExample`, `phoneRegex`. Backs `PhoneInput` and `useCountries()`.

### `utils/tableFormat.ts` — `formatCell(col, row, locale)`
Renders a cell value to a display string per column `type`/`format` (localized `date`/`number`; empty → `—`). Used by `<TablesBaseTable>`.

### `utils/tableStyles.ts` — table class maps
`BADGE_CLASS` (badge pill colors), `ACTION_CLASS` (row-action variant colors), and `tableThemeClasses(isDark)` → the light/dark surface class set (`thead`, `td`, `border`, `rowHover`, `stripe`, `title`, `icon`, `muted`, `skeleton`).

---

## Shared types (`packages/base/shared/types`)

Imported in apps via the package export **`@fullup/base/types`** (not `#shared` — that doesn't cross layers). Key types referenced above:
- `SidebarEntry`, `SidebarGroup`, `SidebarLink` — `navigation.ts`
- `CropState` — `media.ts`
- `TableColumn`, `TableRowAction`, `TableBulkAction`, `TablePagination`, `TableSort`, `TableAlign`, `TableBadge`, `TableToggleEvent`, `TableFilter`, `TableFilterValues`, `TableSummaryColumn`, `TableFilterOption`, `TableDatePreset` — `table.ts`
- `FilterTabItem` — exported inline from `FilterTabs.vue`
- `CountryData` — exported from `utils/countries.ts`
