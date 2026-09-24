import { APIRequestContext, BrowserContext, Page, test as base, expect } from '@playwright/test';
import { config, type AppConfig } from '../config';
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
  createCertificationDetailPage,
} from '../pages/certification/certification-page';
import { createResourcePlanningPage } from '../pages/services/supervision/resource-planning-page';
import { createDistributionRequestsPage } from '../pages/services/supervision/distribution-requests-page';
import { createWorkingToolsPage } from '../pages/services/supervision/working-tools-page';
import { createReportCardPage } from '../pages/services/supervision/report-card-page';
import { createTimeTablePage } from '../pages/services/supervision/time-table-page';
import { createLaborProtectionPage } from '../pages/ot-pb/labor-protection-page';
import { createMedicalCommissionPage } from '../pages/ot-pb/medical-commission-page';
import { createIndustrialSafetyPage } from '../pages/ot-pb/industrial-safety-page';
import { projectFactory } from '../test-data/factory/project-factory';
import { workFactory } from '../test-data/factory/work-factory';
import { userFactory } from '../test-data/factory/user-factory';
import { addDays, formatDmy, today } from '../utils/date';
import {
  createProjectViaApi,
  createWorkViaApi,
  getFirstContractPk,
} from '../test-data/api/project-api';
import { createUserViaApi, deleteUserViaApi } from '../test-data/api/user-api';
import type { ProjectData, UserCredentials, WorkData } from '../types';

export interface UserContextKit {
  page: Page;
  context: BrowserContext;
  /** Данные созданного через API пользователя, под которым авторизована page. */
  user: CreatedUser;
}

export interface CreatedProject {
  /** Данные созданного мегапроекта (для обращения в тесте). */
  project: ProjectData;
  projectPk: string;
  projectCode: string;
}

export interface CreatedWork extends CreatedProject {
  /** Данные созданной через API работы (даты привязаны к мегапроекту). */
  work: WorkData;
  workPk: string;
}

export interface CreatedUser extends UserCredentials {
  /** uuid созданного через API пользователя. */
  uuid: string;
}

/**
 * Создаёт нового пользователя через API и возвращает его авторизованную page/context.
 * Пользователи создаются изолированно, поэтому тесты не зависят от существующих учёток.
 */
type CreateUserPage = (overrides?: Partial<UserCredentials>) => Promise<UserContextKit>;

export interface TestFixtures {
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
  certificationDetailPage: ReturnType<typeof createCertificationDetailPage>;
  resourcePlanningPage: ReturnType<typeof createResourcePlanningPage>;
  distributionRequestsPage: ReturnType<typeof createDistributionRequestsPage>;
  workingToolsPage: ReturnType<typeof createWorkingToolsPage>;
  reportCardPage: ReturnType<typeof createReportCardPage>;
  timeTablePage: ReturnType<typeof createTimeTablePage>;
  laborProtectionPage: ReturnType<typeof createLaborProtectionPage>;
  medicalCommissionPage: ReturnType<typeof createMedicalCommissionPage>;
  industrialSafetyPage: ReturnType<typeof createIndustrialSafetyPage>;
  authenticatedPage: Page;
  apiRequest: APIRequestContext;
  createUserPage: CreateUserPage;
  createdProject: CreatedProject;
  createdWork: CreatedWork;
  createdWorkExecution: CreatedWork;
  createdUser: CreatedUser;
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

  certificationDetailPage: async ({ authenticatedPage }, use) => {
    const certificationDetailPage = createCertificationDetailPage(authenticatedPage);
    await use(certificationDetailPage);
  },

  resourcePlanningPage: async ({ authenticatedPage }, use) => {
    const resourcePlanningPage = createResourcePlanningPage(authenticatedPage);
    await use(resourcePlanningPage);
  },

  distributionRequestsPage: async ({ authenticatedPage }, use) => {
    const distributionRequestsPage = createDistributionRequestsPage(authenticatedPage);
    await use(distributionRequestsPage);
  },

  workingToolsPage: async ({ authenticatedPage }, use) => {
    const workingToolsPage = createWorkingToolsPage(authenticatedPage);
    await use(workingToolsPage);
  },

  reportCardPage: async ({ authenticatedPage }, use) => {
    const reportCardPage = createReportCardPage(authenticatedPage);
    await use(reportCardPage);
  },

  timeTablePage: async ({ authenticatedPage }, use) => {
    const timeTablePage = createTimeTablePage(authenticatedPage);
    await use(timeTablePage);
  },

  laborProtectionPage: async ({ authenticatedPage }, use) => {
    const laborProtectionPage = createLaborProtectionPage(authenticatedPage);
    await use(laborProtectionPage);
  },

  medicalCommissionPage: async ({ authenticatedPage }, use) => {
    const medicalCommissionPage = createMedicalCommissionPage(authenticatedPage);
    await use(medicalCommissionPage);
  },

  industrialSafetyPage: async ({ authenticatedPage }, use) => {
    const industrialSafetyPage = createIndustrialSafetyPage(authenticatedPage);
    await use(industrialSafetyPage);
  },

  authenticatedPage: async ({ page }, use) => {
    await use(page);
  },

  apiRequest: async ({ authenticatedPage }, use) => {
    await use(authenticatedPage.context().request);
  },

  createdProject: async ({ apiRequest }, use) => {
    const project = projectFactory.active();
    const { pk, code } = await createProjectViaApi(apiRequest, project);
    await use({ project, projectPk: pk, projectCode: code });
  },

  createdWork: async ({ apiRequest, createdProject }, use) => {
    const { project, projectPk } = createdProject;
    const work = workFactory.standard({
      startDate: formatDmy(addDays(today(), 1)),
      stopDate: project.stopDate,
    });
    const contractPk = await getFirstContractPk(apiRequest);
    const workPk = await createWorkViaApi(apiRequest, work, {
      megaProjectPk: projectPk,
      contractPk,
    });
    await use({ ...createdProject, work, workPk });
  },

  createdWorkExecution: async ({ apiRequest, createdProject }, use) => {
    const { project, projectPk } = createdProject;
    const work = workFactory.standard({
      startDate: formatDmy(addDays(today(), 1)),
      stopDate: project.stopDate,
    });
    const contractPk = await getFirstContractPk(apiRequest);
    const workPk = await createWorkViaApi(apiRequest, work, {
      megaProjectPk: projectPk,
      contractPk,
      status: 'Выполнение работы',
    });
    await use({ ...createdProject, work, workPk });
  },

  createdUser: async ({ apiRequest }, use) => {
    const user = await createUserViaApi(apiRequest, userFactory.regular());
    await use(user);
    await deleteUserViaApi(apiRequest, user.uuid);
  },

  createUserPage: async ({ browser, apiRequest }, use) => {
    const contexts: BrowserContext[] = [];
    const users: CreatedUser[] = [];

    const createUserPage: CreateUserPage = async (overrides) => {
      const user = await createUserViaApi(apiRequest, userFactory.regular(overrides));
      users.push(user);

      const context = await browser.newContext();
      contexts.push(context);
      const page = await context.newPage();

      const loginPage = createLoginPage(page);
      await loginPage.open();
      await loginPage.login({ username: user.username, password: user.password });
      await loginPage.waitForLoginSuccess();

      return { page, context, user };
    };

    await use(createUserPage);

    for (const context of contexts) {
      await context.close();
    }
    for (const user of users) {
      await deleteUserViaApi(apiRequest, user.uuid);
    }
  },
});

export { expect };
