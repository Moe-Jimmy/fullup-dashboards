export const inputUi = {
  base: "w-full h-[52px] ps-4  rounded-xl placeholder:text-sm placeholder:text-t-placeholder text-t-white bg-transparent",
  leading: "ps-4",
  leadingIcon: "text-t-white",
};

export const selectUi = {
  base: "w-full h-[52px] ps-4  rounded-xl text-t-white bg-transparent",
  leading: "ps-4",
  leadingIcon: "text-t-white",
  content: "bg-bg-landingpage",
  item: "data-highlighted:not-data-disabled:before:bg-primary/20",
  placeholder: "text-t-placeholder",
};

export const fieldUi = {
  label: "text-t-white mb-2 text-base flex-1",
  container: "mt-2 relative",
};

export const searchInput = (placeholder: string) => ({
  placeholder,
  leadingIcon: "i-lucide-search",
  ui: {
    leadingIcon: "text-t-white size-4",
    base: "ps-8",
  },
});
