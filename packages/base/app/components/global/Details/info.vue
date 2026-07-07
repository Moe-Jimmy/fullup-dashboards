<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  icon: string;
}>();
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="shrink-0 size-10 rounded-xl border border-default flex items-center justify-center text-t-sec"
    >
      <UIcon :name="icon" class="size-5" />
    </div>
    <div class="flex-1 flex flex-col min-w-0">
      <span class="text-t-placeholder text-xs mb-1 truncate">{{ label }}</span>
      <span class="text-t-white font-semibold text-sm truncate">{{
        value
      }}</span>
    </div>
  </div>
</template>
