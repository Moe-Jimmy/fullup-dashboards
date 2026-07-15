<script setup lang="ts">
import type { Brand } from "~~/shared/types/brands";

const props = defineProps<{ brands: Brand[] }>();

const emit = defineEmits<{ "toggle-status": [id: number, value: boolean] }>();

const { locale } = useI18n();

const search = ref("");
const pageSize = 6;
const page = ref(1);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return props.brands;
  return props.brands.filter(
    (b) =>
      b.nameAr.toLowerCase().includes(q) || b.nameEn.toLowerCase().includes(q),
  );
});

const paged = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize),
);

// Reset to first page when the search or upstream list changes.
watch([search, () => props.brands], () => {
  page.value = 1;
});
</script>

<template>
  <div class="bg-bg-landingpage rounded-2xl p-4 border border-default space-y-7">
    <!-- Header: add dropdown (left) + title (right) -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-bandage" class="text-t-sec size-5" />
        <h3 class="text-t-sec font-bold text-base">{{ $t("brands.title") }}</h3>
      </div>
      <BrandsAddBrandDropdown />
    </div>

    <!-- Empty state -->
    <BrandsEmptyState v-if="brands.length === 0" />

    <template v-else>
      <!-- Search -->
      <div
        class="h-12 rounded-lg  border-[0.25px] border-t-placeholder flex items-center gap-2 px-4"
      >
        <UIcon name="i-lucide-search" class="text-t-placeholder size-4 shrink-0" />
        <input
          v-model="search"
          type="text"
          :placeholder="$t('brands.searchPlaceholder')"
          :dir="locale === 'ar' ? 'rtl' : 'ltr'"
          class="flex-1  outline-none text-sm"
        >
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <BrandsBrandCard
          v-for="brand in paged"
          :key="brand.id"
          :brand="brand"
          @update:status="(v) => emit('toggle-status', brand.id, v)"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="filtered.length > pageSize"
        class="flex justify-center border-t border-default pt-4"
      >
        <Pagination
          v-model:page="page"
          :items-per-page="pageSize"
          :total="filtered.length"
        />
      </div>
    </template>
  </div>
</template>
