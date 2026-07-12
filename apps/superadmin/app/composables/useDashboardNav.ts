import type { ComputedRef } from "vue";
import type { SidebarEntry } from "@fullup/base/types";

// Superadmin dashboard navigation. Overrides the empty base useDashboardNav().
// `useSidebarLink` and the shared sidebar shell come from the base layer.
export const useDashboardNav = (): ComputedRef<SidebarEntry[]> => {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const { link } = useSidebarLink();

  return computed<SidebarEntry[]>(() => [
    link("controlPanel", "controlPanel", "i-heroicons-squares-2x2"),
    link(
      "branchesManagement",
      "branchesManagement",
      "i-heroicons-building-office-2",
      {
        to: localePath("/fullup_branches"),
      },
    ),
    link(
      "countriesManagement",
      "countriesManagement",
      "i-heroicons-globe-alt",
      {
        to: localePath("/fullup_countries"),
      },
    ),
    link("codingManagement", "codingManagement", "i-heroicons-hashtag"),
    {
      type: "group",
      key: "employees",
      label: t("dashboard.sidebar.groups.employees"),
      items: [
        link("fullupDelegates", "fullupDelegates", "i-heroicons-user-group"),
      ],
    },
    {
      type: "group",
      key: "cards",
      label: t("dashboard.sidebar.groups.cards"),
      items: [
        link("cardsManagement", "cardsManagement", "i-heroicons-credit-card"),
        link("cardProducts", "cardProducts", "i-heroicons-square-3-stack-3d"),
        link("simCardCoding", "simCardCoding", "i-heroicons-cpu-chip"),
      ],
    },
    {
      type: "group",
      key: "vehicles",
      label: t("dashboard.sidebar.groups.vehicles"),
      items: [
        link("vehiclesManagement", "vehiclesManagement", "i-heroicons-truck"),
        link("branchVehicles", "branchVehicles", "i-heroicons-truck"),
        link("smartVerification", "smartVerification", "i-heroicons-shield-check"),
        link("brandManagement", "brandManagement", "i-heroicons-tag"),
      ],
    },
    {
      type: "group",
      key: "clients",
      label: t("dashboard.sidebar.groups.clients"),
      items: [
        link("individuals", "individuals", "i-heroicons-user"),
        link("serviceProviders", "serviceProviders", "i-heroicons-users"),
        link("companies", "companies", "i-heroicons-building-office"),
        link("governmental", "governmental", "i-heroicons-building-library"),
        link("diplomatic", "diplomatic", "i-heroicons-flag"),
        link("exhibitors", "exhibitors", "i-heroicons-building-storefront"),
      ],
    },
    {
      type: "group",
      key: "products",
      label: t("dashboard.sidebar.groups.products"),
      items: [
        link("fuel", "fuel", "i-heroicons-fire"),
        link("oils", "oils", "i-heroicons-beaker"),
        link("tires", "tires", "i-heroicons-cog-8-tooth"),
        link("batteries", "batteries", "i-heroicons-bolt"),
        link("wash", "wash", "i-heroicons-sparkles"),
        link("polish", "polish", "i-heroicons-star"),
      ],
    },
    {
      type: "group",
      key: "orders",
      label: t("dashboard.sidebar.groups.orders"),
      items: [
        link("fullupOrders", "fullupOrders", "i-heroicons-clipboard-document-list"),
        link("customerOrders", "customerOrders", "i-heroicons-shopping-bag"),
        link("deliveryOrders", "deliveryOrders", "i-heroicons-truck"),
        link("branchRegistration", "branchRegistration", "i-heroicons-document-plus"),
      ],
    },
    {
      type: "group",
      key: "branchReports",
      label: t("dashboard.sidebar.groups.branchReports"),
      items: [
        link("branchSettlements", "branchSettlements", "i-heroicons-scale"),
        link("interBranchServiceFees", "interBranchServiceFees", "i-heroicons-currency-dollar"),
        link("interBranchPurchases", "interBranchPurchases", "i-heroicons-shopping-cart"),
      ],
    },
    {
      type: "group",
      key: "salesReports",
      label: t("dashboard.sidebar.groups.salesReports"),
      items: [
        link("branchSalesReport", "branchSalesReport", "i-heroicons-document-chart-bar"),
        link("branchSalesQuantitiesReport", "branchSalesQuantitiesReport", "i-heroicons-chart-bar"),
      ],
    },
    link("taxInvoicesReports", "taxInvoicesReports", "i-heroicons-receipt-percent"),
    link("fullupServicesReports", "fullupServicesReports", "i-heroicons-document-text"),
    link("categoriesManagement", "categoriesManagement", "i-heroicons-tag"),
    link("generalSettings", "generalSettings", "i-heroicons-cog-6-tooth"),
    link("supportMessages", "supportMessages", "i-heroicons-chat-bubble-left-right"),
    link("logout", "logout", "i-heroicons-arrow-right-on-rectangle", {
      danger: true,
    }),
  ]);
};
