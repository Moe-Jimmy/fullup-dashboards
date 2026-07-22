import type { TableAlign } from "../../shared/types/table";

/**
 * RTL-aware alignment helpers for tables.
 *
 * `start`/`end` are **logical** — they flip with the locale direction.
 * `left`/`right` are **physical** — always that visual side. Flex content
 * (actions, toggles, header zones) maps physical sides through the current
 * direction so they stay put in both LTR and RTL.
 */
export function useTableAlign() {
  const { locale } = useI18n();
  const isRtl = computed(() => locale.value === "ar");

  /** `text-align` class for cell/header text (and inline badges/switches). */
  function alignClass(align?: TableAlign) {
    switch (align) {
      case "center":
        return "text-center";
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "end":
        return "text-end";
      case "start":
        return "text-start";
      default:
        return "text-start"; // default follows reading direction
    }
  }

  /** `justify-content` class for flex content (actions, toggle, header zones). */
  function justifyClass(align?: TableAlign) {
    switch (align) {
      case "center":
        return "justify-center";
      case "end":
        return "justify-end";
      case "start":
        return "justify-start";
      case "left":
        return isRtl.value ? "justify-end" : "justify-start";
      case "right":
        return isRtl.value ? "justify-start" : "justify-end";
      default:
        return "justify-start";
    }
  }

  return { isRtl, alignClass, justifyClass };
}
