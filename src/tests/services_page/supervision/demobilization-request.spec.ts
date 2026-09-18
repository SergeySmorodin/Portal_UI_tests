import { config } from '../../../config';
import { formatDmy, parseDmy, pickOrderedRange, randomDate } from '../../../utils/date';
import { expect, test } from '../../../fixtures/test-fixtures';
import type { CommonFields } from '../../../pages/services/supervision/distribution-requests-page';

const VISIT_COUNT = 2;

const REQUEST_COMMON = {
  living: 'Квартира',
  taxi: 'Обычный',
  money: '1000',
  pass: 'Да',
} as const;

const DEMOBILIZATION_COMMON: CommonFields = {
  living: 'Квартира',
  taxi: 'Обычный',
  money: '1500',
  pass: 'Да',
};

const TICKET = {
  from: 'Москва',
  to: 'Санкт-Петербург',
  transport: 'Авиа',
} as const;

test.describe('Демобилизация после командировки', () => {
  test(
    'Подать заявку на демобилизацию после командировки',
    { tag: '@smoke' },
    async ({ page, resourcePlanningPage, distributionRequestsPage, createdWork }) => {
      const { work, workPk } = createdWork;

      const visitStart = parseDmy(work.startDate);
      const visitStop = parseDmy(work.stopDate);

      // Гарантируем, что start < stop, чтобы не получить одинаковые даты
      const { start: requestStart, stop: requestStop } = pickOrderedRange(visitStart, visitStop);
      const ticketDate = randomDate(requestStart, requestStop);

      await test.step('Добавить визиты на странице планирования ресурсов', async () => {
        await resourcePlanningPage.open();
        await resourcePlanningPage.searchWork(work.name);
        await resourcePlanningPage.openWork(work.name);

        const addedWorkers = await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
        expect(addedWorkers).toHaveLength(VISIT_COUNT);

        await resourcePlanningPage.openVisitsManagement();
        await resourcePlanningPage.saveVisits();
      });

      await test.step('Найти работу на странице «Создание заявки на командировку» и выбрать проект', async () => {
        await distributionRequestsPage.open();

        await Promise.all([
          page.waitForURL((url) => url.pathname.includes(`create/${workPk}`)),
          distributionRequestsPage.findWork(work.name),
        ]);
      });

      await test.step('Проверить наличие визитов', async () => {
        const visitsCount = await distributionRequestsPage.getVisitsCount();
        expect(visitsCount).toBeGreaterThan(0);
      });

      await test.step('Нажать «Создать заявку»', async () => {
        await distributionRequestsPage.createRequest();
      });

      await test.step('Заполнить поля заявки в форме «Управление заявками»', async () => {
        await distributionRequestsPage.fillRequestCommon({
          start: formatDmy(requestStart),
          stop: formatDmy(requestStop),
          ...REQUEST_COMMON,
        });
      });

      await test.step('Нажать «Далее»', async () => {
        await distributionRequestsPage.clickNext();
      });

      await test.step('Добавить билеты и указать их в «Массовом редактировании билетов»', async () => {
        await distributionRequestsPage.addTicketsToAllVisits(VISIT_COUNT);

        await distributionRequestsPage.selectMassEditCity('Откуда:', TICKET.from);
        await distributionRequestsPage.selectMassEditCity('Куда:', TICKET.to);
        await distributionRequestsPage.fillMassEdit({
          date: formatDmy(ticketDate),
          transport: TICKET.transport,
        });
      });

      await test.step('Отправить на согласование', async () => {
        // fixme падает на этом шаге
        await distributionRequestsPage.submitForApproval();

        await expect
          .poll(() => distributionRequestsPage.getRequestsCount(), {
            timeout: config.timeouts.long,
          })
          .toBeGreaterThan(0);
      });

      await test.step('Открыть демобилизацию и заполнить состав', async () => {
        await distributionRequestsPage.openDemobilization();

        // Особенность UI: возвращаемся к шагу состава, чтобы заполнить общие поля демобилизации
        await distributionRequestsPage.backToCompositionStep();
        await distributionRequestsPage.fillDemobilizationCommon({
          start: formatDmy(requestStart),
          stop: formatDmy(requestStop),
          ...DEMOBILIZATION_COMMON,
        });

        await distributionRequestsPage.fillVisitMoney(DEMOBILIZATION_COMMON.money);
      });

      await test.step('Перейти к следующему шагу и отправить на согласование', async () => {
        await distributionRequestsPage.clickNext();

        const beforeSubmit = await distributionRequestsPage.getRequestsCount();

        await distributionRequestsPage.submitForApproval();

        await expect
          .poll(() => distributionRequestsPage.getRequestsCount(), {
            timeout: config.timeouts.long,
          })
          .toBeGreaterThan(beforeSubmit);
      });
    }
  );
});
