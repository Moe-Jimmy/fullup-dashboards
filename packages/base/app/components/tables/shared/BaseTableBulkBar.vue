<!--
  BaseTableBulkBar — animated bar showing selected count + bulk action buttons.
-->
<script setup lang="ts">
import type { TableBulkAction } from "@fullup/base/types";

defineProps<{
  show: boolean;
  selectedCount: number;
  bulkActions: TableBulkAction[];
}>();

const emit = defineEmits<{
  execute: [TableBulkAction];
  clear: [];
}>();

const { t } = useTableContext();
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="show"
      class="mb-4 mx-2 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3"
    >
      <span class="text-sm font-medium text-t-white">
        {{ t("common.table.selected") }}:
        <span class="font-bold text-primary">{{ selectedCount }}</span>
      </span>

      <div class="flex items-center gap-2 ms-auto">
        <slot name="bulk-actions">
          <button
            v-for="(action, i) in bulkActions"
            :key="i"
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            :class="ACTION_CLASS[action.variant || 'default']"
            :title="action.label"
            @click="emit('execute', action)"
          >
            <UIcon :name="action.icon" class="size-4" />
            {{ action.label }}
          </button>
        </slot>

        <button
          type="button"
          class="size-8 rounded-lg flex items-center justify-center text-t-sec hover:text-t-white hover:bg-black/5 transition-colors cursor-pointer ms-1"
          :title="t('common.table.clearSelection')"
          @click="emit('clear')"
        >
          <UIcon name="i-lucide-x" class="size-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>
