import { config } from '../../../config';
import { api } from '../../../test-data/api/api-handles';
import { expect, test } from '../../../fixtures/test-fixtures';

test.describe('Распределение на работу', () => {
  test(
    'Создать работу через API и добавить визиты персонала, созданного через API',
    { tag: '@smoke' },
    async ({ page, resourcePlanningPage, createdWork, createPortalWorker }) => {
      test.setTimeout(120_000);

      const { work, workPk } = createdWork;
      const VISIT_COUNT = 3;

      await test.step('Проверить, что созданная работа отображается в поиске на странице распределения', async () => {
        await resourcePlanningPage.open();
        await resourcePlanningPage.searchWork(work.name);
        await resourcePlanningPage.assertWorkVisible(work.name);
      });

      const workers = await test.step(`Создать через API ${VISIT_COUNT} сотрудников`, async () => {
        const created = [];
        for (let i = 1; i <= VISIT_COUNT; i += 1) {
          created.push(
            await createPortalWorker({
              lastName: 'Визитов',
              firstName: `Сотрудник${i}`,
              patronymic: 'Тестович',
            })
          );
        }
        return created;
      });
      const workerNames = workers.map((worker) => worker.fullName);

      // Карточка работы открывается после создания сотрудников: «Доступный
      // персонал» подгружается при открытии и не подтягивает новых людей.
      await test.step('Найти созданную работу на странице распределения', async () => {
        await resourcePlanningPage.openWorkByPk(workPk);
      });

      let addedWorkers: string[] = [];
      await test.step('Добавить визиты созданного персонала', async () => {
        addedWorkers = await resourcePlanningPage.addAvailableWorkersByNames(workerNames);
        expect(addedWorkers).toEqual(workerNames);
      });

      await test.step('Проверить появление работников в Заявленном персонале', async () => {
        const claimedCount = await resourcePlanningPage.getClaimedPersonnelCount();
        expect(claimedCount).toBe(`${VISIT_COUNT} чел.`);

        await resourcePlanningPage.assertClaimedContains(addedWorkers);
      });

      await test.step('Открыть Управление визитами и сохранить', async () => {
        await resourcePlanningPage.openVisitsManagement();

        const responsePromise = page.waitForResponse(
          (resp) =>
            resp.url().includes(api.resourcePlanning.workOptions) &&
            resp.request().method() === 'PATCH',
          { timeout: config.timeouts.long }
        );

        await resourcePlanningPage.saveVisits();

        const response = await responsePromise;
        expect(response.status()).toBe(200);
      });
    }
  );
});
