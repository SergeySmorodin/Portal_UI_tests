import { config } from '../../../config';
import { areVisitsApproved, approveVisitsViaApi } from '../../../test-data/api/project-api';
import { expect, test } from '../../../fixtures/test-fixtures';

// Табель подготавливается как в report-card.spec.ts, но проверяется на странице
// «Согласование табелей» (/services/supervision/time-table).
test.describe('Согласование табелей', () => {
  test(
    'Созданная заявка на согласование табеля отображается в «Состояние табелей»',
    { tag: '@smoke' },
    async ({
      apiRequest,
      resourcePlanningPage,
      workingToolsPage,
      reportCardPage,
      timeTablePage,
      createdWorkExecution,
    }) => {
      const { project, work, workPk } = createdWorkExecution;
      const VISIT_COUNT = 2;

      let addedWorkers: string[] = [];
      await test.step('Добавить визиты доступного персонала', async () => {
        await resourcePlanningPage.openWorkByPk(workPk);

        addedWorkers = await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
        expect(addedWorkers).toHaveLength(VISIT_COUNT);

        await resourcePlanningPage.saveVisitsPersisted(apiRequest, workPk, VISIT_COUNT);
      });

      await test.step('Перевести визиты в статус «На согласовании» через API', async () => {
        await approveVisitsViaApi(apiRequest, workPk);

        await expect
          .poll(() => areVisitsApproved(apiRequest, workPk), { timeout: config.timeouts.long })
          .toBe(true);
      });

      await test.step('Открыть табель созданной работы', async () => {
        await workingToolsPage.open();
        await workingToolsPage.searchProject(project.code);
        await workingToolsPage.openProject(project.code);
        await workingToolsPage.findWork(work.name);
        await workingToolsPage.openReportCard(work.name);

        await reportCardPage.waitForLoaded(work.name);
      });

      await test.step('Создать табели участникам', async () => {
        await reportCardPage.createPeriods();
        await reportCardPage.waitForLoaded(work.name);
      });

      await test.step('Заполнить ставки и рабочие часы первых трёх дней', async () => {
        await reportCardPage.openRateRows();

        for (const name of addedWorkers) {
          await reportCardPage.fillRate(name, '500');
          await reportCardPage.fillWorkHours(name, [0, 1, 2], '8');
        }
      });

      await test.step('Сохранить табель', async () => {
        await reportCardPage.save();
        await reportCardPage.waitForLoaded(work.name);
      });

      await test.step('Отправить табель на согласование', async () => {
        await reportCardPage.openApproval();
        await reportCardPage.submitApproval(work.stopDate);

        await expect
          .poll(() => reportCardPage.getPeriodsCount(), { timeout: config.timeouts.long })
          .toBeGreaterThan(0);
      });

      await test.step('Найти работу в «Параметры поиска» на странице «Согласование табелей»', async () => {
        await timeTablePage.open();
        await timeTablePage.searchProject(project.code);
        await timeTablePage.expectWorkVisible(work.name);
      });

      await test.step('Перейти по ссылке работы в столбце «Работа»', async () => {
        await timeTablePage.openApproval(work.name);
        await timeTablePage.waitForApprovalLoaded(work.name);
      });

      await test.step('Проверить состояние в «Состояние табелей»', async () => {
        await expect
          .poll(() => timeTablePage.getStateTotal(), { timeout: config.timeouts.long })
          .toBeGreaterThan(0);

        await expect
          .poll(() => timeTablePage.getStateCount('На согласование'), {
            timeout: config.timeouts.long,
          })
          .toBeGreaterThan(0);
      });
    }
  );
});
