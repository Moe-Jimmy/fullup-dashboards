<script setup lang="ts">
import { vMaska } from "maska/vue";

const model = defineModel<string>({ default: "" });
const dialCode = defineModel<string>("dialCode", { default: "+966" });
const valid = defineModel<boolean>("valid", { default: false });

const { locale } = useI18n();

const countryCode = ref(
  countriesData.find((c) => c.dialCode === dialCode.value)?.code || "sa",
);

const country = computed(() =>
  countriesData.find((c) => c.code === countryCode.value),
);
const currentDialCode = computed(() => country.value?.dialCode || "+966");
const currentMask = computed(() => country.value?.phoneMask || "## ### ####");
const currentExample = computed(
  () => country.value?.phoneExample || "51 234 5678",
);
const currentRegex = computed(
  () => new RegExp(country.value?.phoneRegex || "^5\\d{8}$"),
);

watchEffect(() => {
  const rawDigits = (model.value || "").replace(/\D/g, "");
  valid.value = currentRegex.value.test(rawDigits);
});

watch(countryCode, async () => {
  model.value = "";
  dialCode.value = currentDialCode.value;
});
</script>

<template>
  <UFieldGroup
    ref="containerRef"
    :ui="{
      base: 'w-full',
    }"
  >
    <FormsFieldDetach>
      <USelectMenu
        v-model="countryCode"
        :items="countriesData"
        value-key="code"
        :search-input="{
        placeholder: locale === 'ar' ? 'ابحث عن دولة...' : 'Search country...',
        leadingIcon: 'i-lucide-search',
        ui: {
          leadingIcon: 'text-t-white size-4',
          base: 'ps-8',
        },
      }"
      :filter-fields="['nameEn', 'nameAr', 'code', 'dialCode']"
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
      trailing-icon="i-lucide-chevron-down"
      :content="{
        align: 'start',
      }"
      :ui="{
        base: 'cursor-pointer rounded-xl text-t-white bg-transparent',
        trailingIcon: 'size-4',
        content:
          'w-[278px] sm:w-[558px] md:w-[313px] lg:w-[395px] bg-bg-landingpage',
        item: 'data-highlighted:not-data-disabled:before:bg-primary/20',
        placeholder: 'text-t-placeholder',
      }"
    >
      <template #default>
        <span class="flex items-center gap-1.5">
          <span :class="['fi', `fi-${countryCode}`]" class="rounded-sm ms-2" />
          <span class="text-t-white text-sm">{{ currentDialCode }}</span>
        </span>
      </template>

      <template #item-leading="{ item }">
        <span :class="['fi', `fi-${item.code}`]" class="rounded-sm" />
      </template>

      <template #item-label="{ item }">
        {{ locale === "ar" ? item.nameAr : item.nameEn }} ({{ item.dialCode }})
      </template>
      </USelectMenu>
    </FormsFieldDetach>

    <UInput
      v-model="model"
      v-maska="currentMask"
      :placeholder="currentExample"
      class="w-full"
      style="unicode-bidi: plaintext"
      :ui="{
        base: 'w-full h-[52px] ps-4  rounded-xl placeholder:text-sm placeholder:text-t-placeholder text-t-white bg-transparent',
        leading: 'ps-4',
        leadingIcon: 'text-t-white',
      }"
    />
  </UFieldGroup>
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
