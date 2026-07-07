<template>
  <div
    class="flex flex-col gap-6 mb-12 items-center text-center"
    :class="{
      'lg:items-start lg:text-start': !isCenter,
    }"
  >
    <h2
      class="text-t-white bg-surface-dark py-2 px-4 rounded-full border-[0.2px] border-t-placeholder"
    >
      {{ title }}
    </h2>
    <h3 class="text-t-brand font-bold text-2xl sm:text-[34px]">
      {{ subtitle }}
    </h3>
  </div>
</template>
<script setup lang="ts">
defineProps({
  isCenter: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
});
</script>
