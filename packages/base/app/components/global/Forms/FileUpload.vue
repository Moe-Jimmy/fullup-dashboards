<script setup lang="ts">
const model = defineModel<File | File[] | null>({ default: null });

const { locale } = useI18n();
const l = (ar: string, en: string) => (locale.value === "ar" ? ar : en);

const props = withDefaults(
  defineProps<{
    label: string;
    name: string;
    accept?: string;
    fileIcon?: string;
    description?: string;
    optional?: boolean;
    multiple?: boolean;
  }>(),
  {
    accept: undefined,
    fileIcon: "i-codicon:file-pdf",
    description: "",
    optional: false,
    multiple: false,
  },
);

const computedDescription = computed(
  () =>
    props.description ||
    l("اسحب الملف هنا أو اضغط للاختيار", "Drag file here or click to select"),
);
</script>

<template>
  <UFormField
    :label="label"
    :name="name"
    :ui="{
      label: 'text-t-white mb-2 text-sm',
      container: 'mt-1 relative',
    }"
  >
    <UFileUpload
      v-model="model"
      :accept="accept"
      :multiple="multiple"
      :file-icon="fileIcon"
      size="xl"
      :description="computedDescription"
      :ui="{
        base: 'w-full rounded-xl border border-dashed border-t-sec p-6 flex flex-col items-center justify-center gap-2 bg-transparent hover:border-primary transition-colors cursor-pointer',
        description: 'text-t-sec text-xs',
      }"
    />
    <p v-if="optional" class="text-t-placeholder text-xs mt-1">
      {{ l("اختياري", "Optional") }}
    </p>
  </UFormField>
</template>

<style scoped>
:deep([data-slot="error"]) {
  position: static;
  margin-top: 4px;
  font-size: 0.75rem;
  color: var(--color-t-red);
}
</style>