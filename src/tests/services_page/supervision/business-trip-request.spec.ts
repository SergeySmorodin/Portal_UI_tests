import { config } from '../../../config';
import { formatDmy, parseDmy, randomDate } from '../../../utils/date';
import { areVisitsApproved } from '../../../test-data/api/project-api';
import { expect, test } from '../../../fixtures/test-fixtures';

test.describe('Создание заявки на командировку', () => {
  test(
    'Создание заявки на командировку после добавления визитов',
    { tag: '@smoke' },
    async ({ page, apiRequest, resourcePlanningPage, distributionRequestsPage, createdWork }) => {
      const { work, workPk } = createdWork;
      const VISIT_COUNT = 2;

      const visitStart = parseDmy(work.startDate);
      const visitStop = parseDmy(work.stopDate);
      const requestStart = randomDate(visitStart, visitStop);
      const requestStop = randomDate(requestStart, visitStop);
      const ticketDate = randomDate(requestStart, requestStop);

      await test.step('Добавить визиты на странице распределения', async () => {
        await resourcePlanningPage.openWorkByPk(workPk);

        const addedWorkers = await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
        expect(addedWorkers).toHaveLength(VISIT_COUNT);

        await resourcePlanningPage.saveVisitsPersisted(apiRequest, workPk, VISIT_COUNT);
      });

      await test.step('Найти работу на странице «Создание заявки на командировку» и выбрать проект', async () => {
        await distributionRequestsPage.open();
        await distributionRequestsPage.findWork(work.name);
        await page.waitForURL((url) => url.pathname.includes(`create/${workPk}`));
      });

      await test.step('Проверить наличие визитов', async () => {
        await expect
          .poll(() => distributionRequestsPage.getVisitsCount(), {
            timeout: config.timeouts.normal,
          })
          .toBeGreaterThan(0);
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

        await test.step('Проверить, что визиты перешли в статус «На согласовании»', async () => {
          await expect
            .poll(() => areVisitsApproved(apiRequest, workPk), {
              timeout: config.timeouts.long,
            })
            .toBe(true);
        });
      });
    }
  );
});
