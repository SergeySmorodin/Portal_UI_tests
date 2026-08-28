import { randomBytes } from 'node:crypto';
import { CompanyData } from '../types';

const randomToken = (): string => randomBytes(4).toString('hex');

const randomDigits = (count: number, firstNonZero = false): number[] => {
  const digits: number[] = [];
  for (let i = 0; i < count; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }
  if (firstNonZero) {
    digits[0] = 1 + Math.floor(Math.random() * 9);
  }
  return digits;
};

// ИНН юрлица — 10 цифр, контрольная (10-я) считается по весам [2,4,10,3,5,9,4,6,8]
const generateRandomInn = (): string => {
  const innWeights = [2, 4, 10, 3, 5, 9, 4, 6, 8];
  const digits = randomDigits(9, true);
  const check = innWeights.reduce((sum, w, i) => sum + digits[i] * w, 0) % 11 % 10;
  return `${digits.join('')}${check}`;
};

// ОГРН — 13 цифр, контрольная (13-я) = (число из первых 12 цифр mod 11) mod 10
const generateRandomOgrn = (): string => {
  const digits = randomDigits(12, true);
  const prefix = BigInt(digits.join(''));
  const check = Number(prefix % 11n % 10n);
  return `${digits.join('')}${check}`;
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
