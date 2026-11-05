import { type APIRequestContext } from '@playwright/test';
import { config } from '../../../config';
import { expect, test } from '../../../fixtures/test-fixtures';
import { resolvePage, type PageSource } from '../../../pages/page-source';
import { createDistributionRequestsPage } from '../../../pages/services/supervision/distribution-requests-page';
import { createDistributionRequestsApprovalPage } from '../../../pages/services/supervision/distribution-requests-approval-page';
import { createSkipRequisitionsPage } from '../../../pages/skip/skip-requisitions-page';
import { type ResourcePlanningPage } from '../../../pages/services/supervision/resource-planning-page';
import { areVisitsApproved, getVisitsActuals } from '../../../test-data/api/project-api';
import { getWorkRequisitions } from '../../../test-data/api/requisition-api';
import { formatDmy, parseDmy, randomDate } from '../../../utils/date';

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
const submitRequest = async (source: PageSource, data: RequestData): Promise<void> => {
  const page = resolvePage(source);
  const requests = createDistributionRequestsPage(source);

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

test.describe('Согласование заявки на командировку в супервайзинге', () => {
  // Сценарии выполняются последовательно в одном тесте: работа, проект и учётные
  // записи создаются один раз, а состояния заявки переходят друг в друга
  // (подача → отклонение → повторная подача → согласование → СКИП → демобилизация).
  test.describe.configure({ timeout: 900_000 });

  test('Полный цикл согласования заявки на командировку в супервайзинге', async ({
    apiRequest,
    resourcePlanningPage,
    createdWork,
    createApprovers,
  }) => {
    const { work, workPk } = createdWork;
    const { privileged, leader, skip } = await createApprovers();
    const requests = createDistributionRequestsPage(privileged);
    const approval = createDistributionRequestsApprovalPage(leader);
    const skipPage = createSkipRequisitionsPage(skip);
    const rejectionReason = 'Некорректная дата вылета, требуется корректировка';
    let requisitionPksBeforeDemobilization: string[] = [];

    await test.step('Сценарий 1. Добавить визиты на странице распределения', async () => {
      await prepareWorkWithVisits(resourcePlanningPage, apiRequest, workPk);
    });

    await test.step('Сценарий 1. Найти работу, заполнить заявку и отправить на согласование', async () => {
      await requests.open();
      await requests.findWork(work.name);
      await expect(privileged.page).toHaveURL(
        new RegExp(`/distribution-requests/create/${workPk}`)
      );
      await expect(requests.locators.visitsTab).toBeVisible();

      await submitRequest(privileged.page, buildRequestData(work.startDate, work.stopDate));

      await expect
        .poll(async () => (await getWorkRequisitions(apiRequest, workPk)).length, {
          timeout: config.timeouts.long,
        })
        .toBeGreaterThan(0);
    });

    await test.step('Сценарий 1. Проверить визиты «На согласовании» и заявку на вкладке «Заявки»', async () => {
      await expect
        .poll(() => areVisitsApproved(apiRequest, workPk), { timeout: config.timeouts.long })
        .toBe(true);

      await expect
        .poll(async () => (await getWorkRequisitions(apiRequest, workPk))[0]?.status, {
          timeout: config.timeouts.long,
        })
        .toBe('На согласование');

      await requests.openRequestsTab();
      await expect(requests.locators.requestsTable).toBeVisible();
      expect(await requests.getRequestsRowsCount()).toBeGreaterThan(0);
    });

    await test.step('Сценарий 1. Открыть заявку кнопкой fa-eye и закрыть модальное окно', async () => {
      const view = await requests.openRequestView();
      expect(view).toContain('На согласование');
      expect(view).toContain(`Состав заявки (${VISIT_COUNT})`);
      await requests.closeRequestView();
    });

    await test.step('Сценарий 2. Открыть карточку в «Согласовании заявок», проверить состав и маршруты', async () => {
      await approval.findAndOpenWork(work.name);
      await expect(approval.locators.requestsHeading).toBeVisible();
      await approval.openRequisitionCard();
      await expect(approval.locators.compositionHeading).toHaveText(
        `Состав заявки (${VISIT_COUNT})`
      );
      await expect(approval.locators.movementHeading).toBeVisible();
      const card = await approval.getCompositionAndMovement();
      expect(card.length).toBeGreaterThan(0);
    });

    await test.step('Сценарий 4. Руководитель отклоняет заявку с указанием причины', async () => {
      await approval.selectAllEmployees();
      await expect(approval.locators.selectedEmployeesCount).toHaveText(`Выбрано: ${VISIT_COUNT}`);
      expect(await approval.reject(rejectionReason)).toBe(200);
    });

    await test.step('Сценарий 4. Проверить статус «Не согласован» и отказ в корректировке кнопками сверху', async () => {
      await expect
        .poll(async () => (await getWorkRequisitions(apiRequest, workPk))[0]?.status, {
          timeout: config.timeouts.long,
        })
        .toBe('Не согласован');

      await requests.open();
      await requests.findWork(work.name);
      await expect(requests.locators.createRequestButton).toBeDisabled();
      await expect(requests.locators.correctionRequestButton).toBeDisabled();
      await expect(requests.locators.correctionRequestButton).toHaveAttribute(
        'title',
        'Нет фактических визитов, доступных для корректировки'
      );
    });

    await test.step('Сценарий 4. Скорректировать отклонённую заявку и отправить повторно', async () => {
      expect(await requests.editAndResubmitRequest()).toBe(200);

      await expect
        .poll(async () => (await getWorkRequisitions(apiRequest, workPk))[0]?.status, {
          timeout: config.timeouts.long,
        })
        .toBe('На согласование');
    });

    await test.step('Сценарий 2. Согласовать заявку руководителем службы', async () => {
      await approval.findAndOpenWork(work.name);
      await approval.openRequisitionCard();
      await approval.selectAllEmployees();
      await expect(approval.locators.selectedEmployeesCount).toHaveText(`Выбрано: ${VISIT_COUNT}`);
      await expect(approval.locators.approveButton).toHaveCount(1);
      expect(await approval.approve()).toBe(200);

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

    await test.step('Сценарий 3. Найти работу в «Работа с заявками (СКИП)» по общему поиску', async () => {
      await skipPage.open();
      await skipPage.findWork(work.name);
      await expect(skipPage.locators.workButton(work.name)).toBeVisible();
    });

    await test.step('Сценарий 3. Открыть карточку работы и убедиться, что заявка во вкладке «Новые»', async () => {
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
    // Дата возврата для демобилизации — конец визита после корректировки в СКИП.
    const demobilizationDate = formatDmy(correctedStop);

    await test.step('Сценарий 3. Взять заявку в работу и скорректировать даты визитов на шаге «Визиты»', async () => {
      await skipPage.takeRequestIntoWork();
      await expect(skipPage.locators.processingModal).toBeVisible();
      await expect(skipPage.locators.processingStepHeading).toContainText('Шаг 1 из 3');

      for (let i = 0; i < VISIT_COUNT; i++) {
        await skipPage.correctVisitDates(i, formatDmy(correctedStart), formatDmy(correctedStop));
      }
    });

    await test.step('Сценарий 3. Пройти шаги «Суточные» и «Билеты», указать дату вылета', async () => {
      await skipPage.processingNext();
      await expect(skipPage.locators.processingStepHeading).toContainText('Шаг 2 из 3');

      await skipPage.alignPerDiemStart(formatDmy(correctedStart));

      await skipPage.processingNext();
      await expect(skipPage.locators.processingStepHeading).toContainText('Шаг 3 из 3');
    });

    await test.step('Сценарий 3. Завершить обработку и проверить вкладку «Обработанные»', async () => {
      await skipPage.finishProcessing();

      await skipPage.openProcessedTab();
      await expect(skipPage.locators.processedRequestsTab).toBeVisible();
      await expect
        .poll(async () => skipPage.processedRequestsCount(), { timeout: config.timeouts.long })
        .toBeGreaterThan(0);

      await expect
        .poll(async () => (await getWorkRequisitions(apiRequest, workPk))[0]?.status, {
          timeout: config.timeouts.long,
        })
        .not.toBe('На согласование');
    });

    await test.step('Сценарий 5. Проверить, что визиты перешли в статус «Фактическое»', async () => {
      await expect
        .poll(async () => (await getVisitsActuals(apiRequest, workPk)).join(', '), {
          timeout: config.timeouts.long,
        })
        .toBe('Фактическое');
    });

    await test.step('Сценарий 5. Открыть демобилизацию и выбрать всех сотрудников', async () => {
      await requests.open();
      await requests.findWork(work.name);
      await requests.openDemobilization();
      await requests.selectAllModalVisits(VISIT_COUNT);
      await requests.clickNext();
    });

    await test.step('Сценарий 5. Добавить билеты и указать дату возврата не позднее окончания командировки', async () => {
      await requests.addRoutesToAll(VISIT_COUNT);
      await requests.selectMassEditCity('Откуда:', 'Санкт-Петербург');
      await requests.selectMassEditCity('Куда:', 'Москва');
      await requests.fillMassEdit({ date: demobilizationDate, transport: 'Авиа' });
    });

    await test.step('Сценарий 5. Отправить заявку на демобилизацию на согласование', async () => {
      requisitionPksBeforeDemobilization = (await getWorkRequisitions(apiRequest, workPk)).map(
        (r) => r.pk
      );

      const submitted = privileged.page.waitForResponse(
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
    });

    await test.step('Сценарий 5. Проверить статус «На согласование» на вкладке «Заявки»', async () => {
      await expect
        .poll(
          async () => {
            const requisitions = await getWorkRequisitions(apiRequest, workPk);
            return requisitions.some(
              (r) =>
                r.status === 'На согласование' && !requisitionPksBeforeDemobilization.includes(r.pk)
            );
          },
          { timeout: config.timeouts.long }
        )
        .toBe(true);

      await requests.openRequestsTab();
      await expect(requests.locators.requestsTable).toContainText('На согласование', {
        timeout: config.timeouts.long,
      });
    });

    await test.step('Сценарий 5. Руководитель согласует заявку на демобилизацию', async () => {
      await approval.findAndOpenWork(work.name);
      await approval.openRequisitionCard();
      await approval.selectAllEmployees();
      await expect(approval.locators.selectedEmployeesCount).toHaveText(`Выбрано: ${VISIT_COUNT}`);
      expect(await approval.approve()).toBe(200);

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
});
