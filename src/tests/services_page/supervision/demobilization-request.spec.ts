import { config } from '../../../config';
import { api } from '../../../test-data/api/api';
import { createProjectViaApi, createWorkViaApi } from '../../../test-data/api/project-api';
import { projectFactory } from '../../../test-data/factory/project-factory';
import { workFactory } from '../../../test-data/factory/work-factory';
import { formatDmy, randomDate } from '../../../utils/date';
import { expect, test } from '../../../fixtures/test-fixtures';
import type { CommonFields } from '../../../pages/services/supervision/distribution-requests-page';

const parseDmy = (value: string): Date => {
  const [day, month, year] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

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
    async ({ page, apiRequest, resourcePlanningPage, distributionRequestsPage }) => {
      const project = projectFactory.active();
      const work = workFactory.standard({
        startDate: project.startDate,
        stopDate: project.stopDate,
      });

      const visitStart = parseDmy(project.startDate);
      const visitStop = parseDmy(project.stopDate);

      // Гарантируем, что start < stop, чтобы не получить одинаковые даты
      const { start: requestStart, stop: requestStop } = pickOrderedRange(visitStart, visitStop);
      const ticketDate = randomDate(requestStart, requestStop);

      const workPk = await test.step('Создать мегапроект и работу через API', async () => {
        const createdProject = await createProjectViaApi(apiRequest, project);

        const contractsResponse = await apiRequest.get(api.contract);
        const contractsBody = await contractsResponse.json();
        const contracts = (
          Array.isArray(contractsBody) ? contractsBody : contractsBody.results
        ) as Array<{ pk: string }>;

        const contract = contracts?.find((c) => Boolean(c?.pk));
        if (!contract) {
          throw new Error('Нет доступных договоров для создания работы');
        }

        const createdWorkPk = await createWorkViaApi(apiRequest, work, {
          megaProjectPk: createdProject.pk,
          contractPk: contract.pk,
        });
        expect(createdWorkPk).toBeTruthy();

        return createdWorkPk;
      });

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

/**
 * Возвращает две разные даты в диапазоне [from, to], где start < stop.
 * Если диапазон слишком узкий (одна дата) — сдвигает stop на следующий день.
 */
function pickOrderedRange(from: Date, to: Date): { start: Date; stop: Date } {
  const start = randomDate(from, to);
  let stop = randomDate(start, to);

  if (stop.getTime() <= start.getTime()) {
    stop = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  }

  return { start, stop };
}
