<template>
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
