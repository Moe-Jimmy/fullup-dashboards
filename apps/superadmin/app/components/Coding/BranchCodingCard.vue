<script setup lang="ts">
import type { BranchCoding } from "~~/shared/types/coding";

const props = defineProps<{ branch: BranchCoding }>();

const emit = defineEmits<{
  view: [id: number];
  save: [payload: { id: number; mainCode: string }];
}>();

const editing = ref(false);
const draftCode = ref(props.branch.mainCode);

watch(
  () => props.branch.mainCode,
  (code) => {
    if (!editing.value) draftCode.value = code;
  },
);

function toggleEdit() {
  if (editing.value) {
    emit("save", { id: props.branch.id, mainCode: draftCode.value.trim() });
    editing.value = false;
  } else {
    draftCode.value = props.branch.mainCode;
    editing.value = true;
  }
}
</script>

<template>
  <div
    class="bg-bg-pages border-[0.2px] border-t-placeholder rounded-lg p-5 flex flex-col justify-between gap-8"
  >
    <div class="flex flex-col gap-4">
      <!-- Main branch code (editable inline) -->
      <div class="flex flex-col gap-2">
        <label class="text-t-sec font-medium text-sm ">
          {{ $t("coding.fields.mainCode") }}
        </label>
        <input
          v-if="editing"
          v-model="draftCode"
          type="text"
          class="h-[53px] w-full rounded-lg border-[0.2px] border-primary bg-bg-landingpage px-3 text-lg font-extrabold text-t-white  outline-none focus:border-primary"
        >
        <div
          v-else
          class="h-[53px] w-full rounded-lg border-[0.2px] border-t-placeholder bg-bg-landingpage px-3 flex items-center  text-lg font-extrabold text-t-white"
        >
          {{ branch.mainCode }}
        </div>
      </div>

      <!-- Branch name (read-only, localized by backend) -->
      <div class="flex flex-col gap-2">
        <label class="text-t-sec font-medium text-sm  ">
          {{ $t("coding.fields.branchName") }}
        </label>
        <div
          class="h-[53px] w-full rounded-lg border-[0.2px] border-t-placeholder bg-bg-landingpage px-3 flex items-center  text-lg font-extrabold text-t-white"
        >
          {{ branch.branchName }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between">
      <button
        type="button"
        class="flex items-center gap-2 text-xs cursor-pointer transition-colors"
        :class="editing ? 'text-primary font-medium' : 'text-t-white hover:text-primary'"
        @click="toggleEdit"
      >
      <UIcon
        :name="editing ? 'i-lucide-check' : 'i-lucide-pencil'"
        class="size-4 text-primary"
      />
        <span>{{ editing ? $t("coding.card.save") : $t("coding.card.edit") }}</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-2 text-t-white text-xs cursor-pointer hover:text-primary transition-colors"
        @click="emit('view', branch.id)"
      >
      <UIcon name="i-lucide-eye" class="size-4 text-primary" />
        <span>{{ $t("coding.card.view") }}</span>
      </button>
    </div>
  </div>
</template>
