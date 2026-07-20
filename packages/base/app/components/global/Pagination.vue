<script setup lang="ts">

// prev/next controls (long arrow + label + background). reka-ui's
// PaginationPrev/Next forward `disabled` onto the slot buttons via
// as-child, so they auto-disable at the first / last page.
const page = defineModel<number>("page", { default: 1 });

const props = withDefaults(
  defineProps<{
    total: number;
    itemsPerPage?: number;
    siblingCount?: number;
    showEdges?: boolean;
  }>(),
  { itemsPerPage: 10, siblingCount: 2, showEdges: true },
);

const { t, locale } = useI18n();


const isSm = useMediaQuery("(min-width: 640px)");
const effSiblingCount = computed(() => (isSm.value ? props.siblingCount : 1));
const effShowEdges = computed(() => (isSm.value ? props.showEdges : false));

const isRtl = computed(() => locale.value === "ar");
const prevIcon = computed(() =>
  isRtl.value ? "i-lucide-arrow-right" : "i-lucide-arrow-left",
);
const nextIcon = computed(() =>
  isRtl.value ? "i-lucide-arrow-left" : "i-lucide-arrow-right",
);

const ctrlClass =
  "font-medium flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors gap-1.5 ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted px-3 py-1.5  text-sm cursor-pointer rounded-md";
</script>

<template>
  <UPagination
    v-model:page="page"
    :total="total"
    :items-per-page="itemsPerPage"
    :sibling-count="effSiblingCount"
    :show-edges="effShowEdges"
    :dir="isRtl ? 'rtl' : 'ltr'"
    color="neutral"
    variant="outline"
    active-color="primary"
    active-variant="solid"
    :ui="{
      list: 'gap-2',
      item: 'size-8 text-sm cursor-pointer  data-[selected=true]:text-white rounded-md',
      last:'hidden',
      first:'hidden',

      ellipsis: 'text-t-sec',
    }"
  >
    <template #prev>
      <button type="button" :class="ctrlClass">
        <UIcon :name="prevIcon" class="size-4" />
        <span>{{ t("common.pagination.prev") }}</span>
      </button>
    </template>
    <template #next>
      <button type="button" :class="ctrlClass">
        <span>{{ t("common.pagination.next") }}</span>
        <UIcon :name="nextIcon" class="size-4" />
      </button>
    </template>
  </UPagination>
</template>
