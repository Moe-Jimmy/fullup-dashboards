<script setup lang="ts">
type SelectItem = { label: string; value: string } | Record<string, unknown>;

const model = defineModel<
  string | number | null | undefined | string[] | number[]
>({
  default: "",
});

const { locale } = useI18n();

const props = withDefaults(
  defineProps<{
    label: string;
    name: string;
    items: SelectItem[];
    placeholder?: string;
    icon?: string;
    valueKey?: string;
    multiple?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    filterFields?: string[];
    disabled?: boolean;
  }>(),
  {
    placeholder: "",
    icon: undefined,
    valueKey: "value",
    multiple: false,
    searchable: false,
    searchPlaceholder: "",
    filterFields: () => ["label"],
    disabled: false,
  },
);

const searchInputConfig = computed(() =>
  props.searchable
    ? searchInput(props.searchPlaceholder || props.placeholder)
    : undefined,
);
</script>

<template>
  <UFormField :label="label" :name="name" :ui="fieldUi">
    <USelectMenu
      v-model="model"
      :items="items"
      :value-key="valueKey"
      :multiple="multiple"
      :placeholder="placeholder"
      :icon="icon"
      :disabled="disabled"
      :search-input="searchInputConfig"
      :filter-fields="filterFields"
      trailing-icon="i-lucide-chevron-down"
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
      class="w-full cursor-pointer"
      :ui="{
        ...selectUi,
        base:
          selectUi.base + (disabled ? ' opacity-60 cursor-not-allowed' : ''),
      }"
    />
  </UFormField>
</template>

<style scoped>
:deep([data-slot="error"]) {
  position: absolute;
  bottom: -22px;
  font-size: 0.75rem;
  white-space: nowrap;
  color: var(--color-t-red);
}
</style>