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

export interface ProjectData {
  code: string;
  status: string;
  startDate: string;
  stopDate: string;
  groupProject: string;
  typeProject: string;
  departmentProject: string;
  kindProject: string;
  note: string;
}
