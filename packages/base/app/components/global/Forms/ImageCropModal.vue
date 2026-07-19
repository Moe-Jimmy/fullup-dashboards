<script setup lang="ts">
import type { CropState } from "../../../../shared/types/media";

const open = defineModel<boolean>("open", { default: false });

/** Last saved pan/zoom. Lets the caller re-open on the ORIGINAL image without
 *  losing the previous framing — crops never compound. */
const cropState = defineModel<CropState | null>("crop", { default: null });

const props = withDefaults(
  defineProps<{
    src: string | File | Blob | null;
    aspectRatio?: number;
    outputType?: string;
    quality?: number;
    title?: string;
    maxZoom?: number;
  }>(),
  {
    aspectRatio: 483 / 292,
    outputType: "image/png",
    quality: 0.92,
    title: "",
    maxZoom: 4,
  },
);

const emit = defineEmits<{ cropped: [file: File, dataUrl: string] }>();

const { t } = useI18n();

/* ---- geometry ---- */

/** Stage is the dark area; the crop frame sits centred inside it. */
const STAGE_W = 620;
const STAGE_H = 438;
const FRAME_INSET = 68;

const frameW = computed(() => {
  const w = STAGE_W - FRAME_INSET * 2;
  const h = w / props.aspectRatio;
  return h > STAGE_H - FRAME_INSET
    ? (STAGE_H - FRAME_INSET) * props.aspectRatio
    : w;
});
const frameH = computed(() => frameW.value / props.aspectRatio);

const stageImg = useTemplateRef<HTMLImageElement>("stageImg");
const objectUrl = ref<string | null>(null);
const imgSrc = ref<string | null>(null);
const natW = ref(0);
const natH = ref(0);

const zoom = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const dragging = ref(false);
const saving = ref(false);

const ready = computed(() => natW.value > 0 && natH.value > 0);

/** Scale at which the image exactly covers the frame. */
const baseScale = computed(() =>
  ready.value
    ? Math.max(frameW.value / natW.value, frameH.value / natH.value)
    : 1,
);
const scale = computed(() => baseScale.value * zoom.value);
const displayW = computed(() => natW.value * scale.value);
const displayH = computed(() => natH.value * scale.value);

const imageStyle = computed(() => ({
  width: `${displayW.value}px`,
  height: `${displayH.value}px`,
  transform: `translate(calc(-50% + ${offsetX.value}px), calc(-50% + ${offsetY.value}px))`,
}));

/** Keep the frame covered — the image can never expose an edge. */
function clampOffsets() {
  const maxX = Math.max(0, (displayW.value - frameW.value) / 2);
  const maxY = Math.max(0, (displayH.value - frameH.value) / 2);
  offsetX.value = Math.min(maxX, Math.max(-maxX, offsetX.value));
  offsetY.value = Math.min(maxY, Math.max(-maxY, offsetY.value));
}

watch(zoom, clampOffsets);

function reset() {
  zoom.value = 1;
  offsetX.value = 0;
  offsetY.value = 0;
}

function setZoom(next: number) {
  zoom.value = Math.min(props.maxZoom, Math.max(1, next));
}

/* ---- source ---- */

function releaseUrl() {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = null;
  }
}

function loadSource() {
  releaseUrl();
  natW.value = 0;
  natH.value = 0;
  reset();

  if (!props.src) {
    imgSrc.value = null;
    return;
  }
  if (typeof props.src === "string") {
    imgSrc.value = props.src;
    return;
  }
  objectUrl.value = URL.createObjectURL(props.src);
  imgSrc.value = objectUrl.value;
}

/** Measure the image, then restore the caller's framing (or centre). */
function syncFraming(el?: HTMLImageElement | null) {
  const img = el ?? stageImg.value;
  if (!img?.naturalWidth) return;
  natW.value = img.naturalWidth;
  natH.value = img.naturalHeight;

  if (!cropState.value) {
    reset();
    return;
  }
  zoom.value = Math.min(props.maxZoom, Math.max(1, cropState.value.zoom));
  offsetX.value = cropState.value.offsetX;
  offsetY.value = cropState.value.offsetY;
  clampOffsets();
}

watch(() => props.src, loadSource, { immediate: true });
watch(open, (isOpen) => {
  if (!isOpen) return;
  loadSource();
  // An already-decoded image fires no @load, so measure it directly.
  nextTick(() => syncFraming());
});
onBeforeUnmount(releaseUrl);

/* ---- pan / zoom ---- */

let startX = 0;
let startY = 0;
let startOffsetX = 0;
let startOffsetY = 0;

const pointers = new Map<number, { x: number; y: number }>();
let pinchStartDist = 0;
let pinchStartZoom = 1;

function pinchDistance() {
  const [a, b] = [...pointers.values()];
  if (!a || !b) return 0;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function onPointerDown(e: PointerEvent) {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) {
    dragging.value = false;
    pinchStartDist = pinchDistance();
    pinchStartZoom = zoom.value;
    return;
  }
  if (!ready.value) return;
  // Never capture from a control inside the stage: pointer capture retargets
  // the follow-up click to the stage, killing that button's @click.
  if ((e.target as HTMLElement).closest("button")) return;
  dragging.value = true;
  startX = e.clientX;
  startY = e.clientY;
  startOffsetX = offsetX.value;
  startOffsetY = offsetY.value;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (pointers.has(e.pointerId)) {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && pinchStartDist) {
      setZoom(pinchStartZoom * (pinchDistance() / pinchStartDist));
      return;
    }
  }
  if (!dragging.value) return;
  offsetX.value = startOffsetX + (e.clientX - startX);
  offsetY.value = startOffsetY + (e.clientY - startY);
  clampOffsets();
}

