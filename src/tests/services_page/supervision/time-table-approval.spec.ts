import { APIRequestContext, Page } from '@playwright/test';
import { config } from '../../../config';
import { approveVisitsViaApi, areVisitsApproved } from '../../../test-data/api/project-api';
import { expect, test, type CreateUserPageOptions, type UserContextKit } from '../../../fixtures/test-fixtures';
import { createResourcePlanningPage } from '../../../pages/services/supervision/resource-planning-page';
import { createWorkingToolsPage } from '../../../pages/services/supervision/working-tools-page';
import { createReportCardPage } from '../../../pages/services/supervision/report-card-page';
import { createTimeTablePage } from '../../../pages/services/supervision/time-table-page';

const VISIT_COUNT = 2;

type CreatePortalUser = (options?: CreateUserPageOptions) => Promise<UserContextKit>;

const makeProfile = (lastName: string) => ({
  lastName,
  firstName: 'Тест',
  patronymic: 'Тестович',
  email: `${Date.now()}@example.com`,
});

const createServiceHead = (createUserPage: CreatePortalUser): Promise<UserContextKit> =>
  createUserPage({
    groups: ['supervising_privileged_employee'],
    position: '581',
    profile: makeProfile('РуководительРабот'),
  });

const createServiceLeader = (createUserPage: CreatePortalUser): Promise<UserContextKit> =>
  createUserPage({
    groups: ['supervising_leader'],
    position: '581',
    profile: makeProfile('РуководительСлужбы'),
  });

const createSkipEmployee = (createUserPage: CreatePortalUser): Promise<UserContextKit> =>
  createUserPage({
    groups: ['skip_employee'],
    profile: makeProfile('СотрудникСКИП'),
  });

const createOriginDirector = (createUserPage: CreatePortalUser): Promise<UserContextKit> =>
  createUserPage({
    groups: ['origin_service_director'],
    profile: makeProfile('ТехническийДиректор'),
  });

const prepareSubmittedTimeTable = async (
  head: UserContextKit,
  apiRequest: APIRequestContext,
  project: { code: string },
  work: { name: string; stopDate: string },
  workPk: string
): Promise<void> => {
  const resourcePlanningPage = createResourcePlanningPage(head.page);

  await resourcePlanningPage.openWorkByPk(workPk);
  const addedWorkers = await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
  expect(addedWorkers).toHaveLength(VISIT_COUNT);
  await resourcePlanningPage.saveVisitsPersisted(apiRequest, workPk, VISIT_COUNT);

  await approveVisitsViaApi(apiRequest, workPk);
  await expect
    .poll(() => areVisitsApproved(apiRequest, workPk), { timeout: config.timeouts.long })
    .toBe(true);

  const workingToolsPage = createWorkingToolsPage(head.page);
  await workingToolsPage.open();
  await workingToolsPage.searchProject(project.code);
  await workingToolsPage.openProject(project.code);
  await workingToolsPage.findWork(work.name);
  await workingToolsPage.openReportCard(work.name);

  const reportCardPage = createReportCardPage(head.page);
  await reportCardPage.waitForLoaded(work.name);

  await reportCardPage.createPeriods();
  await reportCardPage.waitForLoaded(work.name);

  await reportCardPage.openRateRows();
  for (const name of addedWorkers) {
    await reportCardPage.fillRate(name, '500');
    await reportCardPage.fillWorkHours(name, [0, 1, 2], '8');
  }

  await reportCardPage.save();
  await reportCardPage.waitForLoaded(work.name);

  await reportCardPage.openApproval();
  await reportCardPage.submitApproval(work.stopDate);

  await expect
    .poll(() => reportCardPage.getPeriodsCount(), { timeout: config.timeouts.long })
    .toBeGreaterThan(0);
};

