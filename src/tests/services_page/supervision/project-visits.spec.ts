import { config } from '../../../config/config';
import { api } from '../../../test-data/api/api';
import { createProjectViaApi, createWorkViaApi } from '../../../test-data/api/project-api';
import { projectFactory } from '../../../test-data/factory/project-factory';
import { workFactory } from '../../../test-data/factory/work-factory';
import { expect, test } from '../../../fixtures/test-fixtures';

test.describe('Распределение на работу', () => {
  test(
    'Создать работу через API и добавить визиты доступного персонала',
    { tag: '@smoke' },
    async ({ page, apiRequest, resourcePlanningPage }) => {
      const project = projectFactory.active();
      const work = workFactory.standard({
        startDate: project.startDate,
        stopDate: project.stopDate,
      });
      const VISIT_COUNT = 3;

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

        const workPk = await createWorkViaApi(apiRequest, work, {
          megaProjectPk: createdProject.pk,
          contractPk: contracts[0].pk,
        });
        expect(workPk).toBeTruthy();
      });

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
