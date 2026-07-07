import type { ComputedRef } from "vue";
import type { SidebarEntry } from "@fullup/base/types";

export const useDashboardNav = (): ComputedRef<SidebarEntry[]> => {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const { link } = useSidebarLink();

  return computed<SidebarEntry[]>(() => [
    link("controlPanel", "controlPanel", "i-heroicons-squares-2x2"),
    {
      type: "group",
      key: "wallets",
      label: t("dashboard.sidebar.groups.wallets"),
      items: [
        link("fullupWallets", "fullupWallets", "i-heroicons-wallet", { to: localePath("/wallets") }),
      ],
    },
    {
      type: "group",
      key: "financialOperations",
      label: t("dashboard.sidebar.groups.financialOperations"),
      items: [
        link("refundSettlements", "refundSettlements", "i-heroicons-arrow-uturn-left", { to: localePath("/settlements/refund-requests") }),
        link("providerSettlements", "providerSettlements", "i-heroicons-scale", { to: localePath("/settlements/providers") }),
        link("intlBranchWalletSettlements", "intlBranchWalletSettlements", "i-heroicons-globe-alt", { to: localePath("/settlements/international-branches") }),
        link("delegateSettlements", "delegateSettlements", "i-heroicons-user-group", { to: localePath("/settlements/delegates") }),
        link("totalSettlements", "totalSettlements", "i-heroicons-calculator", { to: localePath("/settlements/total") }),
        link("branchSettlementsLog", "branchSettlementsLog", "i-heroicons-clipboard-document-list", { to: localePath("/settlements/branch-log") }),
      ],
    },
    {
      type: "group",
      key: "hr",
      label: t("dashboard.sidebar.groups.hr"),
      items: [
        link("departmentManagers", "departmentManagers", "i-heroicons-user-circle", { to: localePath("/hr/managers") }),
        link("supervisors", "supervisors", "i-heroicons-user-group", { to: localePath("/hr/supervisors") }),
        link("employees", "employees", "i-heroicons-users", { to: localePath("/hr/employees") }),
        link("jobs", "jobs", "i-heroicons-briefcase", { to: localePath("/hr/jobs") }),
      ],
    },
    {
      type: "group",
      key: "clients",
      label: t("dashboard.sidebar.groups.clients"),
      items: [
        link("individuals", "individuals", "i-heroicons-user", { to: localePath("/clients/individuals") }),
        link("serviceProviders", "serviceProviders", "i-heroicons-wrench-screwdriver", { to: localePath("/clients/service-providers") }),
        link("companies", "companies", "i-heroicons-building-office", { to: localePath("/clients/companies") }),
        link("governmental", "governmental", "i-heroicons-building-library", { to: localePath("/clients/governmental") }),
        link("diplomatic", "diplomatic", "i-heroicons-flag", { to: localePath("/clients/diplomatic") }),
        link("exhibitors", "exhibitors", "i-heroicons-building-storefront", { to: localePath("/clients/exhibitors") }),
      ],
    },
    {
      type: "group",
      key: "vehicles",
      label: t("dashboard.sidebar.groups.vehicles"),
      items: [
        link("vehicles", "vehicles", "i-heroicons-truck", { to: localePath("/vehicles") }),
        link("fullupCards", "fullupCards", "i-heroicons-credit-card", { to: localePath("/vehicles/cards") }),
        link("smartVerification", "smartVerification", "i-heroicons-shield-check", { to: localePath("/vehicles/smart-verification") }),
        link("agreementsContracts", "agreementsContracts", "i-heroicons-document-text", { to: localePath("/vehicles/agreements") }),
        link("offersPackages", "offersPackages", "i-heroicons-gift", { to: localePath("/vehicles/offers") }),
        link("subscriptions", "subscriptions", "i-heroicons-arrow-path", { to: localePath("/vehicles/subscriptions") }),
        link("customNotifications", "customNotifications", "i-heroicons-bell", { to: localePath("/vehicles/notifications") }),
        link("discountCoupons", "discountCoupons", "i-heroicons-ticket", { to: localePath("/vehicles/coupons") }),
      ],
    },
    {
      type: "group",
      key: "fullupResources",
      label: t("dashboard.sidebar.groups.fullupResources"),
      items: [
        link("vehicleDrivers", "vehicleDrivers", "i-heroicons-identification", { to: localePath("/resources/drivers") }),
        link("resourceDelegates", "resourceDelegates", "i-heroicons-user-group", { to: localePath("/resources/delegates") }),
        link("resourceVehicles", "resourceVehicles", "i-heroicons-truck", { to: localePath("/resources/vehicles") }),
      ],
    },
    {
      type: "group",
      key: "products",
      label: t("dashboard.sidebar.groups.products"),
      items: [
        link("productsManagement", "productsManagement", "i-heroicons-cube", { to: localePath("/products") }),
      ],
    },
    {
      type: "group",
      key: "orders",
      label: t("dashboard.sidebar.groups.orders"),
      items: [
        link("walletRequests", "walletRequests", "i-heroicons-wallet", { to: localePath("/orders/wallets") }),
        link("delegateRegistrationRequests", "delegateRegistrationRequests", "i-heroicons-user-plus", { to: localePath("/orders/delegate-registration") }),
        link("refundRequests", "refundRequests", "i-heroicons-arrow-uturn-left", { to: localePath("/orders/refunds") }),
        link("customerRequests", "customerRequests", "i-heroicons-shopping-bag", { to: localePath("/orders/customers") }),
        link("registrationRequests", "registrationRequests", "i-heroicons-document-plus", { to: localePath("/orders/registration") }),
        link("centerApprovalRequests", "centerApprovalRequests", "i-heroicons-check-badge", { to: localePath("/orders/center-approval") }),
        link("addServiceRequests", "addServiceRequests", "i-heroicons-plus-circle", { to: localePath("/orders/add-service") }),
        link("productDeliveryRequests", "productDeliveryRequests", "i-heroicons-truck", { to: localePath("/orders/delivery") }),
        link("locationApprovalRequests", "locationApprovalRequests", "i-heroicons-map-pin", { to: localePath("/orders/location-approval") }),
      ],
    },
    {
      type: "group",
      key: "invoices",
      label: t("dashboard.sidebar.groups.invoices"),
      items: [
        link("serviceFeeInvoice", "serviceFeeInvoice", "i-heroicons-receipt-percent", { to: localePath("/invoices/service-fee") }),
        link("monthlyOperationsInvoice", "monthlyOperationsInvoice", "i-heroicons-receipt-refund", { to: localePath("/invoices/monthly-operations") }),
      ],
    },
    {
      type: "group",
      key: "settlementReports",
      label: t("dashboard.sidebar.groups.settlementReports"),
      items: [
        link("providerSettlementsReport", "providerSettlementsReport", "i-heroicons-scale", { to: localePath("/reports/settlements/providers") }),
        link("refundSettlementsReport", "refundSettlementsReport", "i-heroicons-arrow-uturn-left", { to: localePath("/reports/settlements/refund") }),
        link("intlSettlementsReport", "intlSettlementsReport", "i-heroicons-globe-alt", { to: localePath("/reports/settlements/international") }),
        link("delegateSettlementsReport", "delegateSettlementsReport", "i-heroicons-user-group", { to: localePath("/reports/settlements/delegates") }),
      ],
    },
    {
      type: "group",
      key: "financialReports",
      label: t("dashboard.sidebar.groups.financialReports"),
      items: [
        link("companyIndividualSalesReport", "companyIndividualSalesReport", "i-heroicons-document-chart-bar", { to: localePath("/reports/sales") }),
        link("driverVehicleMovement", "driverVehicleMovement", "i-heroicons-map", { to: localePath("/reports/driver-movement") }),
        link("delegatesReport", "delegatesReport", "i-heroicons-users", { to: localePath("/reports/delegates") }),
        link("providerMovementReport", "providerMovementReport", "i-heroicons-arrow-trending-up", { to: localePath("/reports/provider-movement") }),
        link("serviceFeeMovementReport", "serviceFeeMovementReport", "i-heroicons-chart-bar", { to: localePath("/reports/service-fee-movement") }),
        link("monthlyServiceFeeReport", "monthlyServiceFeeReport", "i-heroicons-calendar-days", { to: localePath("/reports/monthly-service-fee") }),
        link("providerLocationSales", "providerLocationSales", "i-heroicons-map-pin", { to: localePath("/reports/provider-location-sales") }),
        link("providerQuantitySales", "providerQuantitySales", "i-heroicons-chart-pie", { to: localePath("/reports/provider-quantity-sales") }),
      ],
    },
    link("categories", "categories", "i-heroicons-tag", { to: localePath("/categories") }),
    link("appServices", "appServices", "i-heroicons-squares-plus", { to: localePath("/app-services") }),
    link("giftsWallet", "giftsWallet", "i-heroicons-gift", { to: localePath("/gifts-wallet") }),
    link("virtualAccounts", "virtualAccounts", "i-heroicons-calculator", { to: localePath("/virtual-accounts") }),
    link("generalSettings", "generalSettings", "i-heroicons-cog-6-tooth", { to: localePath("/settings") }),
    {
      type: "group",
      key: "technicalSupport",
      label: t("dashboard.sidebar.groups.technicalSupport"),
      items: [
        link("faq", "faq", "i-heroicons-question-mark-circle", { to: localePath("/support/faq") }),
        link("customerService", "customerService", "i-heroicons-chat-bubble-left-right", { to: localePath("/support/customer-service") }),
      ],
    },
    link("logout", "logout", "i-heroicons-arrow-right-on-rectangle", {
      to: localePath("/logout"),
      danger: true,
    }),
  ]);
};