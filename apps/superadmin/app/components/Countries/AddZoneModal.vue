<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Zone, ZoneFormData, SelectOption } from "~~/shared/types/countries";

const open = defineModel<boolean>("open", { default: false });

const props = withDefaults(
  defineProps<{
    mode?: "add" | "edit";
    cities: SelectOption[];
    cityId?: number | null;
    lockCity?: boolean;
    zone?: Zone | null;
  }>(),
  { mode: "add", cityId: null, lockCity: false, zone: null },
);

const emit = defineEmits<{ submit: [data: ZoneFormData & { id?: number }] }>();

const { t } = useI18n();

const state = reactive<{
  nameAr: string;
  nameEn: string;
  cityId: number | undefined;
}>({
  nameAr: "",
  nameEn: "",
  cityId: undefined,
});

watch(
  open,
  (isOpen) => {
    if (!isOpen) return;
    state.nameAr = props.zone?.nameAr ?? "";
    state.nameEn = props.zone?.nameEn ?? "";
    state.cityId = props.zone?.cityId ?? props.cityId ?? undefined;
  },
  { immediate: true },
);

const schema = computed(() => {
  const req = t("addCountry.validation.required");
  return z.object({
    nameAr: z.string().min(1, req),
    nameEn: z.string().min(1, req),
    cityId: z.number({ message: req }).int().positive(req),
  });
});

function onSubmit(event: FormSubmitEvent<ZoneFormData>) {
  emit("submit", { ...event.data, id: props.zone?.id });
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
              ? $t("addZone.updateTitle")
              : $t("addZone.title")
          }}
        </h3>
        <UIcon name="i-lucide-map-plus" class="text-primary size-5" />
      </div>

      <UForm
        :schema="schema"
        :state="state"
        :validate-on="['input', 'change']"
        class="space-y-5"
        @submit="onSubmit"
      >
        <FormsTextInput
          v-model="state.nameAr"
          :label="$t('addZone.fields.nameAr')"
          name="nameAr"
          :placeholder="$t('addZone.placeholders.nameAr')"
        />
        <FormsTextInput
          v-model="state.nameEn"
          :label="$t('addZone.fields.nameEn')"
          name="nameEn"
          :placeholder="$t('addZone.placeholders.nameEn')"
        />
        <FormsSelectInput
          v-model="state.cityId"
          :label="$t('addZone.fields.city')"
          name="cityId"
          :items="cities"
          :placeholder="$t('addZone.placeholders.city')"
          :disabled="lockCity"
          searchable
        />

        <div class="flex items-stretch gap-3 pt-2">
          <button
            type="button"
            class="flex-1 h-12 rounded-lg border border-t-sec text-t-sec font-medium text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            @click="open = false"
          >
            {{ $t("addZone.cancel") }}
          </button>
          <button
            type="submit"
            class="flex-1 h-12 rounded-lg bg-primary text-white font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity"
          >
            {{
              mode === "edit"
                ? $t("addZone.update")
                : $t("addZone.submit")
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
