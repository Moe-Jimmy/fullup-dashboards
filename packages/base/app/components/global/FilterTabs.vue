<script setup lang="ts">
export interface FilterTabItem {
  label: string;
  value: string;
  count?: number;
}

withDefaults(
  defineProps<{
    title?: string;
    icon?: string;
    items: FilterTabItem[];
  }>(),
  {
    title: "",
    icon: "",
  },
);

const model = defineModel<string>({ required: true });
</script>

<template>
  <div class="bg-bg-landingpage rounded-2xl p-4 border border-default">
    <div v-if="title" class="flex items-center gap-2 mb-5">
      <UIcon v-if="icon" :name="icon" class="text-t-sec size-5" />
      <h3 class="text-t-white font-semibold text-base">{{ title }}</h3>
    </div>

    <div class="flex gap-3 overflow-x-auto  scrollbar-hide">
      <button
        v-for="tab in items"
        :key="tab.value"
        class="flex-1 py-4 min-w-28 rounded-xl min-h-[75px] items-center text-center transition-all duration-300 cursor-pointer"
        :class="
          model === tab.value
            ? 'bg-brand-bg text-t-brand border border-primary'
            : 'bg-bg-pages text-t-sec hover:bg-brand-bg/10 border-[0.3px] border-t-placeholder '
        "
        @click="model = tab.value"
      >
        <p class="font-medium ">{{ tab.label }}</p>
        <p v-if="tab.count !== undefined" class="text-xl font-bold mt-1">
          ({{ tab.count.toLocaleString() }})
        </p>
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

