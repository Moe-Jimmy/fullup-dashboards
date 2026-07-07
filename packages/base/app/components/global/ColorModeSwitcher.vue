<script lang="ts" setup>
const colorMode = useColorMode();
const { t } = useI18n();
const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === "light" ? "dark" : "light";
};
const currentModeKey = computed(() => {
  return colorMode.preference === "light"
    ? "common.switchToDarkMode"
    : "common.switchToLightMode";
});
</script>
<template>
  <UTooltip arrow :delay-duration="0" :text="t(currentModeKey)">
    <UButton
      class="w-[40px] h-[40px] flex items-center justify-center border-[0.3px]! border-t-placeholder text-t-white cursor-pointer hover:bg-surface-dark hover:text-t-brand"
      variant="link"
      size="md"
      @click="toggleColorMode"
    >
      <UIcon
        :name="
          colorMode.preference === 'light'
            ? 'heroicons-solid:moon'
            : 'heroicons-solid:sun'
        "
        size="1.25rem"
      />
    </UButton>
  </UTooltip>
</template>
