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

  // Шаг «Перемещение»: маршрут всем и дополнительный билет первому сотруднику.
  await requests.addRoutesToAll(VISIT_COUNT);
  await requests.addExtraTicketToFirst();
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
 * Привилегированный сотрудник сервиса супервайзинг, который может подать заявку.
 * Группа и должность назначаются одним запросом POST /api/auth/users/; без
 * должности с потоком `project_supervision` карточка работы недоступна.
 */
const createServiceHead = (createUserPage: CreatePortalUser): Promise<UserContextKit> =>
  createUserPage({
    groups: ['supervising_privileged_employee'],
    position: SUPERVISION_POSITION_PK,
  });

/** Руководитель сервиса (группа supervising_leader) — согласует заявку. */
const createServiceLeader = (createUserPage: CreatePortalUser): Promise<UserContextKit> =>
  createUserPage({
    groups: ['supervising_leader'],
    position: SUPERVISION_POSITION_PK,
  });

/** Сотрудник планирования (группа skip_employee) — обрабатывает заявку в СКИП. */
const createSkipEmployee = (createUserPage: CreatePortalUser): Promise<UserContextKit> =>
  createUserPage({ groups: ['skip_employee'] });

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

/** Подаёт заявку от имени руководителя и дожидается статуса «На согласование». */
const submitRequestAwaitingApproval = async (
  apiRequest: APIRequestContext,
  resourcePlanningPage: ResourcePlanningPage,
  work: WorkData,
  workPk: string,
  head: UserContextKit
): Promise<void> => {
  await prepareWorkWithVisits(resourcePlanningPage, apiRequest, workPk);
  await headSubmitsRequest(head, apiRequest, work, workPk);
  await expect
    .poll(async () => (await getWorkRequisitions(apiRequest, workPk))[0]?.status, {
      timeout: config.timeouts.long,
    })
    .toBe('На согласование');
};

