export const api = {
  company: '/api/company/',
  contract: '/api/contract/',
  curator: '/api/company_physical_person/',
  project: '/api/megaproject/',
} as const;

export type ApiPath = (typeof api)[keyof typeof api];
