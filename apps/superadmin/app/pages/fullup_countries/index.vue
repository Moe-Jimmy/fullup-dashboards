<script setup lang="ts">
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import type {
  Country,
  City,
  CityFormData,
  ZoneFormData,
  SelectOption,
} from "~~/shared/types/countries";

definePageMeta({
  title: "dashboard.pages.countries",
});

const { t, locale } = useI18n();
const localePath = useLocalePath();
const table = useTemplateRef("table");

// TODO: replace mock with real fetch when the API is wired.
const countries = reactive<Country[]>([
  { id: 1, nameAr: "السعودية", nameEn: "Saudi Arabia", code: "+966", citiesCount: 12, zonesCount: 17, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 2, nameAr: "الامارات", nameEn: "UAE", code: "+971", citiesCount: 7, zonesCount: 9, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 3, nameAr: "مصر", nameEn: "Egypt", code: "+20", citiesCount: 27, zonesCount: 40, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 4, nameAr: "قطر", nameEn: "Qatar", code: "+974", citiesCount: 5, zonesCount: 6, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 5, nameAr: "الكويت", nameEn: "Kuwait", code: "+965", citiesCount: 6, zonesCount: 8, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 6, nameAr: "السعودية", nameEn: "Saudi Arabia", code: "+966", citiesCount: 12, zonesCount: 17, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 7, nameAr: "الامارات", nameEn: "UAE", code: "+971", citiesCount: 7, zonesCount: 9, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 8, nameAr: "مصر", nameEn: "Egypt", code: "+20", citiesCount: 27, zonesCount: 40, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 9, nameAr: "قطر", nameEn: "Qatar", code: "+974", citiesCount: 5, zonesCount: 6, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 10, nameAr: "الكويت", nameEn: "Kuwait", code: "+965", citiesCount: 6, zonesCount: 8, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 11, nameAr: "السعودية", nameEn: "Saudi Arabia", code: "+966", citiesCount: 12, zonesCount: 17, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 12, nameAr: "الامارات", nameEn: "UAE", code: "+971", citiesCount: 7, zonesCount: 9, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 13, nameAr: "مصر", nameEn: "Egypt", code: "+20", citiesCount: 27, zonesCount: 40, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 14, nameAr: "قطر", nameEn: "Qatar", code: "+974", citiesCount: 5, zonesCount: 6, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 15, nameAr: "الكويت", nameEn: "Kuwait", code: "+965", citiesCount: 6, zonesCount: 8, creator: "أحمد محمد", createdAt: "21 فبراير 2025 - 5:05 ص" },
]);

// Mock cities per country — used to populate the add-zone city select.
const cities = reactive<City[]>([
  { id: 1, code: "RUH", nameAr: "الرياض", nameEn: "Riyadh", countryId: 1, createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 2, code: "JED", nameAr: "جدة", nameEn: "Jeddah", countryId: 1, createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 3, code: "DXB", nameAr: "دبي", nameEn: "Dubai", countryId: 2, createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 4, code: "CAI", nameAr: "القاهرة", nameEn: "Cairo", countryId: 3, createdAt: "21 فبراير 2025 - 5:05 ص" },
]);

const countryName = (c: Country) => (locale.value === "ar" ? c.nameAr : c.nameEn);
const cityName = (c: City) => (locale.value === "ar" ? c.nameAr : c.nameEn);

const pagination = ref({ pageIndex: 0, pageSize: 10 });

const columns = computed<TableColumn<Country>[]>(() => [
  { accessorKey: "id", header: t("countries.columns.id") },
  { accessorKey: "nameAr", header: t("countries.columns.nameAr") },
  { accessorKey: "nameEn", header: t("countries.columns.nameEn") },
  { accessorKey: "citiesCount", header: t("countries.columns.cities") },
  { accessorKey: "zonesCount", header: t("countries.columns.zones") },
  { accessorKey: "creator", header: t("countries.columns.creator") },
  { accessorKey: "createdAt", header: t("countries.columns.createdAt") },
  { id: "actions", header: t("countries.columns.actions") },
]);

// --- Modals / dialog state ---
const cityModalOpen = ref(false);
const zoneModalOpen = ref(false);
const deleteOpen = ref(false);
const selectedCountry = ref<Country | null>(null);

const countryOptions = computed<SelectOption[]>(() =>
  countries.map((c) => ({ id: c.id, label: countryName(c), value: c.id })),
);

