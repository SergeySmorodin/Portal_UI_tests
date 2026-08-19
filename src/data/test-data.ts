import { TestData } from '../types';

export const testData: TestData = {
  users: {
    admin: {
      username: 'admin',
      password: 'admin123',
    },
    regular: {
      username: 'user',
      password: 'user123',
    },
  },
  urls: {
    login: '/login',
    dashboard: '/dashboard',
    profile: '/profile',
  },
};

export const negativeTestData = {
  wrongPasswords: ['wrong_password', '123456', 'password', ''],
  invalidLogins: ['nonexistent_user', 'test@test.com', ''],
};
