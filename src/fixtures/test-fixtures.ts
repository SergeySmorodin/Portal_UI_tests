import { BrowserContext, Page, test as base, expect } from '@playwright/test';
import { config, type AppConfig } from '../config/config';
import { authUsers } from '../../global-setup';
import { createLoginPage } from '../pages/login/login-page';
import { createMainPage } from '../pages/main/main-page';
import { createLkPage } from '../pages/profile/lk-page';
import { createContractPage, createContractsListPage } from '../pages/tdo/contract-page';
import { createProjectPage, createProjectsListPage } from '../pages/tdo/project-page';
import {
  createWorkPage,
  createWorksListPage,
  createAllWorksListPage,
} from '../pages/tdo/work-page';
import { createCompanyPage, createCompaniesListPage } from '../pages/counterparties/company-page';
import { createCuratorPage, createCuratorsListPage } from '../pages/counterparties/curator-page';
import {
  createCertificationUploadPage,
  createCertificationSearchPage,
} from '../pages/certification/certification-page';

export interface UserContextKit {
  page: Page;
  context: BrowserContext;
}

type CreateUserPage = (userId: string) => Promise<UserContextKit>;

interface TestFixtures {
  testConfig: typeof config;
  loginPage: ReturnType<typeof createLoginPage>;
  mainPage: ReturnType<typeof createMainPage>;
  lkPage: ReturnType<typeof createLkPage>;
  contractPage: ReturnType<typeof createContractPage>;
  contractsListPage: ReturnType<typeof createContractsListPage>;
  projectPage: ReturnType<typeof createProjectPage>;
  projectsListPage: ReturnType<typeof createProjectsListPage>;
  workPage: ReturnType<typeof createWorkPage>;
  worksListPage: ReturnType<typeof createWorksListPage>;
  allWorksListPage: ReturnType<typeof createAllWorksListPage>;
  companyPage: ReturnType<typeof createCompanyPage>;
  companiesListPage: ReturnType<typeof createCompaniesListPage>;
  curatorPage: ReturnType<typeof createCuratorPage>;
  curatorsListPage: ReturnType<typeof createCuratorsListPage>;
  certificationUploadPage: ReturnType<typeof createCertificationUploadPage>;
  certificationSearchPage: ReturnType<typeof createCertificationSearchPage>;
  authenticatedPage: Page;
  createUserPage: CreateUserPage;
}

export const test = base.extend<TestFixtures>({
  testConfig: async (
    // Playwright требует объектный деструктуринг в сигнатуре фикстуры,
    // хотя фикстура не использует входящие fixture-объекты.
    /* eslint-disable-next-line no-empty-pattern */
    {}: { page: Page },
    use: (config: AppConfig) => Promise<void>
  ) => {
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

  contractsListPage: async ({ authenticatedPage }, use) => {
    const contractsListPage = createContractsListPage(authenticatedPage);
    await use(contractsListPage);
  },

  projectPage: async ({ authenticatedPage }, use) => {
    const projectPage = createProjectPage(authenticatedPage);
    await use(projectPage);
  },

  projectsListPage: async ({ authenticatedPage }, use) => {
    const projectsListPage = createProjectsListPage(authenticatedPage);
    await use(projectsListPage);
  },

  workPage: async ({ authenticatedPage }, use) => {
    const workPage = createWorkPage(authenticatedPage);
    await use(workPage);
  },

  worksListPage: async ({ authenticatedPage }, use) => {
    const worksListPage = createWorksListPage(authenticatedPage);
    await use(worksListPage);
  },

  allWorksListPage: async ({ authenticatedPage }, use) => {
    const allWorksListPage = createAllWorksListPage(authenticatedPage);
    await use(allWorksListPage);
  },

  companyPage: async ({ authenticatedPage }, use) => {
    const companyPage = createCompanyPage(authenticatedPage);
    await use(companyPage);
  },

  companiesListPage: async ({ authenticatedPage }, use) => {
    const companiesListPage = createCompaniesListPage(authenticatedPage);
    await use(companiesListPage);
  },

  curatorPage: async ({ authenticatedPage }, use) => {
    const curatorPage = createCuratorPage(authenticatedPage);
    await use(curatorPage);
  },

  curatorsListPage: async ({ authenticatedPage }, use) => {
    const curatorsListPage = createCuratorsListPage(authenticatedPage);
    await use(curatorsListPage);
  },

  certificationUploadPage: async ({ authenticatedPage }, use) => {
    const certificationUploadPage = createCertificationUploadPage(authenticatedPage);
    await use(certificationUploadPage);
  },

  certificationSearchPage: async ({ authenticatedPage }, use) => {
    const certificationSearchPage = createCertificationSearchPage(authenticatedPage);
    await use(certificationSearchPage);
  },

  authenticatedPage: async ({ page }, use) => {
    await use(page);
  },

  createUserPage: async ({ browser }, use) => {
    const createUserPage: CreateUserPage = async (userId) => {
      const user = authUsers.find((u) => u.id === userId);
      if (!user) {
        throw new Error(
          `Пользователь "${userId}" не настроен. Укажите соответствующие LOGIN_*/PASSWORD_* в .env. Доступно: ${authUsers.map((u) => u.id).join(', ')}.`
        );
      }
      const context = await browser.newContext({ storageState: user.storageStatePath });
      const page = await context.newPage();
      return { page, context };
    };
    await use(createUserPage);
  },
});

export { expect };
