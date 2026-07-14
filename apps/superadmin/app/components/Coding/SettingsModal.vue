<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { CodingSettingsFormData } from "~~/shared/types/coding";

const open = defineModel<boolean>("open", { default: false });

const props = withDefaults(
  defineProps<{
    settings?: CodingSettingsFormData | null;
  }>(),
  { settings: null },
);

const emit = defineEmits<{ submit: [data: CodingSettingsFormData] }>();

const { t } = useI18n();

// Order mirrors the settings modal in Figma.
const codeFields = [
  "serviceProviders",
  "delegates",
  "individuals",
  "companies",
  "diplomatic",
  "government",
  "exhibitions",
] as const;

const state = reactive<CodingSettingsFormData>({
  serviceProviders: "",
  delegates: "",
  individuals: "",
  companies: "",
  diplomatic: "",
  government: "",
  exhibitions: "",
});

// Prefill whenever the modal opens.
watch(
  open,
  (isOpen) => {
    if (!isOpen) return;
    for (const key of codeFields) {
      state[key] = props.settings?.[key] ?? "";
    }
  },
  { immediate: true },
);

const schema = computed(() => {
  const req = t("addCountry.validation.required");
  return z.object(
    Object.fromEntries(
      codeFields.map((key) => [key, z.string().min(1, req)]),
    ),
  );
});

function onSubmit(event: FormSubmitEvent<CodingSettingsFormData>) {
  emit("submit", event.data);
  open.value = false;
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      content:
        'bg-bg-landingpage ring-0 border border-default rounded-2xl p-6 max-w-[520px] w-full mx-auto',
      overlay: 'bg-black/60 backdrop-blur-sm',
      
    }"
  >
    <template #content>
      <div class="flex items-center justify-between mb-6 pb-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-pencil" class="text-primary size-5" />
          <h3 class="text-t-sec font-bold text-base">
            {{ $t("coding.settings.title") }}
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

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6 overflow-y-auto pe-4"
        @submit="onSubmit"
      >
        <FormsTextInput
          v-for="key in codeFields"
          :key="key"
          v-model="state[key]"
          :label="$t(`coding.settings.fields.${key}`)"
          :name="key"
          
        />

        <UButton
          type="submit"
          class="gradient-btn"
        >
          {{ $t("coding.settings.save") }}
        </UButton>
      </UForm>
    </template>
  </UModal>
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
