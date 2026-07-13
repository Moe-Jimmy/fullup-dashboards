export interface Country {
  id: number;
  nameAr: string;
  nameEn: string;
  code: string;
  citiesCount: number;
  zonesCount: number;
  creator: string;
  createdAt: string;
}

export interface City {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  countryId: number;
  createdAt: string;
}

export interface Zone {
  id: number;
  nameAr: string;
  nameEn: string;
  cityId: number;
  createdAt: string;
}

export interface CountryFormData {
  nameAr: string;
  nameEn: string;
  code: string;
  globalNumber: string;
}

export interface CityFormData {
  code: string;
  countryId: number;
  nameAr: string;
  nameEn: string;
}

export interface ZoneFormData {
  nameAr: string;
  nameEn: string;
  cityId: number;
}

export type CountryFormMode = "add" | "update";


export type SelectOption = {
  id: number;
  label: string;
  value: number;
};