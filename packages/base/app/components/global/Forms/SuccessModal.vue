<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false });

withDefaults(
  defineProps<{
    title: string;
    description: string;
    link?: string | null;
    buttonText: string;
  }>(),
  {
    link: null,
  },
);

function close() {
  open.value = false;
}
</script>

<template>
  <UModal
    v-model:open="open"
    :close="false"
    :ui="{
      content:
        'bg-bg-landingpage divide-y-0 ring-0 border-0 shadow-[0px_0px_60px_0px_#D5451F33] border-0 rounded-2xl p-7 max-w-[400px] w-full mx-auto flex flex-col items-center gap-4 text-center',
      overlay: 'bg-black/60 backdrop-blur-sm',
    }"
  >
    <template #content>
      <h3 class="text-primary text-lg font-extrabold max-w-[320px]">
        {{ title }}
      </h3>

      <p class="text-t-white leading-relaxed max-w-[320px]">
        {{ description }}
      </p>

      <NuxtLinkLocale
        v-if="link"
        :to="link"
        class="outline-btn w-full justify-center mt-2"
        @click="close"
      >
        {{ buttonText }}
      </NuxtLinkLocale>

      <button
        v-else
        class="outline-btn w-full justify-center mt-2 max-w-[320px]"
        @click="close"
      >
        {{ buttonText }}
      </button>
    </template>
  </UModal>
</template>
