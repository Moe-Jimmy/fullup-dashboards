<script setup lang="ts">
const route = useRoute();
const { t, te } = useI18n();

const pageTitle = computed(() => {
  const key = route.meta.title as string | string[] | undefined;
  if (!key) return "";
  if (Array.isArray(key)) {
    return key.map((k) => (te(k) ? t(k) : k)).join(" / ");
  }
  return te(key) ? t(key) : key;
});
</script>

<template>
  <UDashboardNavbar :title="pageTitle" class="bg-surface-dark">
    <template #leading>
      <UDashboardSidebarCollapse
        :ui="{
          base: 'rtl:rotate-180',
        }"
      />
    </template>

    <template #title>
      <div class="flex items-center gap-4">
        <span class="text-base font-semibold text-t-white truncate">
          {{ pageTitle }}
        </span>
        <UInput
          :placeholder="$t('dashboard.searchPlaceholder')"
          icon="i-heroicons-magnifying-glass"
          color="neutral"
          size="md"
          class="hidden md:block w-72"
          :ui="{
            base: 'h-10 bg-transparent rounded-full placeholder:text-t-placeholder border-t-placeholder',
            leadingIcon: 'size-4 text-t-placeholder',
          }"
        />
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-2">
        <LangSwitcher />
        <ColorModeSwitcher />
        <UButton
          icon="i-heroicons-bell"
          color="neutral"
          variant="link"
          class="w-[40px] h-[40px] flex items-center justify-center border-[0.3px]! rounded-md border-t-placeholder text-t-white cursor-pointer hover:bg-surface-dark hover:text-t-brand"
          square
          :aria-label="$t('dashboard.notifications')"
        />
      </div>
    </template>
  </UDashboardNavbar>
</template>
