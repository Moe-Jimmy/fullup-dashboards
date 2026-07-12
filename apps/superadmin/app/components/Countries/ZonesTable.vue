<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Zone } from "~~/shared/types/countries";

const props = defineProps<{
  data: Zone[];
  // Map of cityId -> display name, so the zone row can show its parent city.
  cityNames?: Record<number, string>;
}>();

const emit = defineEmits<{ edit: [zone: Zone]; delete: [zone: Zone] }>();

const { t } = useI18n();

function cityName(id: number) {
  return props.cityNames?.[id] ?? "-";
}

const columns = computed<TableColumn<Zone>[]>(() => [
  { accessorKey: "id", header: t("countryDetails.zones.columns.id") },
  { accessorKey: "nameAr", header: t("countryDetails.zones.columns.nameAr") },
  { accessorKey: "nameEn", header: t("countryDetails.zones.columns.nameEn") },
  { accessorKey: "cityId", header: t("countryDetails.zones.columns.city") },
  { id: "actions", header: t("countryDetails.zones.columns.actions") },
]);
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    :ui="{
      th: 'text-t-primary-gray font-medium text-sm py-3',
      td: 'text-t-primary-gray text-sm py-4',
      tr: 'border-b border-black/5 dark:border-white/5 last:border-0',
    }"
  >
    <template #cityId-cell="{ row }">
      {{ cityName(row.original.cityId) }}
    </template>

    <template #actions-cell="{ row }">
      <div class="flex items-center gap-2">
        <button
          class="size-8 rounded-xl bg-purple-bg flex items-center justify-center text-t-purple hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          @click="emit('edit', row.original)"
        >
          <UIcon name="i-lucide-pencil" class="size-4" />
        </button>
        <button
          class="size-8 rounded-xl bg-red-bg flex items-center justify-center text-t-red hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          @click="emit('delete', row.original)"
        >
          <UIcon name="i-lucide-trash-2" class="size-4" />
        </button>
      </div>
    </template>

    <template #empty>
      <div class="py-8 text-center text-t-sec text-sm">
        {{ $t("countryDetails.zones.empty") }}
      </div>
    </template>
  </UTable>
</template>