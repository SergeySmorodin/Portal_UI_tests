import { Page, test as base, expect } from '@playwright/test';
import { config, type VPNConfig } from '../config/config';
import { createLoginPage } from '../pages/login-page';
import { createMainPage } from '../pages/main-page';
import { createLkPage } from '../pages/lk-page';
import { createContractPage } from '../pages/contract-page';

interface TestFixtures {
  testConfig: typeof config;
  loginPage: ReturnType<typeof createLoginPage>;
  mainPage: ReturnType<typeof createMainPage>;
  lkPage: ReturnType<typeof createLkPage>;
  contractPage: ReturnType<typeof createContractPage>;
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

  mainPage: async ({ authenticatedPage }, use) => {
    const mainPage = createMainPage(authenticatedPage);
    await use(mainPage);
  },

  lkPage: async ({ authenticatedPage }, use) => {
    const lkPage = createLkPage(authenticatedPage);
    await use(lkPage);
  },

  contractPage: async ({ authenticatedPage }, use) => {
    const contractPage = createContractPage(authenticatedPage);
    await use(contractPage);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = createLoginPage(page);
    await loginPage.open();
    await loginPage.login();
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
    await use(page);
  },
});

export { expect };
