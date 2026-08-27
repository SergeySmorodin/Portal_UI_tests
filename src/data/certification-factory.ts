import { randomBytes } from 'node:crypto';
import { CertificationData } from '../types';

const randomToken = (): string => randomBytes(4).toString('hex');

const generateStartDate = (): string => {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 1);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${mm}-${dd}`;
};

const generateExpiryDate = (): string => {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 3);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${mm}-${dd}`;
};

const generateWarningPeriod = (): string => {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 1);
  now.setMonth(now.getMonth() + 6);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${mm}-${dd}`;
};

/** Базовая фабрика сертификационного документа. */
export const createCertification = (
  overrides: Partial<CertificationData> = {}
): CertificationData => ({
  resourceType: 'certificate',
  docType: 'voluntary',
  name: `ТЕСТ-${Date.now()}-${randomToken()}`,
  number: `N-${Date.now()}-${randomToken()}`,
  status: 'active',
  startDate: generateStartDate(),
  expiryDate: generateExpiryDate(),
  warningPeriod: generateWarningPeriod(),
  ...overrides,
});

export const certificationFactory = {
  certificate: (overrides: Partial<CertificationData> = {}) =>
    createCertification({ resourceType: 'certificate', docType: 'voluntary', ...overrides }),

  protocol: (overrides: Partial<CertificationData> = {}) =>
    createCertification({ resourceType: 'protocol', docType: 'protocol', ...overrides }),

  techSpec: (overrides: Partial<CertificationData> = {}) =>
    createCertification({ resourceType: 'tech_spec', docType: 'tu', ...overrides }),

  manual: (overrides: Partial<CertificationData> = {}) =>
    createCertification({ resourceType: 'manual', docType: undefined, ...overrides }),

  passport: (overrides: Partial<CertificationData> = {}) =>
    createCertification({ resourceType: 'passport', docType: undefined, ...overrides }),
};
