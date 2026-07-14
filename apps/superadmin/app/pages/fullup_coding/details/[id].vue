<script setup lang="ts">
import type { BranchCoding } from "~~/shared/types/coding";

definePageMeta({
  title: ["dashboard.pages.coding", "dashboard.pages.codingDetails"],
});

const route = useRoute();

// TODO: replace mock with real fetch by id when the API is wired.
const branch = reactive<BranchCoding>({
  id: Number(route.params.id) || 1,
  branchName: "فرع الرئيسي السعودية",
  mainCode: "SA",
  serviceProviders: "SA-SP001",
  delegates: "SA-SP001",
  individuals: "SA-SP001",
  companies: "SA-SP001",
  diplomatic: "SA-SP001",
  government: "SA-SP001",
  exhibitions: "SA-SP001",
});

// Category codes surfaced in the "ترميزات الفرع" card, in design order.
const codingFields = [
  "serviceProviders",
  "delegates",
  "individuals",
  "companies",
  "diplomatic",
  "government",
  "exhibitions",
] as const;
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="bg-bg-landingpage rounded-2xl p-4 border border-default space-y-7">
      <!-- Header: title (right) + back (left) -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-hash" class="text-t-sec size-5" />
          <h2 class="text-t-sec font-bold text-base">
            {{ $t("coding.details.title") }}
          </h2>
        </div>
        <NuxtLinkLocale to="/fullup_coding" class="back-btn">
          <UIcon name="i-lucide-arrow-right" class="size-5 rtl:rotate-180" />
        </NuxtLinkLocale>
      </div>

      <!-- Branch identity (read-only) -->
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-t-sec font-medium text-sm text-right">
            {{ $t("coding.fields.mainCode") }}
          </label>
          <div
            class="h-[53px] w-full rounded-lg border-[0.2px] border-t-placeholder bg-bg-landingpage px-3 flex items-center  text-lg font-extrabold text-t-white"
          >
            {{ branch.mainCode }}
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-t-sec font-medium text-sm text-right">
            {{ $t("coding.fields.branchName") }}
          </label>
          <div
            class="h-[53px] w-full rounded-lg border-[0.2px] border-t-placeholder bg-bg-landingpage px-3 flex items-center  text-lg font-extrabold text-t-white"
          >
            {{ branch.branchName }}
          </div>
        </div>
      </div>

      <!-- Branch codings -->
      <div class="border-[0.2px] border-t-placeholder rounded-lg p-5 space-y-4">
        <h3 class="text-t-sec font-bold text-base text-right">
          {{ $t("coding.details.codingsTitle") }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <div
            v-for="key in codingFields"
            :key="key"
            class="flex flex-col gap-1"
          >
            <span class="text-t-sec font-medium text-sm text-right">
              {{ $t(`coding.details.fields.${key}`) }}
            </span>
            <span class="text-lg font-extrabold text-t-white text-right px-2">
              {{ branch[key] }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
