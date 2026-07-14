<script setup lang="ts">
// STUB: a real image cropper needs a cropper library (none installed yet).
// This shell wires the crop action; the cropping UI is a TODO.
const open = defineModel<boolean>("open", { default: false });

defineProps<{ src?: string | null }>();
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      content:
        'bg-bg-landingpage ring-0 border border-default rounded-2xl p-6 max-w-[680px] w-full mx-auto',
      overlay: 'bg-black/60 backdrop-blur-sm',
    }"
  >
    <template #content>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <h3 class="text-t-sec font-bold text-base">
            {{ $t("brands.form.cropTitle") }}
          </h3>
        </div>
        <button
          type="button"
          class="size-9 rounded-full flex items-center justify-center text-t-primary-gray hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          @click="open = false"
        >
          <UIcon name="i-lucide-x" class="size-5" />
        </button>
      </div>

      <!-- TODO: replace with a real cropper (zoom/drag) once a lib is chosen. -->
      <div
        class="rounded-lg bg-bg-icon-gray flex items-center justify-center overflow-hidden min-h-[300px] p-4"
      >
        <img
          v-if="src"
          :src="src"
          alt=""
          class="max-h-[280px] max-w-full object-contain"
        >
      </div>

      <div class="flex items-center gap-3 pt-6">
        <button
          type="button"
          class="gradient-btn flex-1"
          @click="open = false"
        >
          {{ $t("brands.form.save") }}
        </button>
        <button
          type="button"
          class="flex-1 h-12 rounded-lg border border-t-sec text-t-sec font-medium text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          @click="open = false"
        >
          {{ $t("brands.form.cancel") }}
        </button>
      </div>
    </template>
  </UModal>
</template>
