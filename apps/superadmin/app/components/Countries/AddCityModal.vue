<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { City, CityFormData, SelectOption } from "~~/shared/types/countries";

const open = defineModel<boolean>("open", { default: false });

const props = withDefaults(
  defineProps<{
    mode?: "add" | "edit";
    countries: SelectOption[];
    countryId?: number | null;
    lockCountry?: boolean;
    city?: City | null;
  }>(),
  { mode: "add", countryId: null, lockCountry: false, city: null },
);

const emit = defineEmits<{ submit: [data: CityFormData & { id?: number }] }>();

const { t } = useI18n();

const state = reactive<{
  code: string;
  countryId: number | undefined;
  nameAr: string;
  nameEn: string;
}>({
  code: "",
  countryId: undefined,
  nameAr: "",
  nameEn: "",
});

// Reset / prefill whenever the modal opens (add vs edit, preset country).
watch(
  open,
  (isOpen) => {
    if (!isOpen) return;
    state.code = props.city?.code ?? "";
    state.nameAr = props.city?.nameAr ?? "";
    state.nameEn = props.city?.nameEn ?? "";
    state.countryId = props.city?.countryId ?? props.countryId ?? undefined;
  },
  { immediate: true },
);

const schema = computed(() => {
  const req = t("addCountry.validation.required");
  return z.object({
    code: z.string().min(1, req),
    countryId: z
      .number({ message: req })
      .int()
      .positive(req),
    nameAr: z.string().min(1, req),
    nameEn: z.string().min(1, req),
  });
});

function onSubmit(event: FormSubmitEvent<CityFormData>) {
  emit("submit", { ...event.data, id: props.city?.id });
  open.value = false;
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      content:
        'bg-bg-landingpage ring-0 border border-default rounded-2xl p-5 max-w-[520px] w-full mx-auto',
      overlay: 'bg-black/60 backdrop-blur-sm',
    }"
  >
    <template #content>
      <div class="flex items-center justify-end gap-2 mb-5">
        <h3 class="text-t-primary-gray font-semibold text-base">
          {{
            mode === "edit"
              ? $t("addCity.updateTitle")
              : $t("addCity.title")
          }}
        </h3>
        <UIcon name="i-lucide-map-pin-plus" class="text-primary size-5" />
      </div>

      <UForm
        :schema="schema"
        :state="state"
        :validate-on="['input', 'change']"
        class="space-y-5"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormsSelectInput
            v-model="state.countryId"
            :label="$t('addCity.fields.country')"
            name="countryId"
            :items="countries"
            :placeholder="$t('addCity.placeholders.country')"
            :disabled="lockCountry"
            searchable
          />
          <FormsTextInput
            v-model="state.code"
            :label="$t('addCity.fields.code')"
            name="code"
            :placeholder="$t('addCity.placeholders.code')"
          />
        
        </div>

        <FormsTextInput
          v-model="state.nameAr"
          :label="$t('addCity.fields.nameAr')"
          name="nameAr"
          :placeholder="$t('addCity.placeholders.nameAr')"
        />
        <FormsTextInput
          v-model="state.nameEn"
          :label="$t('addCity.fields.nameEn')"
          name="nameEn"
          :placeholder="$t('addCity.placeholders.nameEn')"
        />

        <div class="flex items-stretch gap-3 pt-2">
          <button
            type="button"
            class="flex-1 h-12 rounded-lg border border-t-sec text-t-sec font-medium text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            @click="open = false"
          >
            {{ $t("addCity.cancel") }}
          </button>
          <button
            type="submit"
            class="flex-1 h-12 rounded-lg bg-primary text-white font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity"
          >
            {{
              mode === "edit"
                ? $t("addCity.update")
                : $t("addCity.submit")
            }}
          </button>
        </div>
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