<script setup lang="ts">
import type {
  BrandFormData,
  BrandFormMode,
  BrandType,
} from "~~/shared/types/brands";

definePageMeta({
  title: ["dashboard.pages.brands", "dashboard.pages.addNewBrand"],
});

const route = useRoute();
const localePath = useLocalePath();

const mode = computed<BrandFormMode>(() =>
  route.query.mode === "edit" ? "edit" : "add",
);

const type = computed<BrandType>(() =>
  route.query.type === "vehicle" ? "vehicle" : "product",
);

const brandId = computed(() =>
  route.query.id ? Number(route.query.id) : undefined,
);

// TODO: replace with real fetch by id when the API is wired.
function loadBrandForEdit(_id: number): {
  data: Partial<BrandFormData>;
  logo: string | null;
} {
  return {
    data: {
      nameAr: "شيل",
      nameEn: "Shell",
      descriptionAr: "علامة تجارية معتمدة من قبل",
      descriptionEn: "A previously approved brand",
      mainCategoryId: 1,
      subCategoryId: 1,
      status: true,
    },
    logo: null,
  };
}

const loaded = computed(() =>
  mode.value === "edit" && brandId.value
    ? loadBrandForEdit(brandId.value)
    : undefined,
);

function onSubmit(data: BrandFormData) {
  // TODO: POST/PUT /brands
  console.log(`${mode.value} brand (${type.value}):`, data);
  navigateTo(localePath("/fullup_brands"));
}
</script>

<template>
  <BrandsForm
    :mode="mode"
    :type="type"
    :initial="loaded?.data"
    :initial-logo="loaded?.logo"
    @submit="onSubmit"
  />
</template>
