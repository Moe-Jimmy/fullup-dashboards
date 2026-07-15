<script setup lang="ts">
import type { Brand } from "~~/shared/types/brands";

const props = defineProps<{ brand: Brand }>();

const emit = defineEmits<{ "update:status": [value: boolean] }>();

const { locale } = useI18n();
const localePath = useLocalePath();

const brandName = computed(() =>
  locale.value === "ar" ? props.brand.nameAr : props.brand.nameEn,
);
const brandDescription = computed(() =>
  locale.value === "ar" ? props.brand.descriptionAr : props.brand.descriptionEn,
);

const status = computed({
  get: () => props.brand.status,
  set: (v: boolean) => emit("update:status", v),
});

const editLink = computed(() =>
  localePath(
    `/fullup_brands/add_new_brand?mode=edit&id=${props.brand.id}&type=${props.brand.type}`,
  ),
);
</script>

<template>
  <div
    class="bg-bg-landingpage border-[0.3px] border-t-placeholder rounded-lg p-4 flex flex-col gap-3"
  >
    <!-- Top: logo (right) + status toggle (left) -->
    <div class="flex items-center justify-between border-b-[0.3px] border-t-placeholder pb-4">
      <div
        class="h-14 min-w-[71px] rounded-lg  flex items-center justify-center overflow-hidden px-2"
      >
        <img
          v-if="brand.logo"
          :src="brand.logo"
          :alt="brandName"
          class="max-h-full max-w-full object-contain"
        >
        <SvgBrandLogo v-else />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-t-sec text-sm">
          {{ status ? $t("brands.card.active") : $t("brands.card.inactive") }}
        </span>
        <FormsToggleSwitch v-model="status" :boxed="false" />
      </div>
    </div>

    <!-- Name + description -->
    <div class="flex flex-col gap-2 flex-1">
      <p class="text-t-white font-extrabold text-lg text-right">{{ brandName }}</p>
      <p class="text-t-sec text-sm text-right line-clamp-3">
        {{ brandDescription }}
      </p>
    </div>

    <!-- Footer: main category (right) + edit (left) -->
    <div class="flex items-end justify-between">
      
      <div v-if="brand.category" class="flex flex-col  gap-1">
        <span class="text-t-sec text-xs">{{ $t("brands.card.mainCategory") }}</span>
        <span class="text-t-primary-gray font-bold text-base">{{ brand.category }}</span>
      </div>
      <NuxtLinkLocale
        :to="editLink"
        class="size-[38px] rounded-lg bg-purple-bg flex items-center justify-center text-t-purple hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <UIcon name="i-lucide-pencil" class="size-4" />
      </NuxtLinkLocale>
    </div>
  </div>
</template>
