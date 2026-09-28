import { randomBytes, randomInt } from 'node:crypto';
import { UserRegistrationData } from '../../types';
import { config } from '../../config';

const randomToken = (): string => randomBytes(4).toString('hex');
const generatedSnils = new Set<string>();

const generateSnils = (): string => {
  let snils: string;

  do {
    const digits = Array.from({ length: 9 }, () => randomInt(0, 10));
    digits[0] = randomInt(1, 10);

    const remainder = digits.reduce((sum, digit, index) => sum + digit * (9 - index), 0) % 101;
    const checksum = (remainder >= 100 ? remainder - 100 : remainder).toString().padStart(2, '0');

    snils = `${digits.join('')}${checksum}`;
  } while (generatedSnils.has(snils));

  generatedSnils.add(snils);
  return snils;
};

export const createUser = (
  overrides: Partial<UserRegistrationData> = {}
): UserRegistrationData => ({
  username: `user_${randomToken()}`,
  password: `Pwd_${randomToken()}!1`,
  snils: generateSnils(),
  ...overrides,
});

export const userFactory = {
  admin: (overrides: Partial<UserRegistrationData> = {}) =>
    createUser({
      username: config.login,
      password: config.password,
      ...overrides,
    }),

  regular: (overrides: Partial<UserRegistrationData> = {}) => createUser(overrides),

  withWrongPassword: (username?: string) =>
    createUser({
      username: username ?? config.login,
      password: 'wrong_password',
    }),

  empty: () => createUser({ username: '', password: '' }),
};
