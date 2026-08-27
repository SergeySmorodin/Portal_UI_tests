import { randomBytes } from 'node:crypto';
import { CuratorData } from '../types';

const randomToken = (): string => randomBytes(4).toString('hex');

const generateBirthDate = (): string => {
  const day = String(Math.floor(Math.random() * 27) + 1).padStart(2, '0');
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const year = String(Math.floor(Math.random() * 40) + 1960);
  return `${day}-${month}-${year}`;
};

/** Базовая фабрика куратора: уникальное ФИО + частичные переопределения. */
export const createCurator = (overrides: Partial<CuratorData> = {}): CuratorData => ({
  lastName: `Тестов${Date.now()}${randomToken()}`,
  firstName: 'Иван',
  patronymic: 'Иванович',
  position: 'Инженер',
  department: `Отдел ${randomToken()}`,
  email: `curator_${randomToken()}@example.com`,
  dateBirth: generateBirthDate(),
  about: `Автотест ${randomToken()}`,
  companySearch: 'Интра',
  ...overrides,
});

export const curatorFactory = {
  default: (overrides: Partial<CuratorData> = {}) => createCurator(overrides),
};
