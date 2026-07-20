<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { SelectOption } from "~~/shared/types/countries";

const props = withDefaults(
  defineProps<{
    mode?: BrandFormMode;
    type?: BrandType;
    initial?: Partial<BrandFormData> | null;
    initialLogo?: string | null;
  }>(),
  { mode: "add", type: "product", initial: null, initialLogo: null },
);

const emit = defineEmits<{ submit: [data: BrandFormData] }>();

const { t } = useI18n();

const isProduct = computed(() => props.type === "product");
const isEdit = computed(() => props.mode === "edit");

// TODO: replace with real categories when the API is wired.
const mainCategories: SelectOption[] = [
  { id: 1, label: "زيوت وفلاتر", value: 1 },
  { id: 2, label: "بطاريات", value: 2 },
  { id: 3, label: "اطارات", value: 3 },
];
const subCategories: SelectOption[] = [
  { id: 1, label: "زيت شيل", value: 1 },
  { id: 2, label: "زيت موبيل", value: 2 },
];

const state = reactive<BrandFormData>({
  nameAr: props.initial?.nameAr ?? "",
  nameEn: props.initial?.nameEn ?? "",
  descriptionAr: props.initial?.descriptionAr ?? "",
  descriptionEn: props.initial?.descriptionEn ?? "",
  logo: null,
  mainCategoryId: props.initial?.mainCategoryId ?? null,
  subCategoryId: props.initial?.subCategoryId ?? null,
  status: props.initial?.status ?? false,
});

watch(
  () => props.initial,
  (v) => {
    if (!v) return;
    Object.assign(state, {
      nameAr: v.nameAr ?? "",
      nameEn: v.nameEn ?? "",
      descriptionAr: v.descriptionAr ?? "",
      descriptionEn: v.descriptionEn ?? "",
      mainCategoryId: v.mainCategoryId ?? null,
      subCategoryId: v.subCategoryId ?? null,
      status: v.status ?? false,
    });
  },
  { immediate: true },
);

const logo = useCroppableImage(() => props.initialLogo);
watch(logo.file, (file) => {
  state.logo = file;
});

const title = computed(() => {
  if (isEdit.value) return t("brands.form.editTitle");
  return isProduct.value
    ? t("brands.form.addProductTitle")
    : t("brands.form.addVehicleTitle");
});

const schema = computed(() => {
  const req = t("addCountry.validation.required");
  const base: Record<string, z.ZodTypeAny> = {
    nameAr: z.string().min(1, req),
  };
  if (isProduct.value) {
    base.mainCategoryId = z.number({ message: req }).int().positive(req);
  }
  return z.object(base);
});

function onSubmit(event: FormSubmitEvent<Record<string, unknown>>) {
  emit("submit", { ...state, ...event.data } as BrandFormData);
}
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="bg-bg-landingpage rounded-2xl p-6 border border-default">
      <!-- Header: title (right) + back (left) -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-circle-plus" class="text-primary size-5" />
          <h2 class="text-t-sec font-bold text-base">{{ title }}</h2>
        </div>
        <NuxtLinkLocale to="/fullup_brands" class="back-btn">
          <UIcon name="i-lucide-arrow-right" class="size-5 rtl:rotate-180" />
        </NuxtLinkLocale>
      </div>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <!-- Logo -->
        <div class="flex flex-col gap-3">
          <label class="text-t-white text-sm">
            {{ $t("brands.form.logoLabel") }}
          </label>

          <div
            v-if="logo.preview.value"
            class="rounded-lg border-[0.3px]   max-w-sm  border-t-placeholder p-4 flex flex-col items-center gap-3"
          >
            <img
              :src="logo.preview.value"
              alt=""
              class=" h-full max-w-full object-cover"
            >
            <div class="flex items-center  gap-2 self-end">
             
              <button
                type="button"
                class="size-9 rounded-lg bg-purple-bg text-t-purple flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                @click="logo.cropOpen.value = true"
              >
                <UIcon name="i-lucide-crop" class="size-4" />
              </button>
               <button
                type="button"
                class="size-9 rounded-lg bg-red-bg text-t-red flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                @click="logo.clear"
              >
                <UIcon name="i-lucide-trash-2" class="size-4" />
              </button>
            </div>
          </div>

          <div v-else class=" max-w-sm  flex flex-col gap-2">
            <FormsFileUpload
            v-model="logo.sourceFile.value"
            name="logo"
            :label="''"
            accept="image/svg+xml,image/png,image/gif"
            file-icon="i-lucide-cloud-upload"
            :description="$t('brands.form.logoHint')"
            input-class="h-64"
          />
          <p class="text-t-placeholder text-xs text-center">
            {{ $t("brands.form.logoFormats") }}
          </p>
          </div>
        </div>

        <!-- Product: name + categories row. Vehicle: name only. -->
        <div
          :class="
            isProduct
              ? 'grid grid-cols-1 md:grid-cols-3 gap-6'
              : 'grid grid-cols-1'
          "
        >
          <FormsLocaleInput
            v-model:ar="state.nameAr"
            v-model:en="state.nameEn"
            :label="$t('brands.form.nameLabel')"
            name="name"
            :placeholder="$t('brands.form.namePlaceholder')"
          />
          <template v-if="isProduct">
            <FormsSelectInput
              v-model="state.mainCategoryId"
              :label="$t('brands.form.mainCategory')"
              name="mainCategoryId"
              :items="mainCategories"
              :placeholder="$t('brands.form.categoryPlaceholder')"
            />
            <FormsSelectInput
              v-model="state.subCategoryId"
              :label="$t('brands.form.subCategory')"
              name="subCategoryId"
              :items="subCategories"
              :placeholder="$t('brands.form.categoryPlaceholder')"
            />
          </template>
        </div>

        <!-- Description -->
        <FormsLocaleInput
          v-model:ar="state.descriptionAr"
          v-model:en="state.descriptionEn"
          :label="$t('brands.form.descLabel')"
          name="description"
          :placeholder="$t('brands.form.descPlaceholder')"
          multiline
          :rows="4"
        />

        <!-- Status -->
        <div
          class="rounded-lg bg-surface-dark  p-5 flex items-center justify-between gap-4"
        >
        <div class="flex flex-col  gap-1">
          <p class="text-t-white font-bold text-base">
            {{ $t("brands.form.statusTitle") }}
          </p>
          <p class="text-t-sec text-sm">{{ $t("brands.form.statusHint") }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-t-sec text-sm">
            {{
              state.status
              ? $t("brands.form.active")
              : $t("brands.form.inactive")
            }}
          </span>
          <FormsToggleSwitch v-model="state.status" :boxed="false" />
        </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="submit" class="gradient-btn">
            {{ isEdit ? $t("brands.form.save") : $t("brands.form.submitAdd") }}
          </button>
          <NuxtLinkLocale
            v-if="isEdit"
            to="/fullup_brands"
            class="h-12 px-8 flex items-center rounded-lg border border-t-sec text-t-sec font-medium text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {{ $t("brands.form.cancel") }}
          </NuxtLinkLocale>
        </div>
      </UForm>
    </div>

    <FormsImageCropModal
      v-model:open="logo.cropOpen.value"
      v-model:crop="logo.cropState.value"
      :src="logo.cropSource.value"
      :title="$t('brands.form.cropTitle')"
      @cropped="logo.onCropped"
    />
  </div>
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
