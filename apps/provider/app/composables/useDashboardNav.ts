import type { ComputedRef } from "vue";
import type { SidebarEntry } from "@fullup/base/types";

// Provider (service provider) dashboard navigation. Overrides the empty base
// useDashboardNav(). Structure mirrors the Figma "provider sidebar" design.
// `useSidebarLink` and the shared sidebar shell come from the base layer.
export const useDashboardNav = (): ComputedRef<SidebarEntry[]> => {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const { link } = useSidebarLink();

  return computed<SidebarEntry[]>(() => [
    link("controlPanel", "controlPanel", "i-heroicons-squares-2x2"),
    link("wallet", "wallet", "i-heroicons-wallet", { to: localePath("/wallet") }),
    link("financialSettlements", "financialSettlements", "i-heroicons-scale", { to: localePath("/financial-settlements") }),
    link("offersDiscounts", "offersDiscounts", "i-heroicons-tag", { to: localePath("/offers-discounts") }),
    {
      type: "group",
      key: "products",
      label: t("dashboard.sidebar.groups.products"),
      items: [
        link("fuel", "fuel", "i-heroicons-fire", { to: localePath("/products/fuel") }),
        link("fuelQuantities", "fuelQuantities", "i-heroicons-beaker", { to: localePath("/products/fuel-quantities") }),
      ],
    },
    {
      type: "group",
      key: "centersManagement",
      label: t("dashboard.sidebar.groups.centersManagement"),
      items: [
        link("stations", "stations", "i-heroicons-building-office-2", { to: localePath("/centers/stations") }),
        link("stationSupervisors", "stationSupervisors", "i-heroicons-user-group", { to: localePath("/centers/supervisors") }),
        link("stationEmployees", "stationEmployees", "i-heroicons-users", { to: localePath("/centers/employees") }),
      ],
    },
    {
      type: "group",
      key: "deliveryCentersManagement",
      label: t("dashboard.sidebar.groups.deliveryCentersManagement"),
      items: [
        link("deliveryCenters", "deliveryCenters", "i-heroicons-building-storefront", { to: localePath("/delivery-centers") }),
        link("deliveryRequestEmployees", "deliveryRequestEmployees", "i-heroicons-user-group", { to: localePath("/delivery-centers/employees") }),
        link("customerRequests", "customerRequests", "i-heroicons-shopping-bag", { to: localePath("/delivery-centers/customer-requests") }),
        link("fuelDeliveryRequests", "fuelDeliveryRequests", "i-heroicons-truck", { to: localePath("/delivery-centers/fuel-requests") }),
      ],
    },
    {
      type: "group",
      key: "financialReports",
      label: t("dashboard.sidebar.groups.financialReports"),
      items: [
        link("settlementsReport", "settlementsReport", "i-heroicons-scale", { to: localePath("/reports/settlements") }),
        link("quantitySalesReport", "quantitySalesReport", "i-heroicons-chart-bar", { to: localePath("/reports/quantity-sales") }),
        link("movementReport", "movementReport", "i-heroicons-arrow-trending-up", { to: localePath("/reports/movement") }),
        link("walletReport", "walletReport", "i-heroicons-wallet", { to: localePath("/reports/wallet") }),
        link("serviceFeeReport", "serviceFeeReport", "i-heroicons-document-chart-bar", { to: localePath("/reports/service-fee") }),
        link("locationSalesReport", "locationSalesReport", "i-heroicons-map-pin", { to: localePath("/reports/location-sales") }),
      ],
    },
    link("stationLocations", "stationLocations", "i-heroicons-map", { to: localePath("/station-locations") }),
    link("monthlyOperationsInvoice", "monthlyOperationsInvoice", "i-heroicons-receipt-percent", { to: localePath("/invoices/monthly-operations") }),
    link("serviceFeeInvoices", "serviceFeeInvoices", "i-heroicons-receipt-refund", { to: localePath("/invoices/service-fee") }),
    {
      type: "group",
      key: "ratings",
      label: t("dashboard.sidebar.groups.ratings"),
      items: [
        link("locations", "locations", "i-heroicons-map-pin", { to: localePath("/ratings/locations") }),
        link("stationWorker", "stationWorker", "i-heroicons-user", { to: localePath("/ratings/station-worker") }),
        link("deliveryWorker", "deliveryWorker", "i-heroicons-user", { to: localePath("/ratings/delivery-worker") }),
      ],
    },
    link("blacklist", "blacklist", "i-heroicons-no-symbol", { to: localePath("/blacklist") }),
    {
      type: "group",
      key: "userGuide",
      label: t("dashboard.sidebar.groups.userGuide"),
      items: [
        link("faq", "faq", "i-heroicons-question-mark-circle", { to: localePath("/guide/faq") }),
        link("technicalSupport", "technicalSupport", "i-heroicons-chat-bubble-left-right", { to: localePath("/guide/support") }),
      ],
    },
    link("logout", "logout", "i-heroicons-arrow-right-on-rectangle", {
      to: localePath("/logout"),
      danger: true,
    }),
  ]);
};