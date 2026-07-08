<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const { t } = useI18n();

const props = defineProps<{
  initialData?: Partial<StepOneData>;
  submitLabel?: string;
}>();

const emit = defineEmits<{
  submit: [data: StepOneData];
}>();

// --- Select options ---
const countries = computed(() => [
  { label: t("addBranch.countries.sa"), value: "sa" },
  { label: t("addBranch.countries.ae"), value: "ae" },
  { label: t("addBranch.countries.eg"), value: "eg" },
  { label: t("addBranch.countries.qa"), value: "qa" },
  { label: t("addBranch.countries.kw"), value: "kw" },
]);

const positions = computed(() => [
  { label: t("addBranch.positions.commissioner"), value: "commissioner" },
  { label: t("addBranch.positions.branchManager"), value: "branch_manager" },
  {
    label: t("addBranch.positions.generalManager"),
    value: "general_manager",
  },
]);

// --- State ---
const phoneValid = ref(false);
const dialCode = ref(props.initialData?.dialCode ?? "+966");

const state = reactive({
  branchNameAr: props.initialData?.branchNameAr ?? "",
  branchNameEn: props.initialData?.branchNameEn ?? "",
  email: props.initialData?.email ?? "",
  country: props.initialData?.country ?? "",
  phone: props.initialData?.phone ?? "",
  contactNameAr: props.initialData?.contactNameAr ?? "",
  contactNameEn: props.initialData?.contactNameEn ?? "",
  contactPosition: props.initialData?.contactPosition ?? "",
  branchCode: props.initialData?.branchCode ?? "",
  netProfit: props.initialData?.netProfit ?? "",
});

// --- Validation ---
const schema = computed(() => {
  const req = t("addBranch.validation.required");
  return z.object({
    branchNameAr: z.string().min(1, req),
    branchNameEn: z.string().min(1, req),
    email: z.string().min(1, req).email(t("addBranch.validation.invalidEmail")),
    country: z.string().min(1, req),
    phone: z
      .string()
      .min(1, req)
      .refine(() => phoneValid.value, t("addBranch.validation.invalidPhone")),
    contactNameAr: z.string().min(1, req),
    contactNameEn: z.string().min(1, req),
    contactPosition: z.string().min(1, req),
    branchCode: z.string().min(1, req),
    netProfit: z.string().optional().or(z.literal("")),
  });
});

// --- Submit ---
function onSubmit(event: FormSubmitEvent<unknown>) {
  emit("submit", {
    ...(event.data as Omit<StepOneData, "dialCode">),
    dialCode: dialCode.value,
  });
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="mt-8" @submit="onSubmit">
    <!-- General Branch Data -->
    <h3 class="text-t-white font-semibold text-base mb-6">
      {{ $t("addBranch.sections.generalInfo") }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <FormsLocaleInput
        v-model:ar="state.branchNameAr"
        v-model:en="state.branchNameEn"
        :label="$t('addBranch.fields.branchName')"
        name="branchName"
        :placeholder="$t('addBranch.placeholders.branchName')"
      />
      <UFormField
        :label="$t('addBranch.fields.email')"
        name="email"
        :ui="fieldUi"
      >
        <UInput
          v-model="state.email"
          type="email"
          placeholder="hesham@gmail.com"
          class="w-full"
          :ui="inputUi"
        />
      </UFormField>
      <FormsSelectInput
        v-model="state.country"
        :label="$t('addBranch.fields.country')"
        name="country"
        :items="countries"
        :placeholder="$t('addBranch.placeholders.country')"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <UFormField
        :label="$t('addBranch.fields.phone')"
        name="phone"
        :ui="fieldUi"
      >
        <FormsPhoneInput
          v-model="state.phone"
          v-model:dial-code="dialCode"
          v-model:valid="phoneValid"
        />
      </UFormField>
      <FormsLocaleInput
        v-model:ar="state.contactNameAr"
        v-model:en="state.contactNameEn"
        :label="$t('addBranch.fields.contactName')"
        name="contactName"
        :placeholder="$t('addBranch.placeholders.contactName')"
      />
      <FormsSelectInput
        v-model="state.contactPosition"
        :label="$t('addBranch.fields.contactPosition')"
        name="contactPosition"
        :items="positions"
        :placeholder="$t('addBranch.placeholders.contactPosition')"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UFormField
        :label="$t('addBranch.fields.branchCode')"
        name="branchCode"
        :ui="fieldUi"
      >
        <UInput
          v-model="state.branchCode"
          :placeholder="$t('addBranch.placeholders.branchCode')"
          class="w-full"
          :ui="inputUi"
        />
      </UFormField>
    </div>

    <!-- Profits -->
    <h3 class="text-t-white font-semibold text-base mb-6">
      {{ $t("addBranch.sections.profits") }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UFormField
        :label="$t('addBranch.fields.netProfit')"
        name="netProfit"
        :ui="fieldUi"
      >
        <UInput
          v-model="state.netProfit"
          :placeholder="$t('addBranch.placeholders.netProfit')"
          trailing-icon="i-lucide-percent"
          class="w-full"
          :ui="inputUi"
        />
      </UFormField>
    </div>

    <!-- Submit -->
    <div class="flex justify-end">
      <UButton
        type="submit"
        :label="props.submitLabel ?? $t('addBranch.next')"
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