function onPointerUp(e: PointerEvent) {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinchStartDist = 0;
  if (!dragging.value) return;
  dragging.value = false;
  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
}

function onWheel(e: WheelEvent) {
  if (!ready.value) return;
  e.preventDefault();
  setZoom(zoom.value * (e.deltaY < 0 ? 1.08 : 1 / 1.08));
}

/* ---- export ---- */

async function save() {
  const el = stageImg.value;
  if (!el || !ready.value) return;

  saving.value = true;
  try {
    // Frame rectangle in the source image's own pixels, so the export keeps
    // full resolution instead of the on-screen preview size.
    const sx =
      (displayW.value / 2 - offsetX.value - frameW.value / 2) / scale.value;
    const sy =
      (displayH.value / 2 - offsetY.value - frameH.value / 2) / scale.value;
    const sw = frameW.value / scale.value;
    const sh = frameH.value / scale.value;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(el, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    const type = props.outputType;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, props.quality),
    );
    if (!blob) return;

    const ext = type.split("/")[1] ?? "png";
    cropState.value = {
      zoom: zoom.value,
      offsetX: offsetX.value,
      offsetY: offsetY.value,
    };
    emit(
      "cropped",
      new File([blob], `crop.${ext}`, { type }),
      canvas.toDataURL(type, props.quality),
    );
    open.value = false;
  } finally {
    saving.value = false;
  }
}

function cancel() {
  open.value = false;
}
</script>

<template>
  <UModal
    v-model:open="open"
    :close="false"
    :ui="{
      content:
        ' bg-bg-layout divide-y-0 ring-0 border-0 rounded-xl p-0 max-w-[680px] w-full mx-auto overflow-hidden',
      overlay: 'bg-black/60 backdrop-blur-sm',
    }"
  >
    <template #content>
      <div class="flex items-center justify-between px-5 pt-6 pb-4">
        <h3 class="text-t-white text-xl font-semibold">
          {{ title || t("common.crop.title") }}
        </h3>
        <button
          type="button"
          class="size-7 rounded-full hover:bg-bg-screen/5  flex items-center justify-center cursor-pointer  transition-colors"
          :aria-label="t('common.crop.close')"
          @click="cancel"
        >
          <UIcon name="i-lucide-x" class="size-4 text-t-white" />
        </button>
      </div>

      <div class="border-t border-t-placeholder/40" />

      <div class="px-5 py-5">
        <div
          class="relative mx-auto overflow-hidden select-none touch-none"
          :style="{ width: `${STAGE_W}px`, height: `${STAGE_H}px` }"
          :class="dragging ? 'cursor-grabbing' : 'cursor-grab'"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel="onWheel"
        >
          <img
            v-if="imgSrc"
            ref="stageImg"
            :src="imgSrc"
            alt=""
            crossorigin="anonymous"
            class="absolute left-1/2 top-1/2 max-w-none origin-center"
            :style="imageStyle"
            draggable="false"
            @load="syncFraming($event.target as HTMLImageElement)"
          />

          <!-- Frame + dim: one box-shadow paints everything outside the frame. -->
          <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.48)]"
            :style="{ width: `${frameW}px`, height: `${frameH}px` }"
          >
            <span
              class="absolute -top-px -left-px size-8 border-t-3 border-l-3 border-[#1a2733] dark:border-white rounded-tl-lg"
            />
            <span
              class="absolute -top-px -right-px size-8 border-t-3 border-r-3 border-[#1a2733] dark:border-white rounded-tr-lg"
            />
            <span
              class="absolute -bottom-px -left-px size-8 border-b-3 border-l-3 border-[#1a2733] dark:border-white rounded-bl-lg"
            />
            <span
              class="absolute -bottom-px -right-px size-8 border-b-3 border-r-3 border-[#1a2733] dark:border-white rounded-br-lg"
            />
          </div>

          <button
            type="button"
            class="absolute bottom-5 right-6 flex items-center gap-3 text-white text-lg cursor-pointer hover:opacity-80 transition-opacity"
            @click="reset"
          >
            <UIcon name="i-lucide-rotate-ccw" class="size-6" />
            {{ t("common.crop.reset") }}
          </button>
        </div>

        <div dir="ltr" class="flex items-center gap-4 mx-auto mt-5 px-1" :style="{ width: `${STAGE_W}px` }">
          <UIcon name="i-lucide-image" class="size-4 text-t-sec shrink-0" />
          <input
            v-model.number="zoom"
            type="range"
            min="1"
            :max="maxZoom"
            step="0.01"
            class="zoom-range flex-1"
            :aria-label="t('common.crop.zoom')"
          />
          <UIcon name="i-lucide-image" class="size-6 text-t-sec shrink-0" />
        </div>
      </div>

      <div class="border-t border-t-placeholder/40" />

      <div class="flex gap-4 px-12 py-5">
        <button
          type="button"
          :disabled="saving"
          class="flex-1 h-12 rounded-lg bg-primary text-white font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          @click="save"
        >
          {{ t("common.crop.save") }}
        </button>
        <button
          type="button"
          class="flex-1 h-12 rounded-lg border-[0.5px] border-t-sec text-t-sec text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          @click="cancel"
        >
          {{ t("common.crop.discard") }}
        </button>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.zoom-range {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 9999px;
  background: var(--color-bg-icon-gray, #e3e5e5);
  cursor: pointer;
}

.zoom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  background: var(--color-primary);
  cursor: pointer;
}

.zoom-range::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 9999px;
  background: var(--color-primary);
  cursor: pointer;
}
</style>
