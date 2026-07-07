<template>
  <!-- persistent=false: never restore collapsed state from storage, so the
       sidebar always mounts expanded on reload (avoids hydration mismatch). -->
  <UDashboardGroup :persistent="false">
    <LayoutDashboardSidebar />
    <UDashboardPanel id="dashboard-main">
      <LayoutDashboardNavbar />
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
      <LayoutDashboardFooter />
    </UDashboardPanel>
  </UDashboardGroup>
</template>
