import { expect, test } from '../../../fixtures/test-fixtures';

test.describe('Табель работ', () => {
  test(
    'Открыть табель работы со статусом «Выполнение работы» и проверить персонал',
    { tag: '@smoke' },
    async ({ resourcePlanningPage, workingToolsPage, reportCardPage, createdWorkExecution }) => {
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

      await test.step('Найти созданный мегапроект на странице «Проекты направления супервайзинга»', async () => {
        await workingToolsPage.open();
        await workingToolsPage.searchProject(project.code);
        await workingToolsPage.openProject(project.code);
      });

      await test.step('Открыть табель созданной работы', async () => {
        await workingToolsPage.findWork(work.name);
        await workingToolsPage.openReportCard(work.name);
      });

      // todo заполнить табель

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

    }
  );
});


      // todo заполнить расшифровку ставок