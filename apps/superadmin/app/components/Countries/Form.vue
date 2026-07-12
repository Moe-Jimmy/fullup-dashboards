<script setup lang="ts">
import * as z from "zod";
import type {
  City,
  Zone,
  CountryFormData,
  CountryFormMode,
  CityFormData,
  ZoneFormData,
  SelectOption,
} from "~~/shared/types/countries";

const props = withDefaults(
  defineProps<{
    mode?: CountryFormMode;
    initialData?: Partial<CountryFormData>;
    countryId?: number;
    initialCities?: City[];
    initialZones?: Zone[];
  }>(),
  { mode: "add" },
);

const { t, locale } = useI18n();
const isUpdate = computed(() => props.mode === "update");

// --- Country form ---
const state = reactive<CountryFormData>({
  nameAr: props.initialData?.nameAr ?? "",
  nameEn: props.initialData?.nameEn ?? "",
  code: props.initialData?.code ?? "",
});

// The country must be saved before cities can be added; in update mode it
// already exists, so treat it as saved from the start.
const savedCountryId = ref<number | null>(
  isUpdate.value && props.countryId ? props.countryId : null,
);
const countrySaved = computed(() => savedCountryId.value !== null);

const schema = computed(() => {
  const req = t("addCountry.validation.required");
  return z.object({
    nameAr: z.string().min(1, req),
    nameEn: z.string().min(1, req),
    code: z.string().min(1, req),
  });
});

function onCountrySubmit() {
  if (isUpdate.value) {
    console.log("Update country:", props.countryId, { ...state });
    // TODO: PATCH /countries/{id}
    return;
  }
  console.log("Create country:", { ...state });
  // TODO: POST /countries — use the returned id instead of this mock.
  savedCountryId.value = Date.now();
}

// --- Added cities & zones ---
const cities = ref<City[]>(props.initialCities ? [...props.initialCities] : []);
const zones = ref<Zone[]>(props.initialZones ? [...props.initialZones] : []);

const cityName = (c: City) => (locale.value === "ar" ? c.nameAr : c.nameEn);

const canAddCity = computed(() => countrySaved.value);
const canAddZone = computed(() => cities.value.length > 0);

const countryOptions = computed<SelectOption[]>(() => {
  if (savedCountryId.value === null) return [];
  const label = locale.value === "ar" ? state.nameAr : state.nameEn;
  return [{ id: savedCountryId.value, label, value: savedCountryId.value }];
});

const cityOptions = computed<SelectOption[]>(() =>
  cities.value.map((c) => ({ id: c.id, label: cityName(c), value: c.id })),
);

const cityNameMap = computed<Record<number, string>>(() =>
  Object.fromEntries(cities.value.map((c) => [c.id, cityName(c)])),
);

let nextId = 1;
const genId = () => Date.now() + nextId++;

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
      countryId: Number(data.countryId),
    });
  }
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
    });
  }
}

// --- Delete confirmation (shared for cities & zones) ---
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
    // drop zones that belonged to the removed city
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
    <div class="bg-bg-landingpage rounded-2xl p-6 border border-default">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-2">
          <UIcon
            :name="isUpdate ? 'i-lucide-pencil' : 'i-lucide-circle-plus'"
            class="text-t-sec size-5"
          />
          <h2 class="text-t-white font-semibold text-lg">
            {{ isUpdate ? $t("addCountry.updateTitle") : $t("addCountry.title") }}
          </h2>
        </div>
        <NuxtLinkLocale
          to="/fullup_countries"
          class="size-10 rounded-full border border-default flex items-center justify-center text-t-white hover:bg-primary/10 transition-colors"
        >
          <UIcon name="i-lucide-arrow-right" class="size-5 rtl:rotate-180" />
        </NuxtLinkLocale>
      </div>

      <!-- Country fields -->
      <UForm :schema="schema" :state="state" @submit="onCountrySubmit">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FormsLocaleInput
            v-model:ar="state.nameAr"
            v-model:en="state.nameEn"
            :label="$t('addCountry.fields.name')"
            name="name"
            :placeholder="$t('addCountry.placeholders.name')"
          />
          <FormsTextInput
            v-model="state.code"
            :label="$t('addCountry.fields.code')"
            name="code"
            :placeholder="$t('addCountry.placeholders.code')"
          />
        </div>

        <div class="flex justify-end">
          <UButton
            type="submit"
            :label="
              isUpdate
                ? $t('addCountry.update')
                : countrySaved
                  ? $t('addCountry.saved')
                  : $t('addCountry.save')
            "
            class="gradient-btn px-12!"
          />
        </div>
      </UForm>
    </div>

    <!-- Added cities -->
    <div class="bg-bg-landingpage rounded-2xl p-4 border border-default">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-t-white font-semibold text-base">
          {{ $t("addCountry.citiesSection", { count: cities.length }) }}
        </h3>
        <button
          type="button"
          :disabled="!canAddCity"
          :title="!canAddCity ? $t('addCountry.hints.saveCountryFirst') : ''"
          class="flex items-center gap-2 border border-dashed border-primary text-primary rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
          @click="openAddCity"
        >
          <UIcon name="i-lucide-circle-plus" class="size-5" />
          {{ $t("addCountry.addCity") }}
        </button>
      </div>
      <CountriesCitiesTable
        :data="cities"
        @edit="openEditCity"
        @delete="askDeleteCity"
      />
    </div>

    <!-- Added zones -->
    <div class="bg-bg-landingpage rounded-2xl p-4 border border-default">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-t-white font-semibold text-base">
          {{ $t("addCountry.zonesSection", { count: zones.length }) }}
        </h3>
        <button
          type="button"
          :disabled="!canAddZone"
          :title="!canAddZone ? $t('addCountry.hints.addCityFirst') : ''"
          class="flex items-center gap-2 border border-dashed border-primary text-primary rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
          @click="openAddZone"
        >
          <UIcon name="i-lucide-circle-plus" class="size-5" />
          {{ $t("addCountry.addZone") }}
        </button>
      </div>
      <CountriesZonesTable
        :data="zones"
        :city-names="cityNameMap"
        @edit="openEditZone"
        @delete="askDeleteZone"
      />
    </div>

    <!-- City modal (country locked to this country) -->
    <CountriesAddCityModal
      v-model:open="cityModalOpen"
      :mode="cityMode"
      :countries="countryOptions"
      :country-id="savedCountryId"
      :city="editingCity"
      lock-country
      @submit="onCitySubmit"
    />

    <!-- Zone modal (cities from this country) -->
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