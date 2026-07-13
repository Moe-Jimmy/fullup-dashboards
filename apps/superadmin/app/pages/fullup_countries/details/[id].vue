<script setup lang="ts">
import type {
  Country,
  City,
  Zone,
  CityFormData,
  ZoneFormData,
  SelectOption,
} from "~~/shared/types/countries";

definePageMeta({
  title: ["dashboard.pages.countries", "countryDetails.title"],
});

const route = useRoute();
const { t, locale } = useI18n();

// TODO: replace mock with real fetch by id when the API is wired.
const country = reactive<Country>({
  id: Number(route.params.id) || 1,
  nameAr: "السعودية",
  nameEn: "Saudi Arabia",
  code: "+966",
  citiesCount: 2,
  zonesCount: 3,
  creator: "أحمد محمد",
  createdAt: "21 فبراير 2025 - 5:05 ص",
});

const cities = ref<City[]>([
  { id: 1, code: "RUH", nameAr: "الرياض", nameEn: "Riyadh", countryId: country.id, createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 2, code: "JED", nameAr: "جدة", nameEn: "Jeddah", countryId: country.id, createdAt: "21 فبراير 2025 - 5:05 ص" },
]);

const zones = ref<Zone[]>([
  { id: 1, nameAr: "العليا", nameEn: "Olaya", cityId: 1, createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 2, nameAr: "الروضة", nameEn: "Al Rawdah", cityId: 2, createdAt: "21 فبراير 2025 - 5:05 ص" },
  { id: 3, nameAr: "السلامة", nameEn: "Al Salamah", cityId: 2, createdAt: "21 فبراير 2025 - 5:05 ص" },
]);

const countryName = computed(() =>
  locale.value === "ar" ? country.nameAr : country.nameEn,
);
const cityName = (c: City) => (locale.value === "ar" ? c.nameAr : c.nameEn);

const countryOptions = computed<SelectOption[]>(() => [
  { id: country.id, label: countryName.value, value: country.id },
]);
const cityOptions = computed<SelectOption[]>(() =>
  cities.value.map((c) => ({ id: c.id, label: cityName(c), value: c.id })),
);
const cityNameMap = computed<Record<number, string>>(() =>
  Object.fromEntries(cities.value.map((c) => [c.id, cityName(c)])),
);

let nextId = 1;
const genId = () => Date.now() + nextId++;
const today = () => new Date().toISOString().slice(0, 10);

// --- City modal ---
const cityModalOpen = ref(false);
const cityMode = ref<"add" | "edit">("add");
const editingCity = ref<City | null>(null);

function openAddCity() {
  cityMode.value = "add";
  editingCity.value = null;
  cityModalOpen.value = true;
}
function openEditCity(city: City) {
  cityMode.value = "edit";
  editingCity.value = city;
  cityModalOpen.value = true;
}
function onCitySubmit(data: CityFormData & { id?: number }) {
  if (data.id != null) {
    const idx = cities.value.findIndex((c) => c.id === data.id);
    if (idx !== -1)
      cities.value[idx] = { ...cities.value[idx]!, code: data.code, nameAr: data.nameAr, nameEn: data.nameEn };
  } else {
    cities.value.push({
      id: genId(),
      code: data.code,
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      countryId: country.id,
      createdAt: today(),
    });
  }
  // TODO: POST/PATCH /cities
}

// --- Zone modal ---
const zoneModalOpen = ref(false);
const zoneMode = ref<"add" | "edit">("add");
const editingZone = ref<Zone | null>(null);

function openAddZone() {
  zoneMode.value = "add";
  editingZone.value = null;
  zoneModalOpen.value = true;
}
function openEditZone(zone: Zone) {
  zoneMode.value = "edit";
  editingZone.value = zone;
  zoneModalOpen.value = true;
}
function onZoneSubmit(data: ZoneFormData & { id?: number }) {
  if (data.id != null) {
    const idx = zones.value.findIndex((z) => z.id === data.id);
    if (idx !== -1)
      zones.value[idx] = { ...zones.value[idx]!, nameAr: data.nameAr, nameEn: data.nameEn, cityId: Number(data.cityId) };
  } else {
    zones.value.push({
      id: genId(),
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      cityId: Number(data.cityId),
      createdAt: today(),
    });
  }
  // TODO: POST/PATCH /zones
}

// --- Delete confirmation (shared) ---
const deleteOpen = ref(false);
const pendingDelete = ref<{ type: "city" | "zone"; id: number } | null>(null);

