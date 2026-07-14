<script setup lang="ts">
definePageMeta({
  title: "dashboard.pages.coding",
});

const { t } = useI18n();

const activeTab = ref("branches");

// Labels only — no counts (per design).
const filterTabs = computed(() => [
  { label: t("coding.tabs.branches"), value: "branches" },
  { label: t("coding.tabs.orders"), value: "orders" },
]);
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Filter tabs -->
    <FilterTabs
      v-model="activeTab"
      :title="$t('coding.count.title')"
      icon="i-lucide-hash"
      :items="filterTabs"
    />

    <!-- Tab 1: branches coding -->
    <CodingBranchesCoding v-if="activeTab === 'branches'" />

    <!-- Tab 2: orders coding (placeholder) -->
    <div
      v-else
      class="bg-bg-landingpage rounded-2xl p-4 border border-default flex items-center justify-center min-h-80 text-t-sec text-sm"
    >
      {{ $t("coding.ordersPlaceholder") }}
    </div>
  </div>
</template>
