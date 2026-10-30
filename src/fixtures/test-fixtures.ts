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
import { createSkipRequisitionsPage } from '../pages/skip/skip-requisitions-page';
import { createWorkingToolsPage } from '../pages/services/supervision/working-tools-page';
import { createReportCardPage } from '../pages/services/supervision/report-card-page';
import { createTimeTablePage } from '../pages/services/supervision/time-table-page';
import { createEmployeeTimelinePage } from '../pages/services/supervision/employee-timeline-page';
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
import {
  createUserViaApi,
  deleteUserViaApi,
  nextPersonalNumber,
  type CreateUserOptions,
} from '../test-data/api/user-api';
import { createUserCleanup, type CreatedUser, type UserContextKit } from './user-kit';
import { createPortalWorkerFixture, type CreatePortalWorker } from './portal-worker.fixtures';
import type { ProjectData, WorkData } from '../types';

export type { CreatedUser, UserContextKit } from './user-kit';

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

/** Опции создания пользователя единой фабрикой createUserPage. */
export type CreateUserPageOptions = CreateUserOptions;

/**
 * Создаёт нового пользователя через API (должность и группы — одним запросом)
 * и возвращает его авторизованную page/context. Пользователи создаются
 * изолированно, поэтому тесты не зависят от существующих учёток.
 */
type CreateUserPage = (options?: CreateUserPageOptions) => Promise<UserContextKit>;

/** Роли с реальными учётными записями портала (см. .env). */
export type RoleName = 'leader' | 'head' | 'skip' | 'td' | 'privileged';

export interface RoleSession {
  page: Page;
  context: BrowserContext;
  username: string;
}

const ROLE_CREDENTIALS: Record<RoleName, { login: string; password: string }> = {
  leader: { login: 'LOGIN_LEADER', password: 'PASSWORD_LEADER' },
  head: { login: 'LOGIN_HEAD', password: 'PASSWORD_HEAD' },
  skip: { login: 'LOGIN_SKIP', password: 'PASSWORD_SKIP' },
  td: { login: 'LOGIN_TD', password: 'PASSWORD_TD' },
  privileged: { login: 'LOGIN_PRIVILEGET', password: 'PASSWORD_PRIVILEGET' },
};

