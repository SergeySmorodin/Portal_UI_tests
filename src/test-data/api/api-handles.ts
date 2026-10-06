/** Тип документа формы загрузки (значение селекта resource_type) -> раздел API сертификации. */
const CERTIFICATION_ENDPOINTS = {
  certificate: '/api/certifications/certificates/',
  protocol: '/api/certifications/protocols/',
  tech_spec: '/api/certifications/tech-specs/',
  manual: '/api/certifications/manuals/',
  passport: '/api/certifications/passports/',
} as const;

export type CertificationResourceType = keyof typeof CERTIFICATION_ENDPOINTS;

/** API-эндпоинт групп пользователя: /api/users/profile/<uuid>/groups/. */
export const profileGroupsEndpoint = (uuid: string): string => `/api/users/profile/${uuid}/groups/`;

/** API-эндпоинт списка документов по типу документа. */
export const certificationEndpoint = (resourceType: CertificationResourceType): string =>
  CERTIFICATION_ENDPOINTS[resourceType];

/** API-эндпоинт конкретного документа: /api/certifications/<раздел>/<pk>/. */
export const certificationItemEndpoint = (
  resourceType: CertificationResourceType,
  pk: string
): string => `${CERTIFICATION_ENDPOINTS[resourceType]}${pk}/`;

export const api = {
  auth: {
    login: '/api/auth/jwt/create/',
    add_user: '/api/auth/users/',
  },
  company: '/api/company/',
  contract: '/api/contract/',
  curator: '/api/company_physical_person/',
  project: '/api/megaproject/',
  work: '/api/project/create/',
  resourcePlanning: {
    workOptions: '/api/project/opt1/',
  },
  reportCard: '/api/project_report_card/',
  projectOpt2: '/api/project/opt2/',
  requisition: '/api/requisition/',
  certification: {
    certificate: CERTIFICATION_ENDPOINTS.certificate,
    protocol: CERTIFICATION_ENDPOINTS.protocol,
    techSpec: CERTIFICATION_ENDPOINTS.tech_spec,
    manual: CERTIFICATION_ENDPOINTS.manual,
    passport: CERTIFICATION_ENDPOINTS.passport,
  },
  safety_all: '/api/users/safety_all/',
} as const;

export type ApiPath = (typeof api)[keyof typeof api];
