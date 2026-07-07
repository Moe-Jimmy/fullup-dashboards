// Company sidebar menu.
export default defineAppConfig({
  sidebar: [
    { label: "Overview", to: "/", icon: "i-lucide-layout-dashboard" },
    { label: "Branches", to: "/branches", icon: "i-lucide-git-branch" },
    { label: "Services", to: "/services", icon: "i-lucide-briefcase" },
    { label: "Settings", to: "/settings", icon: "i-lucide-settings" },
  ],
});
