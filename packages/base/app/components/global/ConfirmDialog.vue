<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false });

withDefaults(
  defineProps<{
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    icon?: string;
    loading?: boolean;
  }>(),
  {
    icon: "i-lucide-trash-2",
    loading: false,
  },
);

const emit = defineEmits<{ confirm: [] }>();

function cancel() {
  open.value = false;
}

function confirm() {
  emit("confirm");
}
</script>

<template>
  <UModal
    v-model:open="open"
    :close="false"
    :ui="{
      content:
        'bg-bg-landingpage divide-y-0 ring-0 border-0 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)] rounded-2xl p-6 max-w-[440px] w-full mx-auto flex flex-col items-center gap-8',
      overlay: 'bg-black/60 backdrop-blur-sm',
    }"
  >
    <template #content>
      <div class="flex flex-col items-center gap-5 w-full">
        <div
          class="size-12 rounded-full bg-red-bg flex items-center justify-center"
        >
          <UIcon :name="icon" class="size-6 text-t-red" />
        </div>

        <div class="flex flex-col items-center gap-2 text-center w-full">
          <h3 class="text-t-primary-gray font-bold text-base">
            {{ title }}
          </h3>
          <p class="text-t-sec text-sm leading-relaxed whitespace-pre-line">
            {{ message }}
          </p>
        </div>
      </div>

      <div class="flex items-stretch rtl:flex-row-reverse gap-3 w-full">
        <button
          type="button"
          class="flex-1 h-12 rounded-lg border border-t-placeholder text-t-primary-gray font-medium text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          @click="cancel"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          :disabled="loading"
          class="flex-1 h-12 rounded-lg bg-t-red text-white font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="confirm"
        >
          <UIcon
            v-if="loading"
            name="i-lucide-loader-2"
            class="size-4 animate-spin"
          />
          {{ confirmLabel }}
        </button>
      </div>
    </template>
  </UModal>
</template>