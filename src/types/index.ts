export interface UserCredentials {
  username: string;
  password: string;
}

export interface ErrorInfo {
  message: string;
  code?: string;
  details?: string;
}

export interface ContractData {
  contractNumber: string;
  date: string;
  money: string;
  status: string;
  companySearch: string;
}

export interface TestArtifact {
  name: string;
  path: string;
  type: 'screenshot' | 'video' | 'trace' | 'html';
}
