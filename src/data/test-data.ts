import { randomBytes } from 'node:crypto';
import { UserCredentials, ContractData, ProjectData } from '../types';
import { config } from '../config/config';

const randomToken = (): string => randomBytes(4).toString('hex');

export const urls = {
  login: '/login',
  dashboard: '/dashboard',
  profile: '/profile',
};

/** Базовая фабрика: случайный пользователь + частичные переопределения. */
export const createUser = (overrides: Partial<UserCredentials> = {}): UserCredentials => ({
  username: `user_${randomToken()}`,
  password: `Pwd_${randomToken()}!1`,
  ...overrides,
});

export const userFactory = {
  admin: (overrides: Partial<UserCredentials> = {}) =>
    createUser({
      username: config.login || 'admin',
      password: config.password || 'admin123',
      ...overrides,
    }),

  regular: (overrides: Partial<UserCredentials> = {}) => createUser(overrides),

  withWrongPassword: (username?: string) =>
    createUser({
      username: username ?? (config.login || 'admin'),
      password: 'wrong_password',
    }),

  empty: () => createUser({ username: '', password: '' }),
};

const generateTodayDate = (): string => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const generateRandomMoney = (): string => {
  return String(Math.floor(Math.random() * 9000000) + 100000);
};

/** Базовая фабрика договора: уникальный номер + частичные переопределения. */
export const createContract = (overrides: Partial<ContractData> = {}): ContractData => ({
  contractNumber: `ТЕСТ-${Date.now()}-${randomToken()}`,
  date: generateTodayDate(),
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

const generateStartDate = (): string => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const generateStopDate = (): string => {
  const now = new Date();
  now.setMonth(now.getMonth() + 3);
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export const createProject = (overrides: Partial<ProjectData> = {}): ProjectData => ({
  code: `ТЕСТ-${Date.now()}-${randomToken()}`,
  status: 'Черновик',
  startDate: generateStartDate(),
  stopDate: generateStopDate(),
  groupProject: '',
  typeProject: '',
  departmentProject: '',
  kindProject: '',
  note: `Автотест ${randomToken()}`,
  ...overrides,
});

export const projectFactory = {
  draft: (overrides: Partial<ProjectData> = {}) =>
    createProject({ status: 'Черновик', ...overrides }),

  active: (overrides: Partial<ProjectData> = {}) =>
    createProject({ status: 'Действующий', ...overrides }),
};
