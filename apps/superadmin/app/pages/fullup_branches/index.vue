<script setup lang="ts">
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import type { Branch } from "~~/shared/types/branchs";

definePageMeta({
  title: "dashboard.pages.branches",
});

const { t } = useI18n();
const table = useTemplateRef("table");

const branches = reactive<Branch[]>([
  {
    id: 1,
    adminCode: "SA-1234",
    adminName: "ادمن السعودية",
    region: "الرياض",
    status: true,
  },
  {
    id: 2,
    adminCode: "SA-1235",
    adminName: "ادمن الامارات",
    region: "جدة",
    status: true,
  },
  {
    id: 3,
    adminCode: "SA-1236",
    adminName: "ادمن مصر",
    region: "القاهرة",
    status: true,
  },
  {
    id: 4,
    adminCode: "SA-1237",
    adminName: "ادمن قطر",
    region: "الدوحة",
    status: true,
  },
  {
    id: 5,
    adminCode: "SA-1238",
    adminName: "ادمن اليمن",
    region: "صنعاء",
    status: true,
  },
  {
    id: 6,
    adminCode: "SA-1239",
    adminName: "ادمن الكويت",
    region: "الكويت",
    status: false,
  },
  {
    id: 7,
    adminCode: "SA-1240",
    adminName: "ادمن البحرين",
    region: "المنامة",
    status: true,
  },
  {
    id: 8,
    adminCode: "SA-1241",
    adminName: "ادمن عمان",
    region: "مسقط",
    status: false,
  },
  {
    id: 9,
    adminCode: "SA-1242",
    adminName: "ادمن الاردن",
    region: "عمان",
    status: true,
  },
  {
    id: 10,
    adminCode: "SA-1243",
    adminName: "ادمن لبنان",
    region: "بيروت",
    status: true,
  },
  {
    id: 11,
    adminCode: "SA-1244",
    adminName: "ادمن العراق",
    region: "بغداد",
    status: false,
  },
  {
    id: 12,
    adminCode: "SA-1245",
    adminName: "ادمن السودان",
    region: "الخرطوم",
    status: true,
  },
  {
    id: 13,
    adminCode: "SA-1246",
    adminName: "ادمن تونس",
    region: "تونس",
    status: false,
  },
  {
    id: 14,
    adminCode: "SA-1247",
    adminName: "ادمن المغرب",
    region: "الرباط",
    status: true,
  },
  {
    id: 15,
    adminCode: "SA-1248",
    adminName: "ادمن ليبيا",
    region: "طرابلس",
    status: false,
  },
]);

// Filter tabs
const activeTab = ref("all");

const filterTabs = computed(() => [
  { label: t("branches.tabs.all"), value: "all", count: branches.length },
  {
    label: t("branches.tabs.active"),
    value: "active",
    count: branches.filter((b) => b.status).length,
  },
  {
    label: t("branches.tabs.stopped"),
    value: "stopped",
    count: branches.filter((b) => !b.status).length,
  },
]);

// Filtered data based on active tab
const filteredBranches = computed(() => {
  if (activeTab.value === "active") return branches.filter((b) => b.status);
  if (activeTab.value === "stopped") return branches.filter((b) => !b.status);
  return branches;
});

// Pagination
const pagination = ref({ pageIndex: 0, pageSize: 10 });

// Reset to first page when filter changes
watch(activeTab, () => {
  pagination.value.pageIndex = 0;
});

// Table columns
const columns = computed<TableColumn<Branch>[]>(() => [
  { accessorKey: "adminCode", header: t("branches.columns.adminCode") },
  { accessorKey: "adminName", header: t("branches.columns.adminName") },
  { accessorKey: "region", header: t("branches.columns.region") },
  { accessorKey: "status", header: t("branches.columns.status") },
  { id: "actions", header: t("branches.columns.actions") },
]);
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Filter Tabs -->
    <FilterTabs
      v-model="activeTab"
      :title="$t('branches.title')"
      icon="i-lucide-git-branch"
      :items="filterTabs"
    />

    <!-- Table Section -->
    <div class="bg-bg-landingpage rounded-2xl p-4 border border-default">
      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-settings" class="text-t-sec size-5" />
          <h3 class="text-t-white font-semibold text-base">
            {{ $t("branches.management") }}
          </h3>
        </div>
        <NuxtLinkLocale
          :to="'/fullup_branches/add_new_branch'"
          class="primary-btn"
        >
          <UIcon name="i-lucide-circle-plus" class="size-5" />
          {{ $t("branches.addNew") }}
        </NuxtLinkLocale>
      </div>

      <!-- Table -->
      <UTable
        ref="table"
        v-model:pagination="pagination"
        :data="filteredBranches"
        :columns="columns"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel(),
          autoResetPageIndex: false,
        }"
        :ui="{
          th: 'text-t-primary-gray font-medium text-sm py-3',
          td: 'text-t-primary-gray text-sm py-4',
          tr: 'border-b border-black/5 dark:border-white/5 last:border-0',
        }"
      >
        <template #status-cell="{ row }">
          <div class="flex items-center gap-3">
            <span
              class="text-sm text-t-primary-gray inline-block min-w-12 rtl:min-w-10"
            >
              {{
                row.original.status
                  ? $t("branches.active")
                  : $t("branches.inactive")
              }}
            </span>
            <FormsToggleSwitch v-model="row.original.status" :boxed="false" />
          </div>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2">
            <NuxtLinkLocale
              :to="`/fullup_branches/details/${row.original.id}`"
              class="size-8 rounded-xl bg-purple-bg flex items-center justify-center text-t-purple hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <UIcon name="i-lucide-eye" class="size-4" />
            </NuxtLinkLocale>
            <button
              class="size-8 rounded-xl bg-red-bg flex items-center justify-center text-t-red hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </div>
        </template>
      </UTable>

      <!-- Pagination -->
      <div
        v-if="(table?.tableApi?.getFilteredRowModel().rows.length ?? 0) > 10"
        class="flex justify-end border-t border-default pt-4 px-4"
      >
        <UPagination
          :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          dir="ltr"
          :ui="{
            item: 'cursor-pointer  data-[selected=true]:text-white',
            last: 'cursor-pointer',
            first: 'cursor-pointer',
            next: 'cursor-pointer',
            prev: 'cursor-pointer',
          }"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
  </div>
</template>
