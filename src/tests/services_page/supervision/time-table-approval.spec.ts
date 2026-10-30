import { APIRequestContext } from '@playwright/test';
import { expect, test, type RoleSession } from '../../../fixtures/test-fixtures';
import { createReportCardPage } from '../../../pages/services/supervision/report-card-page';
import { createTimeTableApprovalPage, createTimeTablePage } from '../../../pages/services/supervision/time-table-page';
import { type WorkData } from '../../../types';
import { addDays, formatDmy, parseDmy } from '../../../utils/date';
import { config } from '../../../config';
import {
  APPROVAL_STAGE_TITLES,
  HEAD_TIME_TABLE_PATH,
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

/**
 * Фиксированный недельный визит с начала работы: в табеле гарантированно
 * есть минимум три дня для заполнения часов (случайные даты СКИП могли
 * давать визит в один день, и ячеек дней не хватало).
 */
const visitPeriod = (work: WorkData): { start: Date; stop: Date } => {
  const start = parseDmy(work.startDate);
  return { start, stop: addDays(start, 6) };
};

/** Визиты → заявка → согласование руководителем → обработка в СКИП → «Фактические» визиты. */
const prepareActualVisits = async (
  apiRequest: APIRequestContext,
  work: WorkData,
  workPk: string,
  privileged: RoleSession,
  leader: RoleSession,
  skip: RoleSession
): Promise<void> => {
  const { start, stop } = visitPeriod(work);

  await prepareWorkWithVisits(apiRequest, workPk, privileged);
  await submitRequestForApproval(apiRequest, work, workPk, privileged, {
    start: formatDmy(start),
    stop: formatDmy(stop),
    ticketDate: formatDmy(start),
  });

  await approveDistributionRequest(work, leader);

  await processRequestInSkip(work, skip, { start, stop });
  await expectActualVisits(apiRequest, workPk);
};

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
  await reportCard.expectWorkerVisible(workerName);
  await reportCard.openRateRows();
  await reportCard.fillRate(workerName, '500');
  await reportCard.fillWorkHours(workerName, [0, 1, 2], '8');
  await reportCard.save();
  await reportCard.openApproval();
  await reportCard.submitApproval(work.stopDate);
};

const approveTimeTable = async (
  workPk: string,
  workName: string,
  pagePath: string,
  user: RoleSession
): Promise<void> => {
  const approvalPage = createTimeTableApprovalPage(user.page, pagePath);
  await approvalPage.open();
  await approvalPage.searchProject(workName);
  await approvalPage.expectWorkVisible(workName);
  await approvalPage.openWork(workName);
  await approvalPage.approve();
};

const rejectTimeTable = async (
  workPk: string,
  workName: string,
  pagePath: string,
  user: RoleSession
): Promise<void> => {
  const approvalPage = createTimeTableApprovalPage(user.page, pagePath);
  await approvalPage.open();
  await approvalPage.searchProject(workName);
  await approvalPage.expectWorkVisible(workName);
  await approvalPage.openWork(workName);
  await approvalPage.reject();
};

// Проверка наличия вкладок на странице согласования табелей
const verifyTabs = async (
  user: RoleSession,
  expectedTab: string
): Promise<void> => {
  const timeTablePage = createTimeTablePage(user.page);
  await timeTablePage.open();
  await timeTablePage.expectTabVisible(expectedTab);
};

