<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { City } from "~~/shared/types/countries";

defineProps<{ data: City[] }>();

const emit = defineEmits<{ edit: [city: City]; delete: [city: City] }>();

const { t } = useI18n();

const columns = computed<TableColumn<City>[]>(() => [
  { accessorKey: "id", header: t("countryDetails.cities.columns.id") },
  { accessorKey: "code", header: t("countryDetails.cities.columns.code") },
  { accessorKey: "nameAr", header: t("countryDetails.cities.columns.nameAr") },
  { accessorKey: "nameEn", header: t("countryDetails.cities.columns.nameEn") },
  { id: "actions", header: t("countryDetails.cities.columns.actions") },
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
        {{ $t("countryDetails.cities.empty") }}
      </div>
    </template>
  </UTable>
</template>