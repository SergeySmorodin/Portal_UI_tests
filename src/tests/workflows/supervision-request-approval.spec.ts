import { APIRequestContext, Page } from '@playwright/test';
import { config } from '../../config';
import {
  expect,
  test,
  type CreateUserPageOptions,
  type UserContextKit,
} from '../../fixtures/test-fixtures';
import { createDistributionRequestsPage } from '../../pages/services/supervision/distribution-requests-page';
import { createDistributionRequestsApprovalPage } from '../../pages/services/supervision/distribution-requests-approval-page';
import { createSkipRequisitionsPage } from '../../pages/skip/skip-requisitions-page';
import { type ResourcePlanningPage } from '../../pages/services/supervision/resource-planning-page';
import { SUPERVISION_POSITION_PK } from '../../test-data/api/user-api';
import { areVisitsApproved } from '../../test-data/api/project-api';
import { getWorkRequisitions } from '../../test-data/api/requisition-api';
import { type WorkData } from '../../types';
import { formatDmy, parseDmy, randomDate } from '../../utils/date';

const VISIT_COUNT = 2;

interface RequestData {
  start: string;
  stop: string;
  ticketDate: string;
}

const buildRequestData = (workStart: string, workStop: string): RequestData => {
  const start = parseDmy(workStart);
  const stop = parseDmy(workStop);
  const requestStart = randomDate(start, stop);
  return {
    start: formatDmy(requestStart),
    stop: formatDmy(randomDate(requestStart, stop)),
    ticketDate: formatDmy(requestStart),
  };
};

/** Проводит заявку по модалу «Управление заявками» до отправки на согласование. */
const submitRequest = async (page: Page, data: RequestData): Promise<void> => {
  const requests = createDistributionRequestsPage(page);

  await requests.createRequest();
  await requests.fillRequestCommon({
    start: data.start,
    stop: data.stop,
    living: 'Не требуется',
    taxi: 'Не требуется',
    money: '500',
    pass: 'Да',
  });
  await requests.clickNext();

  await requests.addTicketsToAllVisits(VISIT_COUNT);
  await requests.selectMassEditCity('Откуда:', 'Москва');
  await requests.selectMassEditCity('Куда:', 'Санкт-Петербург');
  await requests.fillMassEdit({
    date: data.ticketDate,
    transport: 'Авиа',
  });

  // Отправка заявки — это PATCH /api/project/opt2/<pk>/; без проверки ответа
  // клик по кнопке может тихо ничего не сделать.
  const submitted = page.waitForResponse(
    (response) =>
      response.url().includes('/api/project/opt2/') && response.request().method() === 'PATCH',
    { timeout: config.timeouts.long }
  );
  await requests.submitForApproval();

  const response = await submitted;
  expect(
    response.status(),
    `Заявка не отправлена: ${response.status()} ${await response.text()}`
  ).toBe(200);
};

type CreatePortalUser = (options?: CreateUserPageOptions) => Promise<UserContextKit>;

/**
 * Руководитель, который реально может подать заявку.
 * У группы head_of_service GET /api/project/opt2/ доступен, но отправка заявки
 * (PATCH) отдаёт 403, поэтому используется группа с правом подачи.
 *
 * Группа и должность назначаются одним запросом POST /api/auth/users/; без
 * должности с потоком `project_supervision` карточка работы недоступна.
 */
const createServiceHead = (createUserPage: CreatePortalUser): Promise<UserContextKit> =>
  createUserPage({
    groups: ['supervising_privileged_employee'],
    position: SUPERVISION_POSITION_PK,
  });

/** Готовит работу с визитами, чтобы заявку можно было подать. */
const prepareWorkWithVisits = async (
  resourcePlanningPage: ResourcePlanningPage,
  apiRequest: APIRequestContext,
  workPk: string
): Promise<void> => {
  await resourcePlanningPage.openWorkByPk(workPk);
  await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
  await resourcePlanningPage.saveVisitsPersisted(apiRequest, workPk, VISIT_COUNT);
};

/** Подаёт заявку от имени руководителя и ждёт её появления в API. */
const headSubmitsRequest = async (
  head: UserContextKit,
  apiRequest: APIRequestContext,
  work: WorkData,
  workPk: string
): Promise<void> => {
  const requests = createDistributionRequestsPage(head.page);
  await requests.open();
  await requests.findWork(work.name);
  await submitRequest(head.page, buildRequestData(work.startDate, work.stopDate));

  await expect
    .poll(async () => (await getWorkRequisitions(apiRequest, workPk)).length, {
      timeout: config.timeouts.long,
    })
    .toBeGreaterThan(0);
};

