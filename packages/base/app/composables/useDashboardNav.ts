import type { ComputedRef } from "vue";
import type { SidebarEntry } from "../../shared/types/navigation";

// Default (empty) dashboard navigation. Each app OVERRIDES this file by
// defining its own app/composables/useDashboardNav.ts — the app layer's
// version wins over the base layer's auto-import.
export const useDashboardNav = (): ComputedRef<SidebarEntry[]> => {
  return computed<SidebarEntry[]>(() => []);
};
