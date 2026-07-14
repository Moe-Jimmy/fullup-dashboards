export interface BranchCoding {
  id: number;
  branchName: string;
  mainCode: string;
  serviceProviders: string;
  delegates: string;
  individuals: string;
  companies: string;
  diplomatic: string;
  government: string;
  exhibitions: string;
}

export interface CodingSettingsFormData {
  serviceProviders: string;
  delegates: string;
  individuals: string;
  companies: string;
  diplomatic: string;
  government: string;
  exhibitions: string;
}
