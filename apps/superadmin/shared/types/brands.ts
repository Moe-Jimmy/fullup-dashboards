// Brand-management module types.

// Product brands carry categories; vehicle brands do not.
export type BrandType = "product" | "vehicle";

export interface Brand {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  logo: string | null; // logo url; null → placeholder box
  type: BrandType;
  category: string; // main category display label (product only)
  status: boolean; // active / inactive
}

export interface BrandCategory {
  id: number;
  nameAr: string;
  nameEn: string;
}

export interface BrandFormData {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  logo: File | null;
  mainCategoryId: number | null;
  subCategoryId: number | null;
  status: boolean;
}

export type BrandFormMode = "add" | "edit";
