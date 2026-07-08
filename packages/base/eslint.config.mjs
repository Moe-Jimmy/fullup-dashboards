import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

export default createConfigForNuxt().append({
  rules: {
    "no-undef": "off",
  },
});