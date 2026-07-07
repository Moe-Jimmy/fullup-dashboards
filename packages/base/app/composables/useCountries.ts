export function useCountries() {
  const { locale } = useI18n();

  const countries = computed(() =>
    countriesData.map((c) => ({
      label: locale.value === "ar" ? c.nameAr : c.nameEn,
      value: c.code,
    })),
  );

  return { countries };
}