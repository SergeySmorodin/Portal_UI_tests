import { randomBytes } from 'node:crypto';
import { CuratorData } from '../types';
import { formatDmy, randomDate } from '../utils/date';

const randomToken = (): string => randomBytes(4).toString('hex');

const generateBirthDate = (): string => {
  const from = new Date(1960, 0, 1);
  const to = new Date(2000, 11, 31);
  return formatDmy(randomDate(from, to));
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
