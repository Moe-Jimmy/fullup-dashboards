import type { SidebarLink } from "../../shared/types/navigation";

// Helper each app uses to build sidebar link entries. Label is resolved from
// the shared i18n namespace `dashboard.sidebar.items.*` — every dashboard
// defines its own keys under that namespace.
export const useSidebarLink = () => {
  const route = useRoute();
  const { t } = useI18n();
  const localePath = useLocalePath();

  const link = (
    key: string,
    labelKey: string,
    icon: string,
    opts: { to?: string; active?: boolean; danger?: boolean } = {},
  ): SidebarLink => {
    const to = opts.to || localePath("/");
    const isRoot = to === localePath("/");
    return {
      type: "link",
      key,
      label: t(`dashboard.sidebar.items.${labelKey}`),
      icon,
      to,
      active:
        opts.active ?? (isRoot ? route.path === to : route.path.startsWith(to)),
      ...opts,
    };
  };

  return { link };
};
