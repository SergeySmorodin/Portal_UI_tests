import { randomBytes } from 'node:crypto';
import { UserCredentials, ContractData, ProjectData, CompanyData, CuratorData } from '../types';
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

const generateRandomDigits = (length: number): string => {
  let num = '';
  for (let i = 0; i < length; i++) num += Math.floor(Math.random() * 10);
  return num;
};

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
