import { randomBytes } from 'node:crypto';
import { ContractData } from '../types';
import { formatDmy, today } from '../utils/date';

const randomToken = (): string => randomBytes(4).toString('hex');

const generateRandomMoney = (): string => {
  return String(Math.floor(Math.random() * 9000000) + 100000);
};

/** Базовая фабрика договора: уникальный номер + частичные переопределения. */
export const createContract = (overrides: Partial<ContractData> = {}): ContractData => ({
  contractNumber: `ТЕСТ-${Date.now()}-${randomToken()}`,
  date: formatDmy(today()),
  money: generateRandomMoney(),
  status: 'Подписанный договор',
  companySearch: 'Инт',
  ...overrides,
});

export const contractFactory = {
  signed: (overrides: Partial<ContractData> = {}) =>
    createContract({ status: 'Подписанный договор', ...overrides }),

  inProgress: (overrides: Partial<ContractData> = {}) =>
    createContract({ status: 'На подписании/согласовании', ...overrides }),

  withLetter: (overrides: Partial<ContractData> = {}) =>
    createContract({ status: 'Гарантийное письмо', ...overrides }),
};
