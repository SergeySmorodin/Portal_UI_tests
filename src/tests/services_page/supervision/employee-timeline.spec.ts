import { expect, test } from '../../../fixtures/test-fixtures';

test.describe('Календарь занятости сотрудников', () => {
  test(
    'Добавить сотрудника на работу и проверить его появление в календаре занятости',
    { tag: '@smoke' },
    async ({ resourcePlanningPage, employeeTimelinePage, createdWork, apiRequest }) => {
      const { work, workPk, projectCode } = createdWork;
      const VISIT_COUNT = 1;

      let addedWorkers: string[] = [];
      await test.step('Добавить сотрудника на работу через распределение персонала', async () => {
        await resourcePlanningPage.openWorkByPk(workPk);

        addedWorkers = await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
        expect(addedWorkers).toHaveLength(VISIT_COUNT);
        expect(addedWorkers.every(Boolean)).toBeTruthy();

        await resourcePlanningPage.saveVisitsPersisted(apiRequest, workPk, VISIT_COUNT);
      });

      await test.step('Открыть «Календарь занятости сотрудников» и установить период работы', async () => {
        await employeeTimelinePage.open();
        await employeeTimelinePage.setPeriod(work.startDate, work.stopDate);
      });

      await test.step('Найти добавленного сотрудника в календаре', async () => {
        await employeeTimelinePage.searchEmployee(addedWorkers[0]);
        await employeeTimelinePage.expectEmployeeVisible(addedWorkers[0]);
      });

      await test.step('Проверить наличие планируемого визита сотрудника с кодом проекта', async () => {
        await employeeTimelinePage.expectPlannedVisitVisible(projectCode);
      });
    }
  );
});
