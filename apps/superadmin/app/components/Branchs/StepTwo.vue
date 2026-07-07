<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const { t } = useI18n();

const props = defineProps<{
  initialData?: Partial<StepTwoData>;
  isUpdate?: boolean;
  submitLabel?: string;
}>();

const emit = defineEmits<{
  submit: [data: StepTwoData];
  prev: [];
}>();

// --- State ---
const state = reactive({
  commercialRegNo: props.initialData?.commercialRegNo ?? "",
  vatNumber: props.initialData?.vatNumber ?? "",
  iban: props.initialData?.iban ?? "",
  commercialRegFile: (props.initialData?.commercialRegFile ?? null) as File | null,
  taxCertFile: (props.initialData?.taxCertFile ?? null) as File | null,
  ibanFile: (props.initialData?.ibanFile ?? null) as File | null,
  addressFile: (props.initialData?.addressFile ?? null) as File | null,
  agreementFile: (props.initialData?.agreementFile ?? null) as File | null,
});

// --- Validation ---
const schema = computed(() => {
  const req = t("addBranch.validation.required");
  const uploadReq = t("addBranch.validation.uploadRequired");
  const fileCheck = props.isUpdate
    ? z.any().optional()
    : z.any().refine((v) => v instanceof File, uploadReq);
  return z.object({
    commercialRegNo: z.string().min(1, req),
    vatNumber: z.string().optional().or(z.literal("")),
    iban: z.string().min(1, req),
    commercialRegFile: fileCheck,
    taxCertFile: fileCheck,
    ibanFile: fileCheck,
    addressFile: fileCheck,
    agreementFile: fileCheck,
  });
});

// --- Submit ---
function onSubmit(event: FormSubmitEvent<unknown>) {
  emit("submit", event.data as StepTwoData);
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="mt-8" @submit="onSubmit">
    <!-- Financial Fields -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UFormField
        :label="$t('addBranch.fields.commercialRegNo')"
        name="commercialRegNo"
        :ui="fieldUi"
      >
        <UInput
          v-model="state.commercialRegNo"
          :placeholder="$t('addBranch.placeholders.commercialRegNo')"
          class="w-full"
          :ui="inputUi"
        />
      </UFormField>
      <UFormField
        :label="`${$t('addBranch.fields.vatNumber')} (${$t('addBranch.vatOptional')})`"
        name="vatNumber"
        :ui="fieldUi"
      >
        <UInput
          v-model="state.vatNumber"
          :placeholder="$t('addBranch.placeholders.vatNumber')"
          class="w-full"
          :ui="inputUi"
        />
      </UFormField>
      <UFormField
        :label="$t('addBranch.fields.iban')"
        name="iban"
        :ui="fieldUi"
      >
        <UInput
          v-model="state.iban"
          :placeholder="$t('addBranch.placeholders.iban')"
          class="w-full"
          :ui="inputUi"
        />
      </UFormField>
    </div>

    <!-- Documents -->
    <h3 class="text-t-white font-semibold text-base mb-6">
      {{ $t("addBranch.sections.documents") }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <FormsFileUpload
        v-model="state.commercialRegFile"
        :label="$t('addBranch.documents.commercialReg')"
        name="commercialRegFile"
        accept="image/png,image/jpeg,image/svg+xml"
        file-icon="i-lucide-cloud-upload"
        :description="$t('addBranch.fileHint')"
      />
      <FormsFileUpload
        v-model="state.taxCertFile"
        :label="$t('addBranch.documents.taxCert')"
        name="taxCertFile"
        accept="image/png,image/jpeg,image/svg+xml"
        file-icon="i-lucide-cloud-upload"
        :description="$t('addBranch.fileHint')"
      />
      <FormsFileUpload
        v-model="state.ibanFile"
        :label="$t('addBranch.documents.bankIban')"
        name="ibanFile"
        accept="image/png,image/jpeg,image/svg+xml"
        file-icon="i-lucide-cloud-upload"
        :description="$t('addBranch.fileHint')"
      />
      <FormsFileUpload
        v-model="state.addressFile"
        :label="$t('addBranch.documents.address')"
        name="addressFile"
        accept="image/png,image/jpeg,image/svg+xml"
        file-icon="i-lucide-cloud-upload"
        :description="$t('addBranch.fileHint')"
      />
      <FormsFileUpload
        v-model="state.agreementFile"
        :label="$t('addBranch.documents.agreement')"
        name="agreementFile"
        accept="image/png,image/jpeg,image/svg+xml"
        file-icon="i-lucide-cloud-upload"
        :description="$t('addBranch.fileHint')"
      />
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between">
      <UButton
        type="button"
        variant="link"
        :label="$t('addBranch.previous')"
        class="outline-btn"
        @click="emit('prev')"
      />
      <UButton
        type="submit"
        :label="props.submitLabel ?? $t('addBranch.submit')"
        class="gradient-btn px-12!"
      />
    </div>
  </UForm>
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