test.describe('Согласование табеля', () => {
  test.describe.configure({ mode: 'serial', timeout: 900_000 });

  test('Полный цикл согласования табеля: от заполнения до финального согласования ТД', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const head = await loginAs('head');
    const skip = await loginAs('skip');
    const td = await loginAs('td');

    await test.step('Подготовка визитов и подача заявки на командировку', async () => {
      await prepareActualVisits(apiRequest, work, workPk, privileged, leader, skip);
    });

    await test.step('Заполнение табеля и отправка на согласование', async () => {
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });

    await test.step('Проверка вкладки «На согласование» для руководителя службы', async () => {
      await verifyTabs(head, 'На согласование');
    });

    await test.step('Согласование табеля руководителем службы', async () => {
      await approveTimeTable(workPk, work.name, HEAD_TIME_TABLE_PATH, head);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:true');
    });

    await test.step('Проверка вкладки «Отработанные» после согласования руководителем', async () => {
      await verifyTabs(head, 'Отработанные');
    });

    await test.step('Проверка вкладки «На согласование» для отдела планирования', async () => {
      await verifyTabs(skip, 'На согласование');
    });

    await test.step('Согласование табеля отделом планирования (СКИП)', async () => {
      await approveTimeTable(workPk, work.name, SKIP_TIME_TABLE_PATH, skip);
      await expectAgreementStage(apiRequest, workPk, 'lvl_2:true');
    });

    await test.step('Проверка вкладки «Отработанные» после согласования отделом планирования', async () => {
      await verifyTabs(skip, 'Отработанные');
    });

    await test.step('Проверка вкладки «На согласование» для технического директора', async () => {
      await verifyTabs(td, 'На согласование');
    });

    await test.step('Согласование табеля техническим директором', async () => {
      await approveTimeTable(workPk, work.name, TD_TIME_TABLE_PATH, td);
      await expectAgreementStage(apiRequest, workPk, 'lvl_3:true');
    });

    await test.step('Проверка вкладки «Полностью согласованные» после согласования ТД', async () => {
      await verifyTabs(td, 'Полностью согласованные');
    });

    await test.step('Проверка отображения всех этапов согласования в табеле', async () => {
      const reportCard = createReportCardPage(privileged.page);
      await reportCard.open(workPk);
      await reportCard.waitForLoaded(work.name);
      await reportCard.expectApprovalStagesVisible(APPROVAL_STAGE_TITLES);
    });
  });

  test('Табель отклонен руководителем службы', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const head = await loginAs('head');
    const skip = await loginAs('skip');

    await test.step('Подготовка визитов и подача заявки на командировку', async () => {
      await prepareActualVisits(apiRequest, work, workPk, privileged, leader, skip);
    });

    await test.step('Заполнение табеля и отправка на согласование', async () => {
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });

    await test.step('Проверка вкладки «На согласование» для руководителя службы', async () => {
      await verifyTabs(head, 'На согласование');
    });

    await test.step('Отклонение табеля руководителем службы', async () => {
      await rejectTimeTable(workPk, work.name, HEAD_TIME_TABLE_PATH, head);
      // После отклонения проверяем, что табель вернулся на доработку
      await page.waitForTimeout(3000);
    });

    await test.step('Проверка, что табель вернулся на доработку', async () => {
      const reportCard = createReportCardPage(privileged.page);
      await reportCard.open(workPk);
      await reportCard.waitForLoaded(work.name);
      // Проверяем, что кнопка согласования видима (значит табель на доработке)
      await reportCard.locators.approvalButton.waitFor({ state: 'visible', timeout: config.timeouts.long });
    });
  });

  test('Табель отклонен техническим директором', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const head = await loginAs('head');
    const skip = await loginAs('skip');
    const td = await loginAs('td');

    await test.step('Подготовка визитов и подача заявки на командировку', async () => {
      await prepareActualVisits(apiRequest, work, workPk, privileged, leader, skip);
    });

    await test.step('Заполнение табеля и отправка на согласование', async () => {
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });

    await test.step('Согласование табеля руководителем службы', async () => {
      await approveTimeTable(workPk, work.name, HEAD_TIME_TABLE_PATH, head);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:true');
    });

    await test.step('Согласование табеля отделом планирования (СКИП)', async () => {
      await approveTimeTable(workPk, work.name, SKIP_TIME_TABLE_PATH, skip);
      await expectAgreementStage(apiRequest, workPk, 'lvl_2:true');
    });

    await test.step('Проверка вкладки «На согласование» для технического директора', async () => {
      await verifyTabs(td, 'На согласование');
    });

    await test.step('Отклонение табеля техническим директором', async () => {
      await rejectTimeTable(workPk, work.name, TD_TIME_TABLE_PATH, td);
      await expectAgreementStage(apiRequest, workPk, 'lvl_3:false');
    });

    await test.step('Проверка, что табель вернулся на доработку', async () => {
      const reportCard = createReportCardPage(privileged.page);
      await reportCard.open(workPk);
      await reportCard.waitForLoaded(work.name);
      // Проверяем, что кнопка согласования видима (значит табель на доработке)
      await reportCard.locators.approvalButton.waitFor({ state: 'visible', timeout: config.timeouts.long });
    });
  });
});
