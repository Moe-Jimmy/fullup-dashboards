<script setup lang="ts">
const localePath = useLocalePath();

function addLink(type: "product" | "vehicle") {
  return localePath(`/fullup_brands/add_new_brand?mode=add&type=${type}`);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-8 py-10">
    <SvgBrandsEmptyState class="max-w-full h-auto" />

    <!-- product (primary, right) + vehicle (outline, left) -->
    <div class="flex items-center gap-4">
      <NuxtLinkLocale :to="addLink('product')" class="primary-btn">
        <UIcon name="i-lucide-circle-plus" class="size-5" />
        {{ $t("brands.empty.addForProduct") }}
      </NuxtLinkLocale>
      <NuxtLinkLocale
        :to="addLink('vehicle')"
        class="flex items-center gap-2 px-4 py-2 rounded-lg border border-t-placeholder text-t-sec hover:border-primary hover:text-primary transition-colors"
      >
        <UIcon name="i-lucide-circle-plus" class="size-5" />
        {{ $t("brands.empty.addForVehicle") }}
      </NuxtLinkLocale>
    </div>
  </div>
</template>
