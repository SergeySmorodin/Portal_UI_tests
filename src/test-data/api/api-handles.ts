import { config } from '../../config';

/** Тип документа формы загрузки (значение селекта resource_type) -> раздел API сертификации. */
const CERTIFICATION_ENDPOINTS = {
  certificate: '/api/certifications/certificates/',
  protocol: '/api/certifications/protocols/',
  tech_spec: '/api/certifications/tech-specs/',
  manual: '/api/certifications/manuals/',
  passport: '/api/certifications/passports/',
} as const;

export type CertificationResourceType = keyof typeof CERTIFICATION_ENDPOINTS;

/**
 * Полный адрес API-эндпоинта.
 *
 * По умолчанию пути относительные и резолвятся от `baseURL` браузера — так было
 * всегда. Когда задан `API_URL`, пути становятся абсолютными: локально фронтенд
 * и Django живут на разных портах (UI :3000, API :8000), и относительный путь
 * ушёл бы на dev-сервер, где `/api/...` отвечает 404.
 */
export const apiUrl = (path: string): string => `${config.apiUrl}${path}`;

/** API-эндпоинт списка документов по типу документа. */
export const certificationEndpoint = (resourceType: CertificationResourceType): string =>
  apiUrl(CERTIFICATION_ENDPOINTS[resourceType]);

/** API-эндпоинт конкретного документа: /api/certifications/<раздел>/<pk>/. */
export const certificationItemEndpoint = (
  resourceType: CertificationResourceType,
  pk: string
): string => apiUrl(`${CERTIFICATION_ENDPOINTS[resourceType]}${pk}/`);

export const api = {
  auth: {
    login: apiUrl('/api/auth/jwt/create/'),
    add_user: apiUrl('/api/auth/users/'),
  },
  company: apiUrl('/api/company/'),
  contract: apiUrl('/api/contract/'),
  contractDocs: apiUrl('/api/contract/load/docs/'),
  curator: apiUrl('/api/company_physical_person/'),
  project: apiUrl('/api/megaproject/'),
  work: apiUrl('/api/project/create/'),
  resourcePlanning: {
    workOptions: apiUrl('/api/project/opt1/'),
  },
  reportCard: apiUrl('/api/project_report_card/'),
  projectOpt2: apiUrl('/api/project/opt2/'),
  requisition: apiUrl('/api/requisition/'),
  certification: {
    certificate: apiUrl(CERTIFICATION_ENDPOINTS.certificate),
    protocol: apiUrl(CERTIFICATION_ENDPOINTS.protocol),
    techSpec: apiUrl(CERTIFICATION_ENDPOINTS.tech_spec),
    manual: apiUrl(CERTIFICATION_ENDPOINTS.manual),
    passport: apiUrl(CERTIFICATION_ENDPOINTS.passport),
  },
  safety_all: apiUrl('/api/users/safety_all/'),
} as const;

export type ApiPath = (typeof api)[keyof typeof api];
