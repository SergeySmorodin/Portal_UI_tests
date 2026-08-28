import { randomBytes } from 'node:crypto';
import { CertificationData } from '../types';
import { addMonths, addYears, formatYmd, today } from '../utils/date';

const randomToken = (): string => randomBytes(4).toString('hex');

const generateStartDate = (): string => formatYmd(addYears(today(), 1));

const generateExpiryDate = (): string => formatYmd(addYears(today(), 3));

const generateWarningPeriod = (): string => formatYmd(addMonths(addYears(today(), 1), 6));

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
