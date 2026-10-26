import { APIRequestContext } from '@playwright/test';
import { expect, test, type RoleSession } from '../../../fixtures/test-fixtures';
import { createReportCardPage } from '../../../pages/services/supervision/report-card-page';
import { createTimeTableApprovalPage } from '../../../pages/services/supervision/time-table-page';
import { type WorkData } from '../../../types';
import {
  APPROVAL_STAGE_TITLES,
  SKIP_TIME_TABLE_PATH,
  TD_TIME_TABLE_PATH,
  approveDistributionRequest,
  expectActualVisits,
  expectAgreementStage,
  prepareWorkWithVisits,
  processRequestInSkip,
  submitRequestForApproval,
} from './supervision-flow';
import { getWorkerName } from '../../../test-data/api/project-api';

const fillReportCardAndSend = async (
  apiRequest: APIRequestContext,
  work: WorkData,
  workPk: string,
  privileged: RoleSession
): Promise<void> => {
  const workerName = await getWorkerName(apiRequest, workPk);
  expect(workerName, 'В табеле нет сотрудника для заполнения').not.toBe('');

  const reportCard = createReportCardPage(privileged.page);
  await reportCard.open(workPk);
  await reportCard.waitForLoaded(work.name);
  await privileged.page.waitForTimeout(2000);
  await reportCard.openRateRows();
  await privileged.page.waitForTimeout(1000);
  await reportCard.fillRate(workerName, '500');
  await privileged.page.waitForTimeout(500);
  await reportCard.fillWorkHours(workerName, [0, 1, 2], '8');
  await reportCard.save();
  await reportCard.openApproval();
  await reportCard.submitApproval(work.stopDate);
};

const approveReportCard = async (
  work: WorkData,
  workPk: string,
  user: RoleSession
): Promise<void> => {
  const reportCard = createReportCardPage(user.page);
  await reportCard.open(workPk);
  await reportCard.waitForLoaded(work.name);
  await reportCard.openApproval();
  await reportCard.submitApproval(work.stopDate);
};

const approveTimeTable = async (
  work: WorkData,
  pagePath: string,
  user: RoleSession
): Promise<void> => {
  const approvalPage = createTimeTableApprovalPage(user.page, pagePath);
  await approvalPage.open();
  await approvalPage.expectWorkVisible(work.name);
  await approvalPage.openWork(work.name);
  await approvalPage.approve(work.stopDate);
};

/** Готовит работу с фактическими визитами и согласованной заявкой. */
const prepareWorkForReportCard = async (
  apiRequest: APIRequestContext,
  work: WorkData,
  workPk: string,
  privileged: RoleSession,
  leader: RoleSession
): Promise<void> => {
  await prepareWorkWithVisits(apiRequest, workPk, privileged);
  await submitRequestForApproval(apiRequest, work, workPk, privileged);
  await approveDistributionRequest(work, leader);
};

