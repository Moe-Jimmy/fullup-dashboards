import type { CropState } from "../../shared/types/media";
export function useCroppableImage(
  initialUrl?: MaybeRefOrGetter<string | null | undefined>,
) {
  const sourceFile = ref<File | null>(null);
  const sourceUrl = ref<string | null>(null);
  const serverUrl = ref<string | null>(toValue(initialUrl) ?? null);
  const croppedUrl = ref<string | null>(null);
  const cropState = ref<CropState | null>(null);
  const cropOpen = ref(false);
  const file = ref<File | null>(null);

  function revoke() {
    if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value);
    sourceUrl.value = null;
  }

  watch(sourceFile, (next) => {
    revoke();
    sourceUrl.value = next ? URL.createObjectURL(next) : null;
    croppedUrl.value = null;
    cropState.value = null;
    serverUrl.value = null;
    file.value = next;
  });

  watch(
    () => toValue(initialUrl) ?? null,
    (next) => {
      if (!sourceFile.value && !croppedUrl.value) serverUrl.value = next;
    },
  );

  onBeforeUnmount(revoke);

  const cropSource = computed(() => sourceUrl.value ?? serverUrl.value);
  const preview = computed(() => croppedUrl.value ?? cropSource.value);

  function onCropped(next: File, dataUrl: string) {
    file.value = next;
    croppedUrl.value = dataUrl;
  }

  function clear() {
    revoke();
    sourceFile.value = null;
    serverUrl.value = null;
    croppedUrl.value = null;
    cropState.value = null;
    file.value = null;
  }

  return {
    sourceFile,
    file,
    cropSource,
    preview,
    cropState,
    cropOpen,
    onCropped,
    clear,
  };
}
