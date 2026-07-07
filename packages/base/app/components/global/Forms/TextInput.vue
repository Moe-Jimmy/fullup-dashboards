<script setup lang="ts">
const model = defineModel<string | number>({ default: "" });

withDefaults(
  defineProps<{
    label: string;
    name: string;
    placeholder?: string;
    icon?: string;
    type?: "text" | "email" | "number" | "tel" | "url";
    disabled?: boolean;
  }>(),
  {
    placeholder: "",
    icon: undefined,
    type: "text",
    disabled: false,
  },
);
</script>

<template>
  <UFormField :label="label" :name="name" :ui="fieldUi">
    <UInput
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :icon="icon"
      :disabled="disabled"
      class="w-full"
      :ui="{
        ...inputUi,
        base: inputUi.base + (disabled ? ' opacity-60 cursor-not-allowed' : ''),
      }"
    />
  </UFormField>
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