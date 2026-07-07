// Superadmin — holding company that owns the FullUp platform.
export default defineNuxtConfig({
  extends: ["@fullup/base"],
  compatibilityDate: "2026-02-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: "https://admin.fullup.webstdy.com/api",
    },
  },
});
