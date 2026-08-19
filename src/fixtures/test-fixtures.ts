import { test as base, expect } from '@playwright/test';
import { config } from '../config/config';
import { createLoginPage } from '../pages/login-page';
import { testData } from '../data/test-data';

interface TestFixtures {
  testConfig: typeof config;
  loginPage: ReturnType<typeof createLoginPage>;
  authenticatedPage: any;
}

export const test = base.extend<TestFixtures>({
  testConfig: async ({}, use) => {
    await use(config);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = createLoginPage(page);
    await use(loginPage);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = createLoginPage(page);
    await loginPage.open();
    await loginPage.login();
    await use(page);
  },
});

export { expect };
