export const api = {
  auth: {
    login: '/api/auth/jwt/create/',
  },
  company: '/api/company/',
  contract: '/api/contract/',
  curator: '/api/company_physical_person/',
  project: '/api/megaproject/',
  work: '/api/project/create/',
  resourcePlanning: {
    workOptions: '/api/project/opt1/',
  },
  certification: {
    certificate: '/api/certifications/certificates/',
    protocol: '/api/certifications/protocols/',
    techSpec: '/api/certifications/tech-specs/',
    manual: '/api/certifications/manuals/',
    passport: '/api/certifications/passports/',
  },
} as const;

export type ApiPath = (typeof api)[keyof typeof api];
