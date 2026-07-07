export interface Branch {
  id: number;
  adminCode: string;
  adminName: string;
  region: string;
  status: boolean;
}

export interface StepOneData {
  branchNameAr: string;
  branchNameEn: string;
  email: string;
  country: string;
  phone: string;
  dialCode: string;
  contactNameAr: string;
  contactNameEn: string;
  contactPosition: string;
  branchCode: string;
  netProfit: string;
}

export interface StepTwoData {
  commercialRegNo: string;
  vatNumber: string;
  iban: string;
  commercialRegFile: File | null;
  taxCertFile: File | null;
  ibanFile: File | null;
  addressFile: File | null;
  agreementFile: File | null;
}

export interface BranchFileRef {
  name: string;
  url: string;
  type: "image" | "pdf";
}

export interface BranchDetails {
  id: number;
  requestNumber: string;
  submittedAt: string;
  status: "completed" | "pending" | "rejected";
  branchCode: string;
  branchNameAr: string;
  branchNameEn: string;
  country: string;
  email: string;
  phone: string;
  dialCode?: string;
  contactNameAr: string;
  contactNameEn: string;
  contactPosition: string;
  netProfit: string;
  commercialRegNo: string;
  commercialRegFile: BranchFileRef;
  vatNumber: string;
  taxCertFile: BranchFileRef;
  iban: string;
  ibanFile: BranchFileRef;
  addressFile: BranchFileRef;
  agreementFile: BranchFileRef;
}

export type BranchFormMode = "add" | "update";

export type BranchFormData = StepOneData & StepTwoData;