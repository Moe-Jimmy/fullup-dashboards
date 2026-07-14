<script setup lang="ts">
import type { BranchCoding, CodingSettingsFormData } from "~~/shared/types/coding";

const localePath = useLocalePath();

// TODO: replace mock with real fetch when the API is wired.
const branches = reactive<BranchCoding[]>([
  {
    id: 1,
    branchName: "فرع الرئيسي السعودية",
    mainCode: "SA",
    serviceProviders: "SA-SP001",
    delegates: "SA-SP001",
    individuals: "SA-SP001",
    companies: "SA-SP001",
    diplomatic: "SA-SP001",
    government: "SA-SP001",
    exhibitions: "SA-SP001",
  },
  {
    id: 2,
    branchName: "فرع جدة السعودية",
    mainCode: "SA",
    serviceProviders: "SA-SP002",
    delegates: "SA-SP002",
    individuals: "SA-SP002",
    companies: "SA-SP002",
    diplomatic: "SA-SP002",
    government: "SA-SP002",
    exhibitions: "SA-SP002",
  },
]);

const settingsOpen = ref(false);
const settings = ref<CodingSettingsFormData | null>(null);

function onSettingsSubmit(data: CodingSettingsFormData) {
  settings.value = data;
  console.log("Coding settings:", data);
}

function onCardSave(payload: { id: number; mainCode: string }) {
  const branch = branches.find((b) => b.id === payload.id);
  if (branch) branch.mainCode = payload.mainCode;
}

function onCardView(id: number) {
  navigateTo(localePath(`/fullup_coding/details/${id}`));
}
</script>

<template>
  <div class="bg-bg-landingpage rounded-2xl p-4 border border-default">
    <!-- Header: section title (right) + CTA (left) -->
    <div class="flex items-center justify-between mb-7">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-hash" class="text-t-sec size-5" />
        <h3 class="text-t-sec font-bold text-base">
          {{ $t("coding.management") }}
        </h3>
      </div>
      <button type="button" class="primary-btn" @click="settingsOpen = true">
        <UIcon name="i-lucide-circle-plus" class="size-5" />
        {{ $t("coding.settingsCta") }}
      </button>
    </div>

    <!-- Branch coding cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-7">
      <CodingBranchCodingCard
        v-for="branch in branches"
        :key="branch.id"
        :branch="branch"
        @view="onCardView"
        @save="onCardSave"
      />
    </div>

    <!-- Root coding settings modal -->
    <CodingSettingsModal
      v-model:open="settingsOpen"
      :settings="settings"
      @submit="onSettingsSubmit"
    />
  </div>
</template>
