<script setup lang="ts">
const model = defineModel<string>({ default: "" });

withDefaults(
  defineProps<{
    label: string;
    name: string;
    placeholder?: string;
    icon?: string;
  }>(),
  {
    placeholder: "",
    icon: "i-lets-icons:lock-light",
  },
);

const show = ref(false);
</script>

<template>
  <UFormField :label="label" :name="name" :ui="fieldUi">
    <UInput
      v-model="model"
      :placeholder="placeholder"
      :icon="icon"
      :type="show ? 'text' : 'password'"
      class="w-full"
      :ui="inputUi"
    >
      <template #trailing>
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          :aria-label="show ? 'Hide password' : 'Show password'"
          :aria-pressed="show"
          @click="show = !show"
        />
      </template>
    </UInput>
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