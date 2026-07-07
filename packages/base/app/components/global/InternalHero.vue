<template>
  <div class="container px-4 mx-auto py-20">
    <div
      class="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-4 items-center justify-between"
    >
      <div class="w-full flex flex-col gap-4">
        <h1 class="text-[28px] max-w-[500px] font-bold text-primary">
          {{ title }}
        </h1>
        <p class="text-t-white text-lg max-w-[600px]">{{ description }}</p>
        <div v-if="$slots.button" class="flex flex-col sm:flex-row gap-4 mt-4">
          <slot name="button"></slot>
        </div>
      </div>
      <div class="w-full relative">
        <!-- <div
          class="absolute inset-0 bg-linear-to-b from-[#0B0E11] to-[#0B0E11/0]"
        /> -->
        <img :src="image" alt="Hero" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
</script>