function askDeleteCity(city: City) {
  pendingDelete.value = { type: "city", id: city.id };
  deleteOpen.value = true;
}
function askDeleteZone(zone: Zone) {
  pendingDelete.value = { type: "zone", id: zone.id };
  deleteOpen.value = true;
}
function onDeleteConfirm() {
  const p = pendingDelete.value;
  if (!p) return;
  if (p.type === "city") {
    cities.value = cities.value.filter((c) => c.id !== p.id);
    zones.value = zones.value.filter((z) => z.cityId !== p.id);
  } else {
    zones.value = zones.value.filter((z) => z.id !== p.id);
  }
  deleteOpen.value = false;
  pendingDelete.value = null;
}
const deleteTexts = computed(() => {
  const type = pendingDelete.value?.type ?? "city";
  return {
    title: t(`addCountry.delete.${type}.title`),
    message: t(`addCountry.delete.${type}.message`),
    confirm: t(`addCountry.delete.${type}.confirm`),
  };
});
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Country header -->
    <div class="bg-bg-landingpage rounded-2xl border border-default">
      <div class="flex items-center justify-between p-6">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-info" class="text-t-brand size-5" />
          <h2 class="text-t-sec font-semibold text-lg">
            {{ $t("countryDetails.title") }}
          </h2>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLinkLocale
            :to="{
              path: '/fullup_countries/add_new_country',
              query: { mode: 'update', id: country.id },
            }"
            class="primary-btn py-1.5!"
          >
            {{ $t("countryDetails.editData") }}
          </NuxtLinkLocale>
          <NuxtLinkLocale
            to="/fullup_countries"
            class="size-10 rounded-full border border-default flex items-center justify-center text-t-primary-gray hover:bg-primary/10 transition-colors"
          >
            <UIcon name="i-lucide-arrow-right" class="size-5 rtl:rotate-180" />
          </NuxtLinkLocale>
        </div>
      </div>

      <div class="px-6 py-5 border-t border-default grid grid-cols-1 md:grid-cols-4 gap-5">
        <DetailsInfo
          :label="$t('countryDetails.fields.nameAr')"
          :value="country.nameAr"
          icon="i-lucide-globe"
        />
        <DetailsInfo
          :label="$t('countryDetails.fields.nameEn')"
          :value="country.nameEn"
          icon="i-lucide-globe"
        />
        <DetailsInfo
          :label="$t('countryDetails.fields.code')"
          :value="country.code"
          icon="i-lucide-phone"
        />
        <DetailsInfo
          :label="$t('countryDetails.fields.citiesCount')"
          :value="String(cities.length)"
          icon="i-lucide-building-2"
        />
        <DetailsInfo
          :label="$t('countryDetails.fields.zonesCount')"
          :value="String(zones.length)"
          icon="i-lucide-map"
        />
        <DetailsInfo
          :label="$t('countryDetails.fields.createdAt')"
          :value="country.createdAt"
          icon="i-lucide-calendar"
        />
      </div>
    </div>

    <!-- Cities -->
    <div class="bg-bg-landingpage rounded-2xl p-4 border border-default">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-building-2" class="text-t-sec size-5" />
          <h3 class="text-t-white font-semibold text-base">
            {{ $t("countryDetails.cities.title") }}
          </h3>
        </div>
        <button
          type="button"
          class="flex items-center gap-2 border border-dashed border-primary text-primary rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-primary/10 transition-colors cursor-pointer"
          @click="openAddCity"
        >
          <UIcon name="i-lucide-circle-plus" class="size-5" />
          {{ $t("countryDetails.cities.addNew") }}
        </button>
      </div>
      <CountriesCitiesTable
        :data="cities"
        @edit="openEditCity"
        @delete="askDeleteCity"
      />
    </div>

    <!-- Zones -->
    <div class="bg-bg-landingpage rounded-2xl p-4 border border-default">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-map" class="text-t-sec size-5" />
          <h3 class="text-t-white font-semibold text-base">
            {{ $t("countryDetails.zones.title") }}
          </h3>
        </div>
        <button
          type="button"
          class="flex items-center gap-2 border border-dashed border-primary text-primary rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-primary/10 transition-colors cursor-pointer"
          @click="openAddZone"
        >
          <UIcon name="i-lucide-circle-plus" class="size-5" />
          {{ $t("countryDetails.zones.addNew") }}
        </button>
      </div>
      <CountriesZonesTable
        :data="zones"
        :city-names="cityNameMap"
        @edit="openEditZone"
        @delete="askDeleteZone"
      />
    </div>

    <!-- City modal -->
    <CountriesAddCityModal
      v-model:open="cityModalOpen"
      :mode="cityMode"
      :countries="countryOptions"
      :country-id="country.id"
      :city="editingCity"
      lock-country
      @submit="onCitySubmit"
    />

    <!-- Zone modal -->
    <CountriesAddZoneModal
      v-model:open="zoneModalOpen"
      :mode="zoneMode"
      :cities="cityOptions"
      :zone="editingZone"
      @submit="onZoneSubmit"
    />

    <!-- Delete city / zone -->
    <ConfirmDialog
      v-model:open="deleteOpen"
      :title="deleteTexts.title"
      :message="deleteTexts.message"
      :confirm-label="deleteTexts.confirm"
      :cancel-label="$t('addCountry.delete.cancel')"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>