<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { t, locale } = useI18n();
const localePath = useLocalePath();

function addLink(type: "product" | "vehicle") {
  return localePath(`/fullup_brands/add_new_brand?mode=add&type=${type}`);
}

const items = computed<DropdownMenuItem[]>(() => [
  {
    label: t("brands.addForProduct"),
    icon: "i-lucide-package",
    onSelect: () => navigateTo(addLink("product")),
  },
  {
    label: t("brands.addForVehicle"),
    icon: "i-lucide-truck",
    onSelect: () => navigateTo(addLink("vehicle")),
  },
]);
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'start' }"
    :ui="{ content: 'min-w-56' }"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <button type="button" class="primary-btn">
      <UIcon name="i-lucide-circle-plus" class="size-5" />
      {{ $t("brands.addBrand") }}
      <UIcon name="i-lucide-chevron-down" class="size-4" />
    </button>
  </UDropdownMenu>
</template>
