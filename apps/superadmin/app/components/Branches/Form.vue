<script setup lang="ts">
import type { BranchFormData, BranchFormMode } from "~~/shared/types/branchs";

const { t } = useI18n();
const stepper = useTemplateRef("stepper");
const currentStep = ref<string | number>("0");
function isStepDone(value: string) {
  return Number(value) < Number(currentStep.value);
}

const props = withDefaults(
  defineProps<{
    mode?: BranchFormMode;
    initialData?: Partial<BranchFormData>;
    branchId?: number;
  }>(),
  { mode: "add" }
);

const isUpdate = computed(() => props.mode === "update");

const stepOneData = ref<StepOneData | null>(
  props.initialData
    ? {
        branchNameAr: props.initialData.branchNameAr ?? "",
        branchNameEn: props.initialData.branchNameEn ?? "",
        email: props.initialData.email ?? "",
        country: props.initialData.country ?? "",
        phone: props.initialData.phone ?? "",
        dialCode: props.initialData.dialCode ?? "+966",
        contactNameAr: props.initialData.contactNameAr ?? "",
        contactNameEn: props.initialData.contactNameEn ?? "",
        contactPosition: props.initialData.contactPosition ?? "",
        branchCode: props.initialData.branchCode ?? "",
        netProfit: props.initialData.netProfit ?? "",
      }
    : null
);

const steps = computed(() => [
  {
    title: t("addBranch.steps.branchInfo"),
    value: "0",
    slot: "step-one",
  },
  {
    title: t("addBranch.steps.documents"),
    value: "1",
    slot: "step-two",
  },
]);

function onStepOneSubmit(data: StepOneData) {
  stepOneData.value = data;
  stepper.value?.next();
}

function onStepTwoSubmit(data: StepTwoData) {
  const fullForm = { ...stepOneData.value, ...data };
  if (isUpdate.value) {
    console.log("Update branch:", props.branchId, fullForm);
    // TODO: call update endpoint, e.g. PATCH /branches/{id}
  } else {
    console.log("Create branch:", fullForm);
    // TODO: call create endpoint, e.g. POST /branches
  }
}

function onPrev() {
  stepper.value?.prev();
}
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="bg-bg-landingpage rounded-2xl p-6 border border-default">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-2">
          <UIcon
            :name="isUpdate ? 'i-lucide:pencil' : 'i-lucide:circle-plus'"
            class="text-t-sec size-5"
          />
          <h2 class="text-t-white font-semibold text-lg">
            {{
              isUpdate ? $t("addBranch.updateTitle") : $t("addBranch.title")
            }}
          </h2>
        </div>
        <NuxtLinkLocale
          to="/fullup_branches"
          class="size-10 rounded-full border border-default flex items-center justify-center text-t-white hover:bg-primary/10 transition-colors"
        >
          <UIcon name="i-lucide-arrow-right" class="size-5 rtl:rotate-180" />
        </NuxtLinkLocale>
      </div>

      <!-- Stepper -->
      <UStepper
        ref="stepper"
        v-model="currentStep"
        :items="steps"
        disabled
        :linear="true"
        color="primary"
        :ui="{
          root: 'w-full',
          trigger: 'group-data-[state=active]:text-white group-data-[state=completed]:text-white',
          separator: 'after:border-primary/30',
          title: 'text-sm font-medium',
        }"
      >
        <template #indicator="{ item }">
          <UIcon
            v-if="isStepDone(item.value)"
            name="i-lucide-check"
            class="size-4"
          />
          <template v-else>{{ Number(item.value) + 1 }}</template>
        </template>
        <template #step-one>
          <BranchesStepOne
            :initial-data="stepOneData ?? initialData"
            @submit="onStepOneSubmit"
          />
        </template>
        <template #step-two>
          <BranchesStepTwo
            :initial-data="initialData"
            :is-update="isUpdate"
            :submit-label="isUpdate ? $t('addBranch.update') : undefined"
            @submit="onStepTwoSubmit"
            @prev="onPrev"
          />
        </template>
      </UStepper>
    </div>
  </div>
</template>
