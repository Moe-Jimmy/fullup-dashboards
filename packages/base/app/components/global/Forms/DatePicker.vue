<script setup lang="ts">
import { CalendarDate, type DateValue } from "@internationalized/date";

const model = defineModel<string>({ default: "" });

const { locale } = useI18n();

const inputDate = useTemplateRef("inputDate");

const internalValue = ref<DateValue | undefined>();

// Sync string model → CalendarDate
watch(
  model,
  (val) => {
    if (!val) {
      internalValue.value = undefined;
      return;
    }
    const [y, m, d] = val.split("-").map(Number);
    if (y && m && d) {
      internalValue.value = new CalendarDate(y, m, d);
    }
  },
  { immediate: true },
);

// Sync CalendarDate → string model
watch(internalValue, (val) => {
  if (!val) {
    model.value = "";
    return;
  }
  const y = String(val.year).padStart(4, "0");
  const m = String(val.month).padStart(2, "0");
  const d = String(val.day).padStart(2, "0");
  model.value = `${y}-${m}-${d}`;
});
</script>

<template>
  <UInputDate
    ref="inputDate"
    v-model="internalValue"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
    :locale="locale"
    :ui="{
      base: 'w-full h-[52px] rounded-xl text-t-white bg-transparent',
      segment:
        'text-t-white data-[placeholder]:text-t-placeholder focus:bg-primary/20 rounded text-nowrap data-[segment=month]:w-8 data-[segment=year]:w-10',
    }"
  >
    <template #trailing>
      <UPopover
        :reference="inputDate?.inputsRef[3]?.$el"
        :dir="locale === 'ar' ? 'rtl' : 'ltr'"
        :content="{
          align: 'start',
          sideOffset: 22,
          alignOffset: -80,
        }"
        :ui="{
          content:
            'w-[275px] sm:w-[555px] md:w-[310px] lg:w-[392px] bg-bg-landingpage',
        }"
      >
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar"
          :aria-label="locale === 'ar' ? 'اختر تاريخ' : 'Select a date'"
          class="px-0 text-t-white"
        />

        <template #content>
          <UCalendar
            v-model="internalValue"
            :locale="locale"
            class="p-2"
            :ui="{
              body: 'bg-bg-landingpage',
              heading: 'text-t-white',
              cell: 'text-t-white',
            }"
          />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