const approveTimeTable = async (page: Page, periodEnd: string): Promise<void> => {
  await page.locator('button:has(i.fa-file-signature)').first().click();

  const modal = page
    .locator('div.fixed.inset-0')
    .filter({ has: page.getByText('Согласование табеля') })
    .last();
  await modal.waitFor({ state: 'visible', timeout: config.timeouts.long });

  await modal.locator('input[placeholder="дд-мм-гггг"]').fill(periodEnd);
  await page.keyboard.press('Escape');

  const submit = modal
    .locator('button')
    .filter({ hasText: /Согласован|Отправить/ })
    .first();
  await submit.click();
  await modal.waitFor({ state: 'hidden', timeout: config.timeouts.long });
};

const leaderApproves = async (
  leader: UserContextKit,
  project: { code: string },
  work: { name: string; stopDate: string }
): Promise<void> => {
  const timeTablePage = createTimeTablePage(leader.page);
  await timeTablePage.open();
  await timeTablePage.searchProject(project.code);
  await timeTablePage.expectWorkVisible(work.name);
  await timeTablePage.openApproval(work.name);
  await timeTablePage.waitForApprovalLoaded(work.name);
  await approveTimeTable(leader.page, work.stopDate);
};

const skipApproves = async (
  skipUser: UserContextKit,
  project: { code: string },
  work: { name: string; stopDate: string }
): Promise<void> => {
  await skipUser.page.goto('/SKIP/approval/time-table');
  const search = skipUser.page.getByPlaceholder('Название проекта...');
  await search.waitFor({ state: 'visible', timeout: config.timeouts.long });
  await search.fill(project.code);
  await skipUser.page.waitForLoadState('networkidle').catch(() => {});

  const workButton = skipUser.page.getByRole('button', { name: work.name }).first();
  await workButton.waitFor({ state: 'visible', timeout: config.timeouts.long });
  await workButton.click();
  await skipUser.page.waitForURL(
    (url) => url.pathname.includes('/SKIP/approval/time-table/approval/'),
    { timeout: config.timeouts.long }
  );
  await skipUser.page
    .getByRole('heading', { name: `Согласование табеля работы ${work.name}` })
    .waitFor({ state: 'visible', timeout: config.timeouts.long });

  await approveTimeTable(skipUser.page, work.stopDate);
};

const directorApproves = async (
  director: UserContextKit,
  project: { code: string },
  work: { name: string; stopDate: string }
): Promise<void> => {
  await director.page.goto('/TechnicalDirector/approval/time-table');
  const search = director.page.getByPlaceholder('Название проекта...');
  await search.waitFor({ state: 'visible', timeout: config.timeouts.long });
  await search.fill(project.code);
  await director.page.waitForLoadState('networkidle').catch(() => {});

  const workButton = director.page.getByRole('button', { name: work.name }).first();
  await workButton.waitFor({ state: 'visible', timeout: config.timeouts.long });
  await workButton.click();
  await director.page.waitForURL(
    (url) => url.pathname.includes('/TechnicalDirector/approval/time-table/approval/'),
    { timeout: config.timeouts.long }
  );
  await director.page
    .getByRole('heading', { name: `Согласование табеля работы ${work.name}` })
    .waitFor({ state: 'visible', timeout: config.timeouts.long });

  await approveTimeTable(director.page, work.stopDate);
};

