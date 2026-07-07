<script lang="ts" setup>
const localeHead = useLocaleHead();
const { locale, t } = useI18n();
const dir = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));
// useHead({
//   link: [
//     {
//       rel: "icon",
//       type: "image/png",
//       href: "/images/favIcon.png",
//     },
//   ],
// });
useSeoMeta({
  title: computed(() => t("meta.title")),
  description: computed(() => t("meta.description")),
});
</script>
<template>
  <Html :lang="localeHead.htmlAttrs.lang" :dir="dir">
    <Head>
      <template v-for="link in localeHead.link" :key="link.key">
        <Link
          :id="link.key"
          :rel="link.rel"
          :href="link.href"
          :hreflang="link.hreflang"
        />
      </template>
      <template v-for="meta in localeHead.meta" :key="meta.key">
        <Meta
          :id="meta.key"
          :property="meta.property"
          :content="meta.content"
        />
      </template>
    </Head>
    <Body>
      <UApp :toaster="{ position: 'top-right', duration: 2000 }">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UApp>
    </Body>
  </Html>
</template>