test.describe('Согласование заявки на командировку в супервайзинге', () => {
  test.describe.configure({ timeout: 120_000 });

  test('СЦЕНАРИЙ 1. Привилегированный сотрудник создаёт заявку и отправляет на согласование', async ({
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

    await test.step('На странице выбора проекта найти работу по параметрам поиска и открыть заявку', async () => {
      const requests = createDistributionRequestsPage(head.page);
      await requests.open();
      await requests.findWork(work.name);
      await expect(head.page).toHaveURL(new RegExp(`/distribution-requests/create/${workPk}`));
      await expect(requests.locators.visitsTab).toBeVisible();
    });

    await test.step('Заполнить заявку, добавить маршруты всем и отправить на согласование', async () => {
      await headSubmitsRequest(head, apiRequest, work, workPk);
    });

    await test.step('Проверить, что визиты перешли в статус «На согласовании»', async () => {
      await expect
        .poll(() => areVisitsApproved(apiRequest, workPk), { timeout: config.timeouts.long })
        .toBe(true);
    });

    await test.step('Проверить создание заявки и статус «На согласование» на вкладке «Заявки»', async () => {
      const [requisition] = await getWorkRequisitions(apiRequest, workPk);
      expect(requisition?.status).toBe('На согласование');

      const requests = createDistributionRequestsPage(head.page);
      await requests.openRequestsTab();
      await expect(requests.locators.requestsTable).toBeVisible();
      expect(await requests.getRequestsRowsCount()).toBeGreaterThan(0);
    });

    await test.step('Открыть заявку кнопкой fa-eye и закрыть модальное окно', async () => {
      const requests = createDistributionRequestsPage(head.page);
      const view = await requests.openRequestView();
      expect(view).toContain('На согласование');
      expect(view).toContain(`Состав заявки (${VISIT_COUNT})`);
      await requests.closeRequestView();
    });
  });

  test('СЦЕНАРИЙ 2. Руководитель сервиса находит заявку и согласовывает её', async ({
    apiRequest,
    resourcePlanningPage,
    createdWork,
    createUserPage,
  }) => {
    const { work, workPk } = createdWork;
    const head = await createServiceHead(createUserPage);

    await test.step('Подготовить визиты и подать заявку на согласование', async () => {
      await submitRequestAwaitingApproval(apiRequest, resourcePlanningPage, work, workPk, head);
    });

    const leader = await createServiceLeader(createUserPage);
    const approval = createDistributionRequestsApprovalPage(leader.page);

    await test.step('В разделе «Согласование заявок» найти работу и открыть карточку', async () => {
      await approval.findAndOpenWork(work.name);
      await expect(approval.locators.requestsHeading).toBeVisible();
      expect((await getWorkRequisitions(apiRequest, workPk))[0]?.status).toBe('На согласование');
    });

    await test.step('Раскрыть заявку, проверить состав и маршруты', async () => {
      await approval.openRequisitionCard();
      await expect(approval.locators.compositionHeading).toHaveText(
        `Состав заявки (${VISIT_COUNT})`
      );
      await expect(approval.locators.movementHeading).toBeVisible();
      const card = await approval.getCompositionAndMovement();
      expect(card.length).toBeGreaterThan(0);
    });

    await test.step('Выбрать всех сотрудников и согласовать заявку', async () => {
      await approval.selectAllEmployees();
      await expect(approval.locators.selectedEmployeesCount).toHaveText(`Выбрано: ${VISIT_COUNT}`);
      await expect(approval.locators.approveButton).toHaveCount(1);
      expect(await approval.approve()).toBe(200);
    });

    await test.step('Проверить, что этап «Рук. службы» перешёл в статус «Согласовано»', async () => {
      await expect
        .poll(
          async () => {
            try {
              return await approval.getApprovalHistory();
            } catch {
              return '';
            }
          },
          { timeout: 30000 }
        )
        .toContain('Согласовано');

      const history = await approval.getApprovalHistory();
      expect(history).toContain('Рук. службы');
      expect(history).toContain('Согласовано');
    });
  });

  test('СЦЕНАРИЙ 3. Сотрудник СКИП обрабатывает заявку и завершает её', async ({
    apiRequest,
    resourcePlanningPage,
    createdWork,
    createUserPage,
  }) => {
    const { work, workPk } = createdWork;
    const head = await createServiceHead(createUserPage);

    await test.step('Подготовить визиты, подать и согласовать заявку', async () => {
      await submitRequestAwaitingApproval(apiRequest, resourcePlanningPage, work, workPk, head);

      const leader = await createServiceLeader(createUserPage);
      const approval = createDistributionRequestsApprovalPage(leader.page);
      await approval.findAndOpenWork(work.name);
      await approval.openRequisitionCard();
      await approval.selectAllEmployees();
      expect(await approval.approve()).toBe(200);
    });

    const skipUser = await createSkipEmployee(createUserPage);
    const skipPage = createSkipRequisitionsPage(skipUser.page);

    await test.step('Найти работу в «Работа с заявками (СКИП)» по общему поиску', async () => {
      await skipPage.open();
      await skipPage.findWork(work.name);
      await expect(skipPage.locators.workButton(work.name)).toBeVisible();
    });

    await test.step('Открыть карточку работы и убедиться, что заявка во вкладке «Новые»', async () => {
      await skipPage.openWork(work.name);
      await expect(skipPage.locators.requestsTable).toBeVisible();
      await expect
        .poll(async () => skipPage.newRequestsCount(), { timeout: 30000 })
        .toBeGreaterThan(0);
      expect(await skipPage.requestRowStatus()).toContain('На согласование');
    });

    const visitStart = parseDmy(work.startDate);
    const visitStop = parseDmy(work.stopDate);
    const correctedStart = randomDate(visitStart, visitStop);
    const correctedStop = randomDate(correctedStart, visitStop);

    await test.step('Взять заявку в работу и скорректировать даты визитов на шаге «Визиты»', async () => {
      await skipPage.takeRequestIntoWork();
      await expect(skipPage.locators.processingModal).toBeVisible();
      await expect(skipPage.locators.processingStepHeading).toContainText('Шаг 1 из 3');

      for (let i = 0; i < VISIT_COUNT; i++) {
        await skipPage.correctVisitDates(
          i,
          formatDmy(correctedStart),
          formatDmy(correctedStop)
        );
      }
    });

    await test.step('Пройти шаги «Суточные» и «Билеты», указать дату вылета', async () => {
      await skipPage.processingNext();
      await expect(skipPage.locators.processingStepHeading).toContainText('Шаг 2 из 3');

      await skipPage.alignPerDiemStart(formatDmy(correctedStart));

      await skipPage.processingNext();
      await expect(skipPage.locators.processingStepHeading).toContainText('Шаг 3 из 3');
    });

    await test.step('Завершить обработку и подтвердить, что заявка доступна только для просмотра', async () => {
      await skipPage.finishProcessing();
    });

    await test.step('Проверить, что заявка отображается во вкладке «Обработанные»', async () => {
      await skipPage.openProcessedTab();
      await expect(skipPage.locators.processedRequestsTab).toBeVisible();
      expect(await skipPage.processedRequestsCount()).toBeGreaterThan(0);
    });

    await test.step('Проверить, что заявка работы ушла из статуса «На согласование»', async () => {
      await expect
        .poll(async () => (await getWorkRequisitions(apiRequest, workPk))[0]?.status, {
          timeout: config.timeouts.long,
        })
        .not.toBe('На согласование');
    });
  });
});
