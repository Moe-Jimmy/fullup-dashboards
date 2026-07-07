// Provider sidebar menu.
export default defineAppConfig({
  sidebar: [
    { label: "Overview", to: "/", icon: "i-lucide-layout-dashboard" },
    { label: "Orders", to: "/orders", icon: "i-lucide-clipboard-list" },
    { label: "Services", to: "/services", icon: "i-lucide-briefcase" },
    { label: "Settings", to: "/settings", icon: "i-lucide-settings" },
  ],
});
