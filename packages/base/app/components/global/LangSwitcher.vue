<script lang="ts" setup>
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});
</script>

<template>
  <div class="flex gap-2">
    <NuxtLink
      v-for="localeOption in availableLocales"
      :key="localeOption.code"
      :to="switchLocalePath(localeOption.code)"
      class="w-[40px] h-[40px] flex items-center justify-center border-[0.3px]! rounded-md border-t-placeholder text-t-white cursor-pointer hover:bg-surface-dark hover:text-t-brand"
    >
      {{ localeOption.name || localeOption.code.toUpperCase() }}
    </NuxtLink>
  </div>
</template>