test.describe('Согласование табелей', () => {
  test.describe.configure({ timeout: 300_000 });

  test('СЦЕНАРИЙ 1. Привилегированный сотрудник заполняет табель и отправляет на согласование', async ({
    apiRequest,
    createdWorkExecution,
    createUserPage,
  }) => {
    const { project, work, workPk } = createdWorkExecution;
    const head = await createServiceHead(createUserPage);

    await prepareSubmittedTimeTable(head, apiRequest, project, work, workPk);
  });

  test('СЦЕНАРИЙ 2. Руководитель службы согласовывает табель', async ({
    apiRequest,
    createdWorkExecution,
    createUserPage,
  }) => {
    const { project, work, workPk, projectPk } = createdWorkExecution;
    const head = await createServiceHead(createUserPage);

    await prepareSubmittedTimeTable(head, apiRequest, project, work, workPk);

    const leader = await createServiceLeader(createUserPage);
    await leaderApproves(leader, project, work);

    await head.page.goto(`/services/supervision/project/${projectPk}/reportcard`);
    const reportCardPage = createReportCardPage(head.page);
    await reportCardPage.waitForLoaded(work.name);
    await expect(head.page.locator('[title^="Руководитель службы - "]')).toBeVisible({
      timeout: config.timeouts.long,
    });
  });

  test('СЦЕНАРИЙ 3. Отдел планирования обрабатывает табель', async ({
    apiRequest,
    createdWorkExecution,
    createUserPage,
  }) => {
    const { project, work, workPk, projectPk } = createdWorkExecution;
    const head = await createServiceHead(createUserPage);

    await prepareSubmittedTimeTable(head, apiRequest, project, work, workPk);

    const leader = await createServiceLeader(createUserPage);
    await leaderApproves(leader, project, work);

    const skipUser = await createSkipEmployee(createUserPage);

    await skipUser.page.goto('/SKIP/approval/time-table');
    const search = skipUser.page.getByPlaceholder('Название проекта...');
    await search.waitFor({ state: 'visible', timeout: config.timeouts.long });
    await search.fill(project.code);
    await skipUser.page.waitForLoadState('networkidle').catch(() => {});

    await expect(skipUser.page.getByText('На согласование')).toBeVisible({
      timeout: config.timeouts.long,
    });
    await expect(skipUser.page.getByText('Отдел планирования')).toBeVisible({
      timeout: config.timeouts.long,
    });

    await skipApproves(skipUser, project, work);

    await head.page.goto(`/services/supervision/project/${projectPk}/reportcard`);
    const reportCardPage = createReportCardPage(head.page);
    await reportCardPage.waitForLoaded(work.name);
    await expect(head.page.locator('[title^="Отдел планирования - "]')).toBeVisible({
      timeout: config.timeouts.long,
    });
  });

  test('СЦЕНАРИЙ 4. Технический директор согласовывает табель', async ({
    apiRequest,
    createdWorkExecution,
    createUserPage,
  }) => {
    const { project, work, workPk, projectPk } = createdWorkExecution;
    const head = await createServiceHead(createUserPage);

    await prepareSubmittedTimeTable(head, apiRequest, project, work, workPk);

    const leader = await createServiceLeader(createUserPage);
    await leaderApproves(leader, project, work);

    const skipUser = await createSkipEmployee(createUserPage);
    await skipApproves(skipUser, project, work);

    const director = await createOriginDirector(createUserPage);
    await directorApproves(director, project, work);

    await head.page.goto(`/services/supervision/project/${projectPk}/reportcard`);
    const reportCardPage = createReportCardPage(head.page);
    await reportCardPage.waitForLoaded(work.name);
    await expect(head.page.locator('[title^="Технический директор - "]')).toBeVisible({
      timeout: config.timeouts.long,
    });
  });

  test('СЦЕНАРИЙ 5. Создатель табеля проверяет все статусы согласования', async ({
    apiRequest,
    createdWorkExecution,
    createUserPage,
  }) => {
    const { project, work, workPk, projectPk } = createdWorkExecution;
    const head = await createServiceHead(createUserPage);

    await prepareSubmittedTimeTable(head, apiRequest, project, work, workPk);

    const leader = await createServiceLeader(createUserPage);
    await leaderApproves(leader, project, work);

    const skipUser = await createSkipEmployee(createUserPage);
    await skipApproves(skipUser, project, work);

    const director = await createOriginDirector(createUserPage);
    await directorApproves(director, project, work);

    await head.page.goto(`/services/supervision/project/${projectPk}/reportcard`);
    const reportCardPage = createReportCardPage(head.page);
    await reportCardPage.waitForLoaded(work.name);

    await expect(head.page.getByText('Полностью согласован')).toBeVisible({
      timeout: config.timeouts.long,
    });
    await expect(head.page.getByText('Руководитель службы')).toBeVisible({
      timeout: config.timeouts.long,
    });
    await expect(head.page.getByText('Отдел планирования')).toBeVisible({
      timeout: config.timeouts.long,
    });
    await expect(head.page.getByText('Технический директор')).toBeVisible({
      timeout: config.timeouts.long,
    });
  });
});
