import { Page, test as base, expect } from '@playwright/test';
import { config, type VPNConfig } from '../config/config';
import { createLoginPage } from '../pages/login-page';
import { createMainPage } from '../pages/main-page';
import { createLkPage } from '../pages/lk-page';

interface TestFixtures {
  testConfig: typeof config;
  loginPage: ReturnType<typeof createLoginPage>;
  mainPage: ReturnType<typeof createMainPage>;
  lkPage: ReturnType<typeof createLkPage>;
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

  mainPage: async ({ page }, use) => {
    const mainPage = createMainPage(page);
    await use(mainPage);
  },

  lkPage: async ({ page }, use) => {
    const lkPage = createLkPage(page);
    await use(lkPage);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = createLoginPage(page);
    await loginPage.open();
    await loginPage.login();
    await use(page);
  },
});

export { expect };
