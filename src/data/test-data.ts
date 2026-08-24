import { randomBytes } from 'node:crypto';
import { UserCredentials } from '../types';
import { config } from '../config/config';

const randomToken = (): string => randomBytes(4).toString('hex');

export const urls = {
  login: '/login',
  dashboard: '/dashboard',
  profile: '/profile',
};

/** Базовая фабрика: случайный пользователь + частичные переопределения. */
export const createUser = (
  overrides: Partial<UserCredentials> = {},
): UserCredentials => ({
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
