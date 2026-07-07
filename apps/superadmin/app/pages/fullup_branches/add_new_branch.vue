<script setup lang="ts">
import type { BranchFormData, BranchFormMode } from "~~/shared/types/branchs";

const route = useRoute();

const mode = computed<BranchFormMode>(() =>
  route.query.mode === "update" ? "update" : "add",
);

const branchId = computed(() =>
  route.query.id ? Number(route.query.id) : undefined,
);

definePageMeta({
  title: ["dashboard.pages.branches", "dashboard.pages.addNewBranch"],
});

// TODO: replace with real fetch by id when the API is wired.
function loadBranchForUpdate(id: number): Partial<BranchFormData> {
  return {
    branchNameAr: "الشركة السعودية",
    branchNameEn: "The Saudi Company",
    email: "hesham@gmail.com",
    country: "eg",
    phone: "1023780008",
    dialCode: "+20",
    contactNameAr: "حافظ الشنقيطي",
    contactNameEn: "Hafez Al-Shanqeeti",
    contactPosition: "commissioner",
    branchCode: "EG-1",
    netProfit: "7",
    commercialRegNo: "232312321",
    vatNumber: "5236425",
    iban: "SA99 8000 0011 1222 3344 5566",
  };
}

const initialData = computed(() =>
  mode.value === "update" && branchId.value
    ? loadBranchForUpdate(branchId.value)
    : undefined,
);
</script>

<template>
  <BranchsForm :mode="mode" :branch-id="branchId" :initial-data="initialData" />
</template>
