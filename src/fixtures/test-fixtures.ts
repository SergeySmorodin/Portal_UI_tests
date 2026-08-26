import { Page, test as base, expect } from '@playwright/test';
import { config, type VPNConfig } from '../config/config';
import { createLoginPage } from '../pages/login/login-page';
import { createMainPage } from '../pages/main/main-page';
import { createLkPage } from '../pages/personal/lk-page';
import { createContractPage } from '../pages/tdo/contract-page';
import { createProjectPage, createProjectsListPage } from '../pages/tdo/project-page';

interface TestFixtures {
  testConfig: typeof config;
  loginPage: ReturnType<typeof createLoginPage>;
  mainPage: ReturnType<typeof createMainPage>;
  lkPage: ReturnType<typeof createLkPage>;
  contractPage: ReturnType<typeof createContractPage>;
  projectPage: ReturnType<typeof createProjectPage>;
  projectsListPage: ReturnType<typeof createProjectsListPage>;
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

  projectPage: async ({ authenticatedPage }, use) => {
    const projectPage = createProjectPage(authenticatedPage);
    await use(projectPage);
  },

  projectsListPage: async ({ authenticatedPage }, use) => {
    const projectsListPage = createProjectsListPage(authenticatedPage);
    await use(projectsListPage);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = createLoginPage(page);
    await loginPage.open();
    await loginPage.login();
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: config.timeouts.long });
    await use(page);
  },
});

export { expect };
