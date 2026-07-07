<script setup lang="ts">
const props = defineProps<{
  label: string;
  fileName: string;
  fileUrl: string;
  fileType: "image" | "pdf";
}>();

const fileIcon = computed(() =>
  props.fileType === "pdf" ? "i-lucide-file-text" : "i-lucide-image",
);

const fileIconClass = computed(() =>
  props.fileType === "pdf"
    ? "bg-red-bg text-t-red"
    : "bg-purple-bg text-t-purple",
);
</script>

<template>
  <div
    class="flex items-center gap-3 border border-default rounded-xl p-2 pe-3"
  >
    <div
      class="shrink-0 size-9 rounded-lg flex items-center justify-center"
      :class="fileIconClass"
    >
      <UIcon :name="fileIcon" class="size-5" />
    </div>
    <div class="flex-1 flex flex-col min-w-0">
      <span class="text-t-sec text-xs mb-1 truncate">{{ label }}</span>
      <span class="text-t-white font-medium text-sm truncate">{{
        fileName
      }}</span>
    </div>

    <a
      :href="fileUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="shrink-0 size-9 rounded-lg border border-default flex items-center justify-center text-t-sec hover:text-primary hover:bg-primary/10 transition-colors"
      :aria-label="label"
    >
      <UIcon name="i-lucide-eye" class="size-4" />
    </a>
  </div>
</template>
