<script setup lang="ts">
const socials = [
  { name: "x", icon: "i-bi-twitter-x", href: "#", class: "size-[19px]" },
  {
    name: "tiktok",
    icon: "i-arcticons-ticktock-video-wallpaper",
    href: "#",
    class: "size-[21px]",
  },
  {
    name: "whatsapp",
    icon: "i-logos-whatsapp-icon",
    href: "#",
    class: "size-[24px]",
  },
  {
    name: "gmail",
    icon: "i-logos-google-gmail",
    href: "#",
    class: "size-[23px]",
  },
  {
    name: "instagram",
    icon: "i-skill-icons-instagram",
    href: "#",
    class: "size-[19px]",
  },
];

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer
    class="sm:h-12 bg-bg-layout flex gap-3 py-4 sm:flex-row flex-col items-center justify-between px-15 border-t border-t-placeholder/20"
  >
    <p class="text-xs text-t-sec tracking-[0.4px]">
      {{ $t("footer.copyright", { year: currentYear }) }}
    </p>
    <div class="flex items-center gap-6">
      <a
        href="#"
        class="text-sm text-t-sec text-nowrap hover:text-t-brand transition-colors tracking-[0.25px]"
      >
        {{ $t("footer.privacyPolicy") }}
      </a>

      <div class="h-6 w-px bg-t-placeholder/40" />

      <div class="flex items-center gap-4">
        <a
          v-for="social in socials"
          :key="social.name"
          :href="social.href"
          :aria-label="social.name"
          class="flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <UIcon :name="social.icon" :class="social.class" />
        </a>
      </div>
    </div>
  </footer>
</template>