// Cities of the selected country, for the add-zone modal.
const zoneCityOptions = computed<SelectOption[]>(() =>
  cities
    .filter((c) => c.countryId === selectedCountry.value?.id)
    .map((c) => ({ id: c.id, label: cityName(c), value: c.id })),
);

function openAddCity(country: Country) {
  selectedCountry.value = country;
  cityModalOpen.value = true;
}

function openAddZone(country: Country) {
  selectedCountry.value = country;
  zoneModalOpen.value = true;
}

function openDelete(country: Country) {
  selectedCountry.value = country;
  deleteOpen.value = true;
}

function rowActions(country: Country): DropdownMenuItem[][] {
  return [
    [
      {
        label: t("countries.actions.view"),
        icon: "i-lucide-eye",
        onSelect: () =>
          navigateTo(localePath(`/fullup_countries/details/${country.id}`)),
      },
      {
        label: t("countries.actions.addCity"),
        icon: "i-lucide-map-pin-plus",
        onSelect: () => openAddCity(country),
      },
      {
        label: t("countries.actions.addZone"),
        icon: "i-lucide-map-plus",
        onSelect: () => openAddZone(country),
      },
    ],
    [
      {
        label: t("countries.actions.delete"),
        icon: "i-lucide-trash-2",
        color: "error",
        onSelect: () => openDelete(country),
      },
    ],
  ];
}

// --- Handlers (mock only) ---
function onCitySubmit(data: CityFormData & { id?: number }) {
  // TODO: POST /cities
  console.log("Create city:", data);
}

function onZoneSubmit(data: ZoneFormData & { id?: number }) {
  // TODO: POST /zones
  console.log("Create zone:", data);
}

function onDeleteConfirm() {
  if (!selectedCountry.value) return;
  const idx = countries.findIndex((c) => c.id === selectedCountry.value!.id);
  if (idx !== -1) countries.splice(idx, 1); // TODO: DELETE /countries/{id}
  deleteOpen.value = false;
}
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="bg-bg-landingpage rounded-2xl p-4 border border-default">
      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-globe" class="text-t-sec size-5" />
          <h3 class="text-t-white font-semibold text-base">
            {{ $t("countries.title") }}
          </h3>
        </div>
        <NuxtLinkLocale
          :to="'/fullup_countries/add_new_country'"
          class="primary-btn"
        >
          <UIcon name="i-lucide-circle-plus" class="size-5" />
          {{ $t("countries.addNew") }}
        </NuxtLinkLocale>
      </div>

      <!-- Table -->
      <UTable
        ref="table"
        v-model:pagination="pagination"
        :data="countries"
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
        <template #creator-cell="{ row }">
          <div class="flex items-center gap-2">
            <span
              class="size-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-medium"
            >
              {{ row.original.creator.charAt(0) }}
            </span>
            <span>{{ row.original.creator }}</span>
          </div>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu
            :items="rowActions(row.original)"
            :content="{ align: 'end' }"
            :ui="{ content: 'min-w-52' }"
            :dir="locale === 'ar' ? 'rtl' : 'ltr'"
          >
            <button
              class="size-8 rounded-xl border border-default flex items-center justify-center text-t-sec hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <UIcon name="i-lucide-ellipsis-vertical" class="size-4" />
            </button>
          </UDropdownMenu>
        </template>
      </UTable>

      <!-- Pagination -->
      <div
        v-if="(table?.tableApi?.getFilteredRowModel().rows.length ?? 0) > 10"
        class="flex justify-end border-t border-default pt-4 px-4"
      >
        <Pagination
          :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>

    <!-- Add city (country preset + locked from the row action) -->
    <CountriesAddCityModal
      v-model:open="cityModalOpen"
      :countries="countryOptions"
      :country-id="selectedCountry?.id ?? null"
      lock-country
      @submit="onCitySubmit"
    />

    <!-- Add zone (cities scoped to the selected country) -->
    <CountriesAddZoneModal
      v-model:open="zoneModalOpen"
      :cities="zoneCityOptions"
      @submit="onZoneSubmit"
    />

    <!-- Delete confirmation -->
    <ConfirmDialog
      v-model:open="deleteOpen"
      :title="$t('countries.delete.title')"
      :message="$t('countries.delete.message')"
      :confirm-label="$t('countries.delete.confirm')"
      :cancel-label="$t('countries.delete.cancel')"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
