import { expect, test } from '../../../fixtures/test-fixtures';

test.describe('Табель работ', () => {
  test(
    'Открыть табель работы со статусом «Выполнение работы» и проверить персонал',
    { tag: '@smoke' },
    async ({
      resourcePlanningPage,
      workingToolsPage,
      distributionRequestsPage,
      reportCardPage,
      createdWorkExecution,
    }) => {
      const { project, work } = createdWorkExecution;
      const VISIT_COUNT = 2;

      let addedWorkers: string[] = [];
      await test.step('Добавить визиты доступного персонала', async () => {
        await resourcePlanningPage.open();
        await resourcePlanningPage.searchWork(work.name);
        await resourcePlanningPage.openWork(work.name);

        addedWorkers = await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
        expect(addedWorkers).toHaveLength(VISIT_COUNT);
        expect(addedWorkers.every(Boolean)).toBeTruthy();

        await resourcePlanningPage.openVisitsManagement();
        await resourcePlanningPage.saveVisits();
      });

      await test.step('Отправить заявку на командировку на согласование', async () => {
        await distributionRequestsPage.open();
        await distributionRequestsPage.findWork(work.name);
        await distributionRequestsPage.createRequest();
        await distributionRequestsPage.markVisitsAsLocalTrip();
        await distributionRequestsPage.clickNext();
        await distributionRequestsPage.submitForApproval();
      });

      await test.step('Найти созданный мегапроект на странице «Проекты направления супервайзинга»', async () => {
        await workingToolsPage.open();
        await workingToolsPage.searchProject(project.code);
        await workingToolsPage.openProject(project.code);
      });

      await test.step('Открыть табель созданной работы', async () => {
        await workingToolsPage.findWork(work.name);
        await workingToolsPage.openReportCard(work.name);
      });

      await test.step('Проверить табель работы', async () => {
        await reportCardPage.waitForLoaded(work.name);

        const heading = await reportCardPage.getHeading();
        expect(heading).toContain('Табель работы');
        expect(heading).toContain(work.name);

        const count = await reportCardPage.getWorkerCount();
        expect(count).toBe(VISIT_COUNT);

        for (const name of addedWorkers) {
          await reportCardPage.expectWorkerVisible(name);
        }
      });

      await test.step('Создать табели участникам', async () => {
        await reportCardPage.createPeriods();
        await reportCardPage.waitForLoaded(work.name);
      });

      await test.step('Открыть строки ставок и заполнить значения ставок', async () => {
        await reportCardPage.openRateRows();

        for (const name of addedWorkers) {
          await reportCardPage.fillRate(name, '500');
          expect(await reportCardPage.getRateInputValue(name)).toBe('500');
        }
      });

      await test.step('Заполнить рабочие часы первых трёх дней', async () => {
        for (const name of addedWorkers) {
          await reportCardPage.fillWorkHours(name, [0, 1, 2], '8');
        }
      });

      await test.step('Сохранить табель', async () => {
        await reportCardPage.save();
      });

      await test.step('Проверить сумму часов и сумму денег', async () => {
        await reportCardPage.waitForLoaded(work.name);

        for (const name of addedWorkers) {
          await expect.poll(async () => reportCardPage.getHours(name)).toBe('24');
          await expect.poll(async () => reportCardPage.getSum(name)).toBe('12000');
        }
      });

      // todo отправить на согласование
    }
  );
});
