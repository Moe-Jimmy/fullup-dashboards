<script setup lang="ts">
import type { BranchDetails } from "~~/shared/types/branchs";

definePageMeta({
  title: ["dashboard.pages.branches", "branchDetails.title"],
});

const route = useRoute();
const { t, locale } = useI18n();

const branch = reactive<BranchDetails>({
  id: Number(route.params.id) || 1,
  requestNumber: "#782343",
  submittedAt: "24 يناير 2025",
  status: "completed",
  branchCode: "EG-1",
  branchNameAr: "الشركة السعودية",
  branchNameEn: "The Saudi Company",
  country: t("addBranch.countries.sa"),
  email: "hesham@gmail.com",
  phone: "+96625458236",
  contactNameAr: "حافظ الشنقيطي",
  contactNameEn: "Hafez Al-Shanqeeti",
  contactPosition: t("addBranch.positions.commissioner"),
  netProfit: "7%",
  commercialRegNo: "214536",
  commercialRegFile: {
    name: "gsjsloemejksonshel.jpg",
    url: "/images/Claude/show-branch-data.png",
    type: "image",
  },
  vatNumber: "5236425",
  taxCertFile: {
    name: "gsjsloemejksonshel.jpg",
    url: "/images/Claude/show-branch-data.png",
    type: "image",
  },
  iban: "SA99 8000 0011 1222 3344 5566",
  ibanFile: {
    name: "تفاصيل حساب الدفع الرسمي.pdf",
    url: "/images/Claude/show-branch-data.png",
    type: "pdf",
  },
  addressFile: {
    name: "hsgdkmmcjhd.jpg",
    url: "/images/Claude/show-branch-data.png",
    type: "image",
  },
  agreementFile: {
    name: "تفاصيل حساب الدفع الرسمي.pdf",
    url: "/images/Claude/show-branch-data.png",
    type: "pdf",
  },
});

const statusStyles: Record<BranchDetails["status"], string> = {
  completed: "bg-green-bg text-t-green",
  pending: "bg-brand-bg text-t-brand",
  rejected: "bg-red-bg text-t-red",
};

