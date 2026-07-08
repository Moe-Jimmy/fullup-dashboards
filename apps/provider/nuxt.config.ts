// Provider — a service provider serving FullUp within a country.
export default defineNuxtConfig({
  extends: ["@fullup/base"],
  compatibilityDate: "2026-02-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: "https://admin.fullup.webstdy.com/api",
    },
  },
  i18n: {
    locales: [
      { code: "en", language: "en", name: "EN", dir: "ltr", file: "en/en.json" },
      { code: "ar", language: "ar", name: "AR", dir: "rtl", file: "ar/ar.json" },
    ],
    langDir: "locales",
  },
});
