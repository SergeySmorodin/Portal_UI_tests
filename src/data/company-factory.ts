import { randomBytes } from 'node:crypto';
import { CompanyData } from '../types';

const randomToken = (): string => randomBytes(4).toString('hex');

const generateRandomInn = (): string => {
  let num = '';
  for (let i = 0; i < 10; i++) num += Math.floor(Math.random() * 10);
  return num;
};

const generateRandomOgrn = (): string => {
  let num = '';
  for (let i = 0; i < 13; i++) num += Math.floor(Math.random() * 10);
  return num;
};

/** Базовая фабрика компании: уникальное наименование + частичные переопределения. */
export const createCompany = (overrides: Partial<CompanyData> = {}): CompanyData => ({
  structure: 'ООО',
  name: `ТЕСТ-${Date.now()}-${randomToken()}`,
  address: 'г. Москва, ул. Тестовая, д. 1',
  factAddress: 'г. Москва, ул. Тестовая, д. 1',
  inn: generateRandomInn(),
  ogrn: generateRandomOgrn(),
  email: `test_${randomToken()}@example.com`,
  ...overrides,
});

export const companyFactory = {
  llc: (overrides: Partial<CompanyData> = {}) => createCompany({ structure: 'ООО', ...overrides }),

  jsc: (overrides: Partial<CompanyData> = {}) => createCompany({ structure: 'АО', ...overrides }),
};
