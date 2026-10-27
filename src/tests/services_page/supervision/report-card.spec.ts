import { expect, test } from '../../../fixtures/test-fixtures';
import { config } from '../../../config';
import { addDays, formatDmy, parseDmy } from '../../../utils/date';
import {
  approveDistributionRequest,
  expectActualVisits,
  processRequestInSkip,
  submitRequestForApproval,
} from './supervision-flow';

test.describe('Табель работ', () => {
  test(
    'Открыть табель работы со статусом «Выполнение работы» и проверить персонал',
    { tag: '@smoke' },
    async ({
      resourcePlanningPage,
      workingToolsPage,
      reportCardPage,
      createdWorkExecution,
      apiRequest,
      authenticatedPage,
      loginAs,
    }) => {
      test.setTimeout(300_000);
      const { project, work, workPk } = createdWorkExecution;
      const VISIT_COUNT = 2;
      // Фиксированный недельный визит с начала работы: в табеле гарантированно
      // есть минимум три дня для заполнения часов.
      const visitStart = parseDmy(work.startDate);
      const visitStop = addDays(visitStart, 6);
      const admin = { page: authenticatedPage, context: authenticatedPage.context(), username: '' };

      let addedWorkers: string[] = [];
      await test.step('Добавить визиты доступного персонала', async () => {
        await resourcePlanningPage.openWorkByPk(workPk);

        addedWorkers = await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
        expect(addedWorkers).toHaveLength(VISIT_COUNT);
        expect(addedWorkers.every(Boolean)).toBeTruthy();

        await resourcePlanningPage.saveVisitsPersisted(apiRequest, workPk, VISIT_COUNT);
      });

      await test.step('Подать заявку на командировку и согласовать её руководителем службы', async () => {
        await submitRequestForApproval(apiRequest, work, workPk, admin, {
          start: formatDmy(visitStart),
          stop: formatDmy(visitStop),
          ticketDate: formatDmy(visitStart),
        });
        await approveDistributionRequest(work, await loginAs('leader'));
      });

      await test.step('Обработать заявку в СКИП и дождаться фактических визитов', async () => {
        await processRequestInSkip(work, await loginAs('skip'), {
          start: visitStart,
          stop: visitStop,
        });
        await expectActualVisits(apiRequest, workPk);
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

        await expect(reportCardPage.locators.workerRows).toHaveCount(VISIT_COUNT, {
          timeout: config.timeouts.long,
        });

        for (const name of addedWorkers) {
          await reportCardPage.expectWorkerVisible(name);
        }
      });

      await test.step('Открыть строки ставок и заполнить значения ставок', async () => {
        await reportCardPage.openRateRows();
        await reportCardPage.selectAllRows();

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

      await test.step('Отправить табель на согласование', async () => {
        await reportCardPage.openApproval();
        await reportCardPage.submitApproval(work.stopDate);
      });

      await test.step('Проверить, что табель отправлен на согласование', async () => {
        await expect.poll(async () => reportCardPage.getPeriodsCount()).toBeGreaterThan(0);
      });
    }
  );
});
