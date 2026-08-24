import { Page, test as base, expect } from '@playwright/test';
import { config, type VPNConfig } from '../config/config';
import { createLoginPage } from '../pages/login-page';

interface TestFixtures {
  testConfig: typeof config;
  loginPage: ReturnType<typeof createLoginPage>;
  authenticatedPage: Page;
}

export const test = base.extend<TestFixtures>({
  testConfig: async ({}: { page: Page }, use: (config: VPNConfig) => Promise<void>) => {
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
