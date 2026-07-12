<script setup lang="ts">
import type {
  CountryFormData,
  CountryFormMode,
  City,
  Zone,
} from "~~/shared/types/countries";

const route = useRoute();

const mode = computed<CountryFormMode>(() =>
  route.query.mode === "update" ? "update" : "add",
);

const countryId = computed(() =>
  route.query.id ? Number(route.query.id) : undefined,
);

definePageMeta({
  title: ["dashboard.pages.countries", "dashboard.pages.addNewCountry"],
});

// TODO: replace with real fetch by id when the API is wired.
function loadCountryForUpdate(_id: number): {
  data: Partial<CountryFormData>;
  cities: City[];
  zones: Zone[];
} {
  return {
    data: { nameAr: "السعودية", nameEn: "Saudi Arabia", code: "SA" },
    cities: [
      { id: 1, code: "RUH", nameAr: "الرياض", nameEn: "Riyadh", countryId: _id },
      { id: 2, code: "JED", nameAr: "جدة", nameEn: "Jeddah", countryId: _id },
    ],
    zones: [
      { id: 1, nameAr: "العليا", nameEn: "Olaya", cityId: 1 },
      { id: 2, nameAr: "الروضة", nameEn: "Al Rawdah", cityId: 2 },
    ],
  };
}

const loaded = computed(() =>
  mode.value === "update" && countryId.value
    ? loadCountryForUpdate(countryId.value)
    : undefined,
);
</script>

<template>
  <CountriesForm
    :mode="mode"
    :country-id="countryId"
    :initial-data="loaded?.data"
    :initial-cities="loaded?.cities"
    :initial-zones="loaded?.zones"
  />
</template>