test.describe('Согласование заявки на командировку в супервайзинге', () => {
  test('Руководитель сервиса создаёт и отправляет заявку на командировку', async ({
    apiRequest,
    resourcePlanningPage,
    createdWork,
    createUserPage,
  }) => {
    const { work, workPk } = createdWork;
    const head = await createServiceHead(createUserPage);

    await test.step('Добавить визиты на странице распределения', async () => {
      await prepareWorkWithVisits(resourcePlanningPage, apiRequest, workPk);
    });

    await test.step('Выбрать работу на странице «Создание заявки на командировку»', async () => {
      const requests = createDistributionRequestsPage(head.page);
      await requests.open();
      await requests.findWork(work.name);
      await expect(head.page).toHaveURL(new RegExp(`/distribution-requests/create/${workPk}`));
    });

    await test.step('Заполнить заявку и отправить на согласование', async () => {
      await headSubmitsRequest(head, apiRequest, work, workPk);
    });

    await test.step('Проверить, что визиты перешли в статус «На согласовании»', async () => {
      await expect
        .poll(() => areVisitsApproved(apiRequest, workPk), { timeout: config.timeouts.long })
        .toBe(true);
    });

    await test.step('Проверить, что заявка создана и ждёт согласования', async () => {
      const [requisition] = await getWorkRequisitions(apiRequest, workPk);
      expect(requisition?.status).toBe('На согласование');
    });
  });

  test('Сотрудник СКИП находит поданную заявку в списке на обработку', async ({
    apiRequest,
    resourcePlanningPage,
    createdWork,
    createUserPage,
  }) => {
    const { project, work, workPk } = createdWork;
    const head = await createServiceHead(createUserPage);

    await test.step('Добавить визиты на странице распределения', async () => {
      await prepareWorkWithVisits(resourcePlanningPage, apiRequest, workPk);
    });

    await test.step('Отправить заявку на согласование от имени руководителя', async () => {
      await headSubmitsRequest(head, apiRequest, work, workPk);
    });

    const skipUser = await createUserPage({ groups: ['skip_employee'] });
    const skipPage = createSkipRequisitionsPage(skipUser.page);

    await test.step('Открыть «Работа с заявками (СКИП)» под пользователем группы skip_employee', async () => {
      await skipPage.open();
    });

    await test.step('Найти работу в списке заявок на обработку', async () => {
      await skipPage.findWork(project.code);
      await expect(skipPage.locators.workButton(work.name)).toBeVisible();
      expect(await skipPage.getWorkRow(work.name)).toContain(work.name);
    });
  });

  test('Сотрудник СКИП обрабатывает заявку в карточке /SKIP/requisitions', async ({
    apiRequest,
    resourcePlanningPage,
    createdWork,
    createUserPage,
  }) => {
    const { work, workPk } = createdWork;
    const head = await createServiceHead(createUserPage);

    await test.step('Добавить визиты на странице распределения', async () => {
      await prepareWorkWithVisits(resourcePlanningPage, apiRequest, workPk);
    });

    await test.step('Отправить заявку на согласование от имени руководителя', async () => {
      await headSubmitsRequest(head, apiRequest, work, workPk);
    });

    const skipUser = await createUserPage({ groups: ['skip_employee'] });
    const skipPage = createSkipRequisitionsPage(skipUser.page);

    await test.step('Открыть «Работа с заявками (СКИП)» под пользователем группы skip_employee', async () => {
      await skipPage.open();
    });

    await test.step('Открыть работу в карточке обработки заявки', async () => {
      await skipPage.openWork(work.name);
      await expect(skipPage.locators.requestsTable).toBeVisible();
    });
  });

  test('Директор сервиса открывает поданную заявку на согласование', async ({
    apiRequest,
    resourcePlanningPage,
    createdWork,
    createUserPage,
  }) => {
    const { work, workPk } = createdWork;
    const head = await createServiceHead(createUserPage);

    await test.step('Добавить визиты на странице распределения', async () => {
      await prepareWorkWithVisits(resourcePlanningPage, apiRequest, workPk);
    });

    await test.step('Отправить заявку на согласование от имени руководителя', async () => {
      await headSubmitsRequest(head, apiRequest, work, workPk);
    });

    const director = await createUserPage({ groups: ['origin_service_director'] });
    const approval = createDistributionRequestsApprovalPage(director.page);

    await test.step('Открыть карточку согласования заявки директором', async () => {
      await approval.openWork(workPk);
      const summary = await approval.getSummary();
      expect(summary).toContain(`Сотрудников: ${VISIT_COUNT}`);
      expect(summary).toContain(`Визитов: ${VISIT_COUNT}`);
      expect(summary).toContain(`Билетов: ${VISIT_COUNT}`);
    });

    await test.step('Проверить, что заявка в статусе «На согласование»', async () => {
      expect(await approval.requestRowStatus()).toBe('На согласование');
    });

    await test.step('Раскрыть состав заявки и выбрать всех сотрудников', async () => {
      await approval.openRequisitionCard();
      await approval.selectAllEmployees();
      await expect(approval.locators.selectedEmployeesCount).toHaveText(`Выбрано: ${VISIT_COUNT}`);
    });

    await test.step('Проверить, что согласующий видит кнопки решения', async () => {
      await expect(approval.locators.approveButton).toHaveCount(1);
      await expect(approval.locators.rejectButton).toHaveCount(1);
    });
  });

  test('Технический директор согласовывает заявку', async ({
    apiRequest,
    resourcePlanningPage,
    createdWork,
    createUserPage,
  }) => {
    const { work, workPk } = createdWork;
    const head = await createServiceHead(createUserPage);

    await test.step('Добавить визиты на странице распределения', async () => {
      await prepareWorkWithVisits(resourcePlanningPage, apiRequest, workPk);
    });

    await test.step('Отправить заявку на согласование от имени руководителя', async () => {
      await headSubmitsRequest(head, apiRequest, work, workPk);
    });

    const director = await createUserPage({
      groups: ['origin_service_director'],
      position: SUPERVISION_POSITION_PK,
    });
    const approval = createDistributionRequestsApprovalPage(director.page);

    await test.step('Открыть карточку согласования заявки директором', async () => {
      await approval.openWork(workPk);
    });

    await test.step('Раскрыть состав заявки и выбрать всех сотрудников', async () => {
      await approval.openRequisitionCard();
      await approval.selectAllEmployees();
    });

    await test.step('Согласовать заявку', async () => {
      expect(await approval.approve()).toBe(200);
    });

    await test.step('Проверить, что заявка вышла из статуса «На согласование»', async () => {
      await expect
        .poll(async () => (await getWorkRequisitions(apiRequest, workPk))[0]?.status, {
          timeout: config.timeouts.long,
        })
        .not.toBe('На согласование');
    });
  });
});
