// Admin (franchise) sidebar menu.
export default defineAppConfig({
  sidebar: [
    { label: "Overview", to: "/", icon: "i-lucide-layout-dashboard" },
    { label: "Companies", to: "/companies", icon: "i-lucide-building-2" },
    { label: "Providers", to: "/providers", icon: "i-lucide-contact" },
    { label: "Settings", to: "/settings", icon: "i-lucide-settings" },
  ],
});
