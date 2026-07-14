<script setup lang="ts">
import type { Brand } from "~~/shared/types/brands";

definePageMeta({
  title: "dashboard.pages.brands",
});

const { t } = useI18n();

const desc =
  "وصف العلامة وصف العلامة وصف العلامة وصف العلامة وصف العلامة وصف العلامة";

// TODO: replace mock with real fetch when the API is wired.
const brands = reactive<Brand[]>([
  { id: 1, nameAr: "تويوتا", nameEn: "Toyota", descriptionAr: desc, descriptionEn: "Brand description brand description", logo: null, type: "product", category: "الزيوت", status: true },
  { id: 2, nameAr: "شيل", nameEn: "Shell", descriptionAr: desc, descriptionEn: "Brand description brand description", logo: null, type: "product", category: "الزيوت", status: true },
  { id: 3, nameAr: "موبيل", nameEn: "Mobil", descriptionAr: desc, descriptionEn: "Brand description brand description", logo: null, type: "product", category: "البطاريات", status: false },
  { id: 4, nameAr: "بوش", nameEn: "Bosch", descriptionAr: desc, descriptionEn: "Brand description brand description", logo: null, type: "product", category: "البطاريات", status: true },
  { id: 5, nameAr: "بريجستون", nameEn: "Bridgestone", descriptionAr: desc, descriptionEn: "Brand description brand description", logo: null, type: "product", category: "الاطارات", status: true },
  { id: 6, nameAr: "ميشلان", nameEn: "Michelin", descriptionAr: desc, descriptionEn: "Brand description brand description", logo: null, type: "product", category: "الاطارات", status: true },
  { id: 7, nameAr: "مرسيدس", nameEn: "Mercedes", descriptionAr: desc, descriptionEn: "Brand description brand description", logo: null, type: "vehicle", category: "", status: true },
  { id: 8, nameAr: "بي ام دبليو", nameEn: "BMW", descriptionAr: desc, descriptionEn: "Brand description brand description", logo: null, type: "vehicle", category: "", status: false },
]);

const activeTab = ref("all");

const tabKeys = ["all", "polishing", "washing", "batteries", "tires", "oils", "fuel", "vehicles"] as const;

function matchesTab(brand: Brand, key: string) {
  if (key === "all") return true;
  if (key === "vehicles") return brand.type === "vehicle";
  return brand.type === "product" && brand.category === t(`brands.tabs.${key}`);
}

const filterTabs = computed(() =>
  tabKeys.map((key) => ({
    label: t(`brands.tabs.${key}`),
    value: key,
    count: brands.filter((b) => matchesTab(b, key)).length,
  })),
);

const filteredBrands = computed(() =>
  brands.filter((b) => matchesTab(b, activeTab.value)),
);

function onToggleStatus(id: number, value: boolean) {
  const brand = brands.find((b) => b.id === id);
  if (brand) brand.status = value; // TODO: PATCH /brands/{id}
}
</script>

<template>
  <div class="space-y-6 p-6">
    <FilterTabs
      v-model="activeTab"
      :title="$t('brands.title')"
      icon="i-lucide-bandage"
      :items="filterTabs"
    />

    <BrandsList :brands="filteredBrands" @toggle-status="onToggleStatus" />
  </div>
</template>