/** Авторизуется под реальной учётной записью роли (контекст закрывается после теста). */
type LoginAs = (role: RoleName) => Promise<RoleSession>;

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
  skipRequisitionsPage: ReturnType<typeof createSkipRequisitionsPage>;
  workingToolsPage: ReturnType<typeof createWorkingToolsPage>;
  reportCardPage: ReturnType<typeof createReportCardPage>;
  timeTablePage: ReturnType<typeof createTimeTablePage>;
  employeeTimelinePage: ReturnType<typeof createEmployeeTimelinePage>;
  laborProtectionPage: ReturnType<typeof createLaborProtectionPage>;
  medicalCommissionPage: ReturnType<typeof createMedicalCommissionPage>;
  industrialSafetyPage: ReturnType<typeof createIndustrialSafetyPage>;
  authenticatedPage: Page;
  apiRequest: APIRequestContext;
  createUserPage: CreateUserPage;
  /** Реальные учётные записи ролей согласования табеля. */
  loginAs: LoginAs;
  /** Фабрика сотрудников для «Доступного персонала» (создаются и удаляются через API). */
  createPortalWorker: CreatePortalWorker;
  createdProject: CreatedProject;
  createdWork: CreatedWork;
  createdWorkExecution: CreatedWork;
  /** Работа, созданная через UI, со статусом «Выполнение работы». */
  createdWorkUi: CreatedWork;
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

  skipRequisitionsPage: async ({ authenticatedPage }, use) => {
    const skipRequisitionsPage = createSkipRequisitionsPage(authenticatedPage);
    await use(skipRequisitionsPage);
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

  employeeTimelinePage: async ({ authenticatedPage }, use) => {
    const employeeTimelinePage = createEmployeeTimelinePage(authenticatedPage);
    await use(employeeTimelinePage);
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
    const project = projectFactory.active({
      groupProject: 'sk_intra',
      typeProject: 'Работа (услуга)',
      departmentProject: '106.01.12.00 Производственная служба',
      kindProject: 'ЕПС',
      note: 'Автотест d57f85d8',
    });
    project.organization = 'СЕРВИС';
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

  createdWorkUi: async (
    { createdProject, projectsListPage, worksListPage, workPage, authenticatedPage },
    use
  ) => {
    const { project } = createdProject;
    const work = workFactory.standard({
      startDate: formatDmy(addDays(today(), 1)),
      stopDate: project.stopDate,
    });
    const creationTimeout = 60_000;

    await projectsListPage.open();
    await projectsListPage.searchByCode(project.code);
    await projectsListPage.openWorks(project.code);
    await worksListPage.addWork();
    await authenticatedPage.waitForLoadState('networkidle').catch(() => {});

    await workPage.selectContract();
    await workPage.fillBasicFields(work);

    const created = authenticatedPage.waitForResponse(
      (response) =>
        response.url().includes('/api/project/create/') && response.request().method() === 'POST',
      { timeout: creationTimeout }
    );
    await workPage.save();

    const { pk: workPk } = (await (await created).json()) as { pk: string };
    await authenticatedPage.waitForURL((url) => url.pathname.includes('/TDO/Work/edit/'), {
      timeout: creationTimeout,
    });
    await authenticatedPage.waitForLoadState('networkidle').catch(() => {});

    await workPage.setStatus('Выполнение работы');
    await workPage.saveChanges();

    await use({ ...createdProject, work, workPk });
  },

  createdUser: async ({ request, apiRequest }, use) => {
    const user = await createUserViaApi(request, userFactory.regular());
    await use(user);
    await deleteUserViaApi(apiRequest, user.uuid);
  },

  createUserPage: async ({ browser, request, apiRequest }, use) => {
    const cleanup = createUserCleanup(apiRequest);

    const createUserPage: CreateUserPage = async (options = {}) => {
      const hasPosition = Boolean(options.position);

      // Для пользователя с должностью ставка и табельный номер обязательны.
      const user = await createUserViaApi(request, userFactory.regular(), {
        ...options,
        ratePay: options.ratePay ?? (hasPosition ? '1.00' : undefined),
        personalNumber: options.personalNumber ?? (hasPosition ? nextPersonalNumber() : undefined),
      });

      const context = await browser.newContext();
      cleanup.track(user.uuid, context);
      try {
        const page = await context.newPage();

        const loginPage = createLoginPage(page);
        await loginPage.open();
        await loginPage.login({ username: user.username, password: user.password });
        await loginPage.waitForLoginSuccess();

        return { page, context, user };
      } catch (error) {
        // Пользователь уже создан в портале — оставлять его нельзя.
        await cleanup.discard(user.uuid);
        throw error;
      }
    };

    await use(createUserPage);
    await cleanup.run();
  },

  createPortalWorker: createPortalWorkerFixture,

  loginAs: async ({ browser }, use) => {
    const contexts: BrowserContext[] = [];

    const loginAs: LoginAs = async (role) => {
      const env = ROLE_CREDENTIALS[role];
      const username = process.env[env.login];
      const password = process.env[env.password];
      if (!username || !password) {
        throw new Error(`Не заданы ${env.login}/${env.password} в .env`);
      }

      const context = await browser.newContext();
      contexts.push(context);
      const page = await context.newPage();
      const loginPage = createLoginPage(page);
      await loginPage.open();
      await loginPage.login({ username, password });
      await loginPage.waitForLoginSuccess();

      return { page, context, username };
    };

    await use(loginAs);
    await Promise.all(contexts.map((context) => context.close()));
  },
});

export { expect };
