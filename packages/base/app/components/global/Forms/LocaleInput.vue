<script setup lang="ts">
const arModel = defineModel<string>("ar", { default: "" });
const enModel = defineModel<string>("en", { default: "" });

const props = withDefaults(
  defineProps<{
    label: string;
    name: string;
    placeholder?: string;
    icon?: string;
    type?: "text";
    disabled?: boolean;
  }>(),
  {
    placeholder: "",
    icon: undefined,
    type: "text",
    disabled: false,
  },
);

const activeLang = ref<"ar" | "en">("ar");

const currentValue = computed({
  get: () => (activeLang.value === "ar" ? arModel.value : enModel.value),
  set: (val: string) => {
    if (activeLang.value === "ar") arModel.value = val;
    else enModel.value = val;
  },
});

const currentName = computed(() =>
  activeLang.value === "ar" ? `${props.name}Ar` : `${props.name}En`,
);
</script>

<template>
  <UFormField :name="currentName" :ui="fieldUi">
    <template #label>
      <div class="flex items-center justify-between flex-1 w-full gap-2">
        <span class="text-t-white text-base">{{ label }}</span>
        <div
          dir="ltr"
          class="flex rounded-lg overflow-hidden border border-default"
        >
          <button
            type="button"
            class="flex items-center gap-1 px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer"
            :class="
              activeLang === 'en'
                ? 'bg-primary text-white'
                : 'bg-bg-pages text-t-sec'
            "
            @click="activeLang = 'en'"
          >
            EN
            <span
              v-if="enModel"
              class="size-1.5 rounded-full bg-t-green inline-block"
            />
          </button>
          <button
            type="button"
            class="flex items-center gap-1 px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer"
            :class="
              activeLang === 'ar'
                ? 'bg-primary text-white'
                : 'bg-bg-pages text-t-sec'
            "
            @click="activeLang = 'ar'"
          >
            AR
            <span
              v-if="arModel"
              class="size-1.5 rounded-full bg-t-green inline-block"
            />
          </button>
        </div>
      </div>
    </template>

    <UInput
      v-model="currentValue"
      :type="type"
      :placeholder="placeholder"
      :icon="icon"
      :disabled="disabled"
      :dir="activeLang === 'ar' ? 'rtl' : 'ltr'"
      class="w-full"
      :ui="inputUi"
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
