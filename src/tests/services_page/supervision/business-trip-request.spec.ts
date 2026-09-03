import { config } from '../../../config/config';
import { api } from '../../../data/api/api';
import { createProjectViaApi, createWorkViaApi } from '../../../data/api/project-api';
import { projectFactory } from '../../../data/project-factory';
import { workFactory } from '../../../data/work-factory';
import { formatDmy, randomDate } from '../../../utils/date';
import { expect, test } from '../../../fixtures/test-fixtures';

const parseDmy = (value: string): Date => {
  const [day, month, year] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

test.describe('Создание заявки на командировку', () => {
  test(
    'Создание заявки на командировку после добавления визитов',
    { tag: '@smoke' },
    async ({ page, apiRequest, resourcePlanningPage, distributionRequestsPage }) => {
      const project = projectFactory.active();
      const work = workFactory.standard({
        startDate: project.startDate,
        stopDate: project.stopDate,
      });
      const VISIT_COUNT = 2;

      const visitStart = parseDmy(project.startDate);
      const visitStop = parseDmy(project.stopDate);
      const requestStart = randomDate(visitStart, visitStop);
      const requestStop = randomDate(requestStart, visitStop);
      const ticketDate = randomDate(requestStart, requestStop);

      let workPk: string;

      await test.step('Создать мегапроект и работу через API', async () => {
        const createdProject = await createProjectViaApi(apiRequest, project);

        const contractsResponse = await apiRequest.get(api.contract);
        const contractsBody = await contractsResponse.json();
        const contracts = (
          Array.isArray(contractsBody) ? contractsBody : contractsBody.results
        ) as Array<{ pk: string }>;
        if (!contracts || contracts.length === 0) {
          throw new Error('Нет доступных договоров для создания работы');
        }

        workPk = await createWorkViaApi(apiRequest, work, {
          megaProjectPk: createdProject.pk,
          contractPk: contracts[0].pk,
        });
        expect(workPk).toBeTruthy();
      });

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
