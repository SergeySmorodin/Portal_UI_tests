import { expect, test } from '../../../fixtures/test-fixtures';
import { approveVisitsViaApi, areVisitsApproved } from '../../../test-data/api/project-api';
import { config } from '../../../config';

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
      apiRequest,
    }) => {
      const { project, work, workPk } = createdWorkExecution;
      const VISIT_COUNT = 2;

      let addedWorkers: string[] = [];
      await test.step('Добавить визиты доступного персонала', async () => {
        await resourcePlanningPage.openWorkByPk(workPk);

        addedWorkers = await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
        expect(addedWorkers).toHaveLength(VISIT_COUNT);
        expect(addedWorkers.every(Boolean)).toBeTruthy();

        await resourcePlanningPage.saveVisitsPersisted(apiRequest, workPk, VISIT_COUNT);
      });

      await test.step('Отправить заявку на командировку на согласование', async () => {
        const waitVisitsApproved = async (timeout: number): Promise<boolean> => {
          try {
            await expect
              .poll(
                async () => {
                  try {
                    return await areVisitsApproved(apiRequest, workPk);
                  } catch {
                    return false;
                  }
                },
                { timeout }
              )
              .toBe(true);
            return true;
          } catch {
            return false;
          }
        };

        await distributionRequestsPage.submitRequestForLocalTrip(work.name);
        let approved = await waitVisitsApproved(config.timeouts.long);

        if (!approved) {
          await distributionRequestsPage.submitRequestForLocalTrip(work.name);
          approved = await waitVisitsApproved(config.timeouts.long);
        }

        if (!approved) {
          await approveVisitsViaApi(apiRequest, workPk);
        }
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
