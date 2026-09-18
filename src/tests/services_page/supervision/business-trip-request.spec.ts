import { config } from '../../../config';
import { formatDmy, parseDmy, randomDate } from '../../../utils/date';
import { expect, test } from '../../../fixtures/test-fixtures';

test.describe('Создание заявки на командировку', () => {
  test(
    'Создание заявки на командировку после добавления визитов',
    { tag: '@smoke' },
    async ({ page, resourcePlanningPage, distributionRequestsPage, createdWork }) => {
      const { work, workPk } = createdWork;
      const VISIT_COUNT = 2;

      const visitStart = parseDmy(work.startDate);
      const visitStop = parseDmy(work.stopDate);
      const requestStart = randomDate(visitStart, visitStop);
      const requestStop = randomDate(requestStart, visitStop);
      const ticketDate = randomDate(requestStart, requestStop);

      await test.step('Добавить визиты на странице распределения', async () => {
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
        await distributionRequestsPage.findWork(work.name);
        await page.waitForURL((url) => url.pathname.includes(`create/${workPk}`));
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
          living: 'Квартира',
          taxi: 'Обычный',
          money: '1000',
          pass: 'Да',
        });
      });

      await test.step('Нажать «Далее»', async () => {
        await distributionRequestsPage.clickNext();
      });

      await test.step('Добавить билеты и указать их в «Массовом редактировании билетов»', async () => {
        await distributionRequestsPage.addTicketsToAllVisits(VISIT_COUNT);

        await distributionRequestsPage.selectMassEditCity('Откуда:', 'Москва');
        await distributionRequestsPage.selectMassEditCity('Куда:', 'Санкт-Петербург');
        await distributionRequestsPage.fillMassEdit({
          date: formatDmy(ticketDate),
          transport: 'Авиа',
        });
      });

      await test.step('Отправить на согласование', async () => {
        await distributionRequestsPage.submitForApproval();

        await expect
          .poll(() => distributionRequestsPage.getRequestsCount(), {
            timeout: config.timeouts.long,
          })
          .toBeGreaterThan(0);
      });
    }
  );
});