test.describe('Согласование табеля', () => {
  test.describe.configure({ mode: 'serial', timeout: 900_000 });

  test('СЦЕНАРИЙ 1. Привилегированный сотрудник заполняет табель и отправляет на согласование', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const skip = await loginAs('skip');

    await test.step('Подготовить визиты и подать заявку на командировку', async () => {
      await prepareWorkWithVisits(apiRequest, workPk, privileged);
      await submitRequestForApproval(apiRequest, work, workPk, privileged);
    });

    await test.step('Согласовать заявку руководителем службы', async () => {
      await approveDistributionRequest(work, leader);
    });

    await test.step('Обработать заявку в СКИП и дождаться фактических визитов', async () => {
      await processRequestInSkip(work, skip);
      await expectActualVisits(apiRequest, workPk);
    });

    await test.step('Заполнить табель и отправить его на согласование', async () => {
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
    });

    await test.step('Проверить, что создан маршрут согласования на уровне руководителя службы', async () => {
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });
  });

  // TODO: блокер - agreements_report_card.to_user=null, очередь согласования пустая
  test.skip('СЦЕНАРИЙ 2. Руководитель службы согласовывает табель', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const skip = await loginAs('skip');

    await test.step('Подготовить визиты, согласовать заявку и обработать её в СКИП', async () => {
      await prepareWorkForReportCard(apiRequest, work, workPk, privileged, leader);
      await processRequestInSkip(work, skip);
      await expectActualVisits(apiRequest, workPk);
    });

    await test.step('Заполнить табель и отправить на согласование', async () => {
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });

    await test.step('Руководитель службы согласовывает табель', async () => {
      await approveReportCard(work, workPk, leader);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:true');
    });
  });

  // TODO: блокер - agreements_report_card.to_user=null, очередь согласования пустая
  test.skip('СЦЕНАРИЙ 3. Отдел планирования обрабатывает табель', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const skip = await loginAs('skip');

    await test.step('Подготовить визиты, заявку и заполнить табель', async () => {
      await prepareWorkForReportCard(apiRequest, work, workPk, privileged, leader);
      await processRequestInSkip(work, skip);
      await expectActualVisits(apiRequest, workPk);
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });

    await test.step('Руководитель службы согласовывает табель', async () => {
      await approveReportCard(work, workPk, leader);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:true');
    });

    await test.step('Отдел планирования согласовывает табель', async () => {
      await approveTimeTable(work, SKIP_TIME_TABLE_PATH, skip);
      await expectAgreementStage(apiRequest, workPk, 'lvl_2:true');
    });
  });

  // TODO: блокер - agreements_report_card.to_user=null, очередь согласования пустая
  test.skip('СЦЕНАРИЙ 4. Технический директор согласовывает табель', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const skip = await loginAs('skip');
    const td = await loginAs('td');

    await test.step('Подготовить визиты, заявку и заполнить табель', async () => {
      await prepareWorkForReportCard(apiRequest, work, workPk, privileged, leader);
      await processRequestInSkip(work, skip);
      await expectActualVisits(apiRequest, workPk);
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });

    await test.step('Руководитель службы согласовывает табель', async () => {
      await approveReportCard(work, workPk, leader);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:true');
    });

    await test.step('Отдел планирования согласовывает табель', async () => {
      await approveTimeTable(work, SKIP_TIME_TABLE_PATH, skip);
      await expectAgreementStage(apiRequest, workPk, 'lvl_2:true');
    });

    await test.step('Технический директор согласовывает табель', async () => {
      await approveTimeTable(work, TD_TIME_TABLE_PATH, td);
      await expectAgreementStage(apiRequest, workPk, 'lvl_3:true');
    });
  });

  // TODO: блокер - agreements_report_card.to_user=null, очередь согласования пустая
  test.skip('Сценарий 5. Привилегированный сотрудник проверяет все статусы табеля', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const skip = await loginAs('skip');
    const td = await loginAs('td');

    await test.step('Пройти табель по всем этапам согласования', async () => {
      await prepareWorkForReportCard(apiRequest, work, workPk, privileged, leader);
      await processRequestInSkip(work, skip);
      await expectActualVisits(apiRequest, workPk);
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
      await approveReportCard(work, workPk, leader);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:true');
      await approveTimeTable(work, SKIP_TIME_TABLE_PATH, skip);
      await expectAgreementStage(apiRequest, workPk, 'lvl_2:true');
      await approveTimeTable(work, TD_TIME_TABLE_PATH, td);
      await expectAgreementStage(apiRequest, workPk, 'lvl_3:true');
    });

    await test.step('Проверить отображение всех этапов согласования в табеле', async () => {
      const reportCard = createReportCardPage(privileged.page);
      await reportCard.open(workPk);
      await reportCard.waitForLoaded(work.name);
      await reportCard.expectApprovalStagesVisible(APPROVAL_STAGE_TITLES);
    });
  });
});
