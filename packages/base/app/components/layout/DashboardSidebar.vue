<script setup lang="ts">
import type { SidebarEntry, SidebarGroup } from "../../../shared/types/navigation";

const isDesktop = useMediaQuery("(min-width: 1024px)");
const effectiveCollapsed = (collapsed: boolean) => collapsed && isDesktop.value;

const { localeProperties } = useI18n();

const tooltipSide = computed(() =>
  localeProperties.value.dir === "rtl" ? "left" : "right",
);

// Menu data is per-dashboard: each app overrides useDashboardNav().
// This shell (collapse, tooltips, logo, profile footer, scroll styling) is shared.
const entries = useDashboardNav();

const isGroup = (e: SidebarEntry): e is SidebarGroup => e.type === "group";

const openGroups = ref<Record<string, boolean>>({});

// Controlled collapse state. Initialised to `false` so the sidebar ALWAYS
// mounts expanded (full width + full logo) and never restores a persisted
// collapsed state — this avoids the reload-while-collapsed hydration mismatch.
const collapsed = ref(false);

watch(
  () => collapsed.value && isDesktop.value,
  (isCollapsed) => {
    for (const entry of entries.value) {
      if (isGroup(entry)) openGroups.value[entry.key] = isCollapsed;
    }
  },
  { immediate: true },
);
</script>

<template>
  <UDashboardSidebar
    id="dashboard-sidebar"
    v-model:collapsed="collapsed"
    collapsible
    class="bg-surface-dark"
    :ui="{
      footer: 'lg:border-t lg:border-default',
      content: 'bg-surface-dark',
      body: `${collapsed && isDesktop ? 'px-1' : 'px-3'} sidebar-scroll-area `,
      header: collapsed && isDesktop ? 'px-4' : 'rtl:px-4 ltr:px-2',
    }"
  >
    <template #header="{ collapsed: rawCollapsed }">
      <div
        class="flex items-center gap-2"
        :class="effectiveCollapsed(rawCollapsed) ? 'justify-center' : ''"
      >
        <div class="logo">
          <NuxtLinkLocale to="/" aria-label="Home">
            <template v-if="effectiveCollapsed(rawCollapsed)">
              <SvgLightFLogo class="dark:hidden w-fit" />
              <SvgDarkFLogo class="hidden dark:block w-fit" />
            </template>
            <template v-else>
              <SvgLightMainLogo class="hidden dark:block" />
              <SvgDarkMainLogo class="dark:hidden" />
            </template>
          </NuxtLinkLocale>
        </div>
      </div>
    </template>

    <template #default="{ collapsed: rawCollapsed }">
      <nav class="flex flex-col gap-1 py-2">
        <template v-for="entry in entries" :key="entry.key">
          <!-- Top-level link -->
          <UTooltip
            v-if="entry.type === 'link'"
            :delay-duration="0"
            arrow
            :text="entry.label"
            :content="{
              align: 'center',
              side: tooltipSide,
              sideOffset: 8,
            }"
            :disabled="!effectiveCollapsed(rawCollapsed)"
            :ui="{
              content: 'h-auto py-1',
              text: 'text-sm',
            }"
          >
            <NuxtLink
              :to="entry.to"
              class="flex items-center gap-3 rounded-lg transition-colors"
              :class="[
                effectiveCollapsed(rawCollapsed)
                  ? 'justify-center size-8.5 mx-auto'
                  : 'px-3 py-2',
                entry.active
                  ? 'bg-primary/20 text-primary font-semibold '
                  : entry.danger
                    ? 'text-t-red hover:bg-t-red/10'
                    : 'text-t-white hover:bg-primary/10 hover:text-primary',
              ]"
            >
              <UIcon :name="entry.icon" class="size-5 shrink-0" />
              <span v-if="!effectiveCollapsed(rawCollapsed)" class="truncate">{{
                entry.label
              }}</span>
            </NuxtLink>
          </UTooltip>

          <!-- Group with collapsible items -->
          <UCollapsible
            v-else
            v-model:open="openGroups[entry.key]"
            :unmount-on-hide="false"
            class="flex flex-col"
            :default-open="false"
          >
            <button
              v-if="!effectiveCollapsed(rawCollapsed)"
              type="button"
              class="flex items-center gap-2 w-full px-2 py-2 mt-2 text-xs font-bold cursor-pointer"
            >
              <span class="whitespace-nowrap text-t-sec">{{
                entry.label
              }}</span>
              <span class="flex-1 h-px bg-t-sec" />
              <span
                class="w-4 h-4 flex items-center justify-center border border-t-sec rounded-full"
              >
                <UIcon
                  name="i-lucide:chevron-down"
                  class="size-3 shrink-0 transition-transform"
                  :class="openGroups[entry.key] ? '-rotate-180' : ''"
                />
              </span>
            </button>

            <template #content>
              <ul class="flex flex-col gap-1">
                <li v-for="item in entry.items" :key="item.key">
                  <UTooltip
                    :text="item.label"
                    :delay-duration="0"
                    arrow
                    :content="{
                      align: 'center',
                      side: tooltipSide,
                      sideOffset: 8,
                    }"
                    :disabled="!effectiveCollapsed(rawCollapsed)"
                    :ui="{
                      content: 'h-auto py-1',
                      text: 'text-sm',
                    }"
                  >
                    <NuxtLink
                      :to="item.to"
                      class="flex items-center gap-3 rounded-lg transition-colors"
                      :class="[
                        effectiveCollapsed(rawCollapsed)
                          ? 'justify-center size-8.5 mx-auto'
                          : 'px-3 py-2',
                        item.active
                          ? 'bg-primary/20 text-primary font-semibold'
                          : 'text-t-white hover:bg-primary/10 hover:text-primary',
                      ]"
                    >
                      <UIcon :name="item.icon" class="size-5 shrink-0" />
                      <span
                        v-if="!effectiveCollapsed(rawCollapsed)"
                        class="truncate"
                      >
                        {{ item.label }}
                      </span>
                    </NuxtLink>
                  </UTooltip>
                </li>
              </ul>
            </template>
          </UCollapsible>
        </template>
      </nav>
    </template>

    <template #footer="{ collapsed: rawCollapsed }">
      <div
        class="flex items-center gap-3"
        :class="effectiveCollapsed(rawCollapsed) ? 'justify-center' : 'p-2'"
      >
        <UAvatar
          src="https://i.pravatar.cc/80?img=12"
          :alt="$t('dashboard.profile.name')"
          size="md"
        />
        <div
          v-if="!effectiveCollapsed(rawCollapsed)"
          class="flex flex-col min-w-0 flex-1"
        >
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-t-white truncate">
              {{ $t("dashboard.profile.name") }}
            </span>
            <UBadge
              :label="$t('dashboard.profile.role')"
              color="primary"
              variant="soft"
              size="sm"
            />
          </div>
          <span class="text-xs text-t-primary-gray truncate">
            {{ $t("dashboard.profile.email") }}
          </span>
        </div>
      </div>
    </template>
  </UDashboardSidebar>
</template>

<style>
@media screen and (min-width: 1024px) {
  .sidebar-scroll-area {
    scrollbar-width: none;
  }

  .sidebar-scroll-area::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .sidebar-scroll-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .sidebar-scroll-area::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 999px;
    transition: all 0.2s ease;
  }

  .sidebar-scroll-area:hover::-webkit-scrollbar-thumb {
    background-color: var(--t-brand);
  }

  .sidebar-scroll-area:hover::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }

  .sidebar-scroll-area:hover {
    scrollbar-width: thin;
    scrollbar-color: var(--t-brand) transparent;
  }
}
</style>
