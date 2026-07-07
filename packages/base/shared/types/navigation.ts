// Shared dashboard sidebar model. Consumed by the base LayoutDashboardSidebar
// shell; each app builds its own entries in a useDashboardNav() override.
export interface SidebarLink {
  type: "link";
  key: string;
  label: string;
  icon: string;
  to: string;
  active?: boolean;
  danger?: boolean;
}

export interface SidebarGroup {
  type: "group";
  key: string;
  label: string;
  items: SidebarLink[];
}

export type SidebarEntry = SidebarLink | SidebarGroup;