const branchName = computed(() =>
  locale.value === "ar" ? branch.branchNameAr : branch.branchNameEn
);
const contactName = computed(() =>
  locale.value === "ar" ? branch.contactNameAr : branch.contactNameEn
);
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="bg-bg-landingpage rounded-2xl border border-default">
      <!-- Header -->
      <div class="flex items-center justify-between p-6">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-info" class="text-t-brand size-5" />
          <h2 class="text-t-sec font-semibold text-lg">
            {{ $t("branchDetails.title") }}
          </h2>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            :class="statusStyles[branch.status]"
          >
            <span class="size-1.5 rounded-full bg-current" />
            {{ $t(`branchDetails.status.${branch.status}`) }}
          </span>
          <NuxtLinkLocale
            to="/fullup_branches"
            class="size-10 rounded-full border border-default flex items-center justify-center text-t-primary-gray hover:bg-primary/10 transition-colors"
          >
            <UIcon name="i-lucide-arrow-right" class="size-5 rtl:rotate-180" />
          </NuxtLinkLocale>
        </div>
      </div>

      <!-- Request meta -->
      <div class="px-6 pb-4 flex flex-col gap-1">
        <div class="flex items-center gap-2 text-t-primary-gray font-semibold">
          <span>{{ $t("branchDetails.requestNumber") }}</span>
          <span>:</span>
          <span>{{ branch.requestNumber }}</span>
        </div>
        <div class="flex items-center gap-2 text-t-sec text-sm">
          <span>{{ $t("branchDetails.submittedAt") }}</span>
          <span>:</span>
          <UIcon name="i-lucide-calendar" class="size-4" />
          <span>{{ branch.submittedAt }}</span>
        </div>
      </div>

      <!-- Entity details -->
      <section class="px-6 py-5 border-t border-default">
        <h3 class="text-t-primary-gray font-semibold text-base mb-5">
          {{ $t("branchDetails.sections.entity") }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <DetailsInfo
            :label="$t('branchDetails.fields.branchNumber')"
            :value="branch.branchCode"
            icon="i-lucide-hash"
          />
          <DetailsInfo
            :label="$t('branchDetails.fields.branchName')"
            :value="branchName"
            icon="i-lucide-building-2"
          />
          <DetailsInfo
            :label="$t('addBranch.fields.country')"
            :value="branch.country"
            icon="i-lucide-globe"
          />
          <DetailsInfo
            :label="$t('addBranch.fields.email')"
            :value="branch.email"
            icon="i-lucide-mail"
          />
          <DetailsInfo
            :label="$t('addBranch.fields.phone')"
            :value="branch.phone"
            icon="i-lucide-phone"
          />
          <DetailsInfo
            :label="$t('addBranch.fields.contactPosition')"
            :value="branch.contactPosition"
            icon="i-lucide-briefcase"
          />
          <DetailsInfo
            :label="$t('branchDetails.fields.contactName')"
            :value="contactName"
            icon="i-lucide-contact"
          />
          <DetailsInfo
            :label="$t('branchDetails.fields.netProfitShare')"
            :value="branch.netProfit"
            icon="i-lucide-percent"
          />
        </div>
      </section>

      <!-- Commercial registry -->
      <section class="px-6 py-5 border-t border-default">
        <h3 class="text-t-primary-gray font-semibold text-base mb-5">
          {{ $t("branchDetails.sections.commercialReg") }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <DetailsInfo
            :label="$t('branchDetails.fields.commercialReg')"
            :value="branch.commercialRegNo"
            icon="i-lucide-database"
          />
          <DetailsImage
            :label="$t('branchDetails.fields.commercialReg')"
            :file-name="branch.commercialRegFile.name"
            :file-url="branch.commercialRegFile.url"
            :file-type="branch.commercialRegFile.type"
          />
        </div>
      </section>

      <!-- Tax number -->
      <section class="px-6 py-5 border-t border-default">
        <h3 class="text-t-primary-gray font-semibold text-base mb-5">
          {{ $t("branchDetails.sections.tax") }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <DetailsInfo
            :label="$t('branchDetails.fields.tax')"
            :value="branch.vatNumber"
            icon="i-lucide-barcode"
          />
          <DetailsImage
            :label="$t('branchDetails.fields.tax')"
            :file-name="branch.taxCertFile.name"
            :file-url="branch.taxCertFile.url"
            :file-type="branch.taxCertFile.type"
          />
        </div>
      </section>

      <!-- Bank IBAN -->
      <section class="px-6 py-5 border-t border-default">
        <h3 class="text-t-primary-gray font-semibold text-base mb-5">
          {{ $t("branchDetails.sections.iban") }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <DetailsInfo
            :label="$t('addBranch.fields.iban')"
            :value="branch.iban"
            icon="i-lucide-landmark"
          />
          <DetailsImage
            :label="$t('branchDetails.fields.ibanFile')"
            :file-name="branch.ibanFile.name"
            :file-url="branch.ibanFile.url"
            :file-type="branch.ibanFile.type"
          />
        </div>
      </section>

      <!-- Other documents -->
      <section class="px-6 py-5 border-t border-default">
        <h3 class="text-t-primary-gray font-semibold text-base mb-5">
          {{ $t("branchDetails.sections.otherDocs") }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <DetailsImage
            :label="$t('branchDetails.fields.nationalAddress')"
            :file-name="branch.addressFile.name"
            :file-url="branch.addressFile.url"
            :file-type="branch.addressFile.type"
          />
          <DetailsImage
            :label="$t('branchDetails.fields.ibanFile')"
            :file-name="branch.agreementFile.name"
            :file-url="branch.agreementFile.url"
            :file-type="branch.agreementFile.type"
          />
        </div>
      </section>

      <!-- Footer -->
      <div class="px-6 py-5 border-default flex justify-end">
        <NuxtLinkLocale
          :to="{
            path: '/fullup_branches/add_new_branch',
            query: { mode: 'update', id: branch.id },
          }"
          class="bg-brand-bg text-t-brand rounded-lg px-8 py-2.5 text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors"
        >
          {{ $t("branchDetails.editData") }}
        </NuxtLinkLocale>
      </div>
    </div>
  </div>
</template>
