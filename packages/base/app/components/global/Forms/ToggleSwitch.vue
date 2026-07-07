<script setup lang="ts">
const model = defineModel<boolean>({ default: false });

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    boxed?: boolean;
  }>(),
  {
    title: "",
    description: "",
    boxed: true,
  },
);
</script>

<template>
  <div
    v-if="boxed"
    class="border border-t-placeholder rounded-xl p-5 flex items-center justify-between gap-4"
  >
    <div v-if="title || description" class="flex-1">
      <p v-if="title" class="text-t-white font-medium">{{ title }}</p>
      <p v-if="description" class="text-t-white opacity-60 text-sm mt-1">
        {{ description }}
      </p>
    </div>
    <USwitch
      v-model="model"
      class="donut-thumb-switch"
      :ui="{ thumb: 'bg-white', base: 'py-0.25!' }"
    />
  </div>

  <USwitch
    v-else
    v-model="model"
    class="donut-thumb-switch"
    :ui="{ thumb: 'bg-white', base: 'py-0.25!' }"
  />
</template>

<style scoped>
:deep(.donut-thumb-switch span[data-slot="thumb"])::after {
  content: "";
  display: block;
  width: 6px;
  height: 6px;
  background-color: var(--color-primary);
  border-radius: 50%;
}
</style>