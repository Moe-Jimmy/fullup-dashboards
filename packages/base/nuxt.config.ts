// Shared FullUp base layer — extended by every dashboard app.
// AUTH-AGNOSTIC: no auth modules, tokens, or role logic here. Apps own their auth.
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const currentDir = fileURLToPath(new URL(".", import.meta.url));

export default defineNuxtConfig({
  // Absolute path so the css resolves correctly when this layer is
  // consumed from another app's working directory.
  css: [
    `${currentDir}/app/assets/css/main.css`,
    "flag-icons/css/flag-icons.min.css",
  ],

  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@nuxt/fonts",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
  ],

  ui: {
    colorMode: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
      baseUrl: "https://fullup.com",
    locales: [
      { code: "en", language: "en", name: "EN", dir: "ltr", file: "en/en.json" },
      { code: "ar", language: "ar", name: "AR", dir: "rtl", file: "ar/ar.json" },
    ],
    defaultLocale: "ar",
    defaultDirection: "rtl",
    langDir: "locales",
    strategy: "prefix_except_default",
   detectBrowserLanguage: false,
    skipSettingLocaleOnNavigate: false,  },
});
