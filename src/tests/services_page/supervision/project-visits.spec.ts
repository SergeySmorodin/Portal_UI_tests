import { config } from '../../../config';
import { api } from '../../../test-data/api/api-handles';
import { expect, test } from '../../../fixtures/test-fixtures';

test.describe('Распределение на работу', () => {
  test(
    'Создать работу через API и добавить визиты доступного персонала',
    { tag: '@smoke' },
    async ({ page, resourcePlanningPage, createdWork }) => {
      const { work } = createdWork;
      const VISIT_COUNT = 3;

      await test.step('Найти созданную работу на странице распределения', async () => {
        await resourcePlanningPage.open();
        await resourcePlanningPage.searchWork(work.name);
        await resourcePlanningPage.openWork(work.name);
      });

      let addedWorkers: string[] = [];
      await test.step('Добавить визиты доступного персонала', async () => {
        addedWorkers = await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
        expect(addedWorkers).toHaveLength(VISIT_COUNT);
        expect(addedWorkers.every(Boolean)).toBeTruthy();
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
