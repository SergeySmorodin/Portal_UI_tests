import { APIRequestContext } from '@playwright/test';
import { expect, test, type RoleSession } from '../../../fixtures/test-fixtures';
import { createReportCardPage } from '../../../pages/services/supervision/report-card-page';
import { createTimeTableApprovalPage, createTimeTablePage } from '../../../pages/services/supervision/time-table-page';
import { type WorkData } from '../../../types';
import { addDays, formatDmy, parseDmy } from '../../../utils/date';
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

  await test.step('Подготовить визиты и подать заявку на командировку', async () => {
    await prepareWorkWithVisits(apiRequest, workPk, privileged);
    await submitRequestForApproval(apiRequest, work, workPk, privileged, {
      start: formatDmy(start),
      stop: formatDmy(stop),
      ticketDate: formatDmy(start),
    });
  });

  await test.step('Согласовать заявку руководителем сервиса', async () => {
    await approveDistributionRequest(work, leader);
  });

  await test.step('Обработать заявку в СКИП и дождаться фактических визитов', async () => {
    await processRequestInSkip(work, skip, { start, stop });
    await expectActualVisits(apiRequest, workPk);
  });
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

  test('СЦЕНАРИЙ 1. Привилегированный сотрудник заполняет табель и отправляет на согласование', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const skip = await loginAs('skip');

    await prepareActualVisits(
      apiRequest,
      work,
      workPk,
      privileged,
      leader,
      skip
    );

    await test.step('Заполнить табель и отправить его на согласование', async () => {
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
    });

    await test.step('Проверить, что создан маршрут согласования на уровне руководителя службы', async () => {
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });
  });

  test('СЦЕНАРИЙ 2. Руководитель службы согласовывает табель', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const head = await loginAs('head');
    const skip = await loginAs('skip');

    await prepareActualVisits(
      apiRequest,
      work,
      workPk,
      privileged,
      leader,
      skip
    );

    await test.step('Заполнить табель и отправить на согласование', async () => {
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });

    await test.step('Проверить наличие вкладки «На согласование» для руководителя службы', async () => {
      await verifyTabs(head, 'На согласование');
    });

    await test.step('Руководитель службы согласовывает табель', async () => {
      await approveTimeTable(workPk, work.name, HEAD_TIME_TABLE_PATH, head);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:true');
    });

    await test.step('Проверить наличие вкладки «Отработанные» после согласования руководителем', async () => {
      await verifyTabs(head, 'Отработанные');
    });
  });

  test('СЦЕНАРИЙ 3. Отдел планирования обрабатывает табель', async ({
    apiRequest,
    createdWorkUi,
    loginAs,
  }) => {
    const { work, workPk } = createdWorkUi;
    const privileged = await loginAs('privileged');
    const leader = await loginAs('leader');
    const head = await loginAs('head');
    const skip = await loginAs('skip');

    await prepareActualVisits(
      apiRequest,
      work,
      workPk,
      privileged,
      leader,
      skip
    );

    await test.step('Заполнить табель и отправить на согласование', async () => {
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });

    await test.step('Руководитель службы согласовывает табель', async () => {
      await approveTimeTable(workPk, work.name, HEAD_TIME_TABLE_PATH, head);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:true');
    });

    await test.step('Проверить наличие вкладки «На согласование» для отдела планирования', async () => {
      await verifyTabs(skip, 'На согласование');
    });

    await test.step('Отдел планирования согласовывает табель', async () => {
      await approveTimeTable(workPk, work.name, SKIP_TIME_TABLE_PATH, skip);
      await expectAgreementStage(apiRequest, workPk, 'lvl_2:true');
    });

    await test.step('Проверить наличие вкладки «Отработанные» после согласования отделом планирования', async () => {
      await verifyTabs(skip, 'Отработанные');
    });
  });

  test('СЦЕНАРИЙ 4. Технический директор согласовывает табель', async ({
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

    await prepareActualVisits(
      apiRequest,
      work,
      workPk,
      privileged,
      leader,
      skip
    );

    await test.step('Заполнить табель и отправить на согласование', async () => {
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
    });

    await test.step('Руководитель службы согласовывает табель', async () => {
      await approveTimeTable(workPk, work.name, HEAD_TIME_TABLE_PATH, head);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:true');
    });

    await test.step('Отдел планирования согласовывает табель', async () => {
      await approveTimeTable(workPk, work.name, SKIP_TIME_TABLE_PATH, skip);
      await expectAgreementStage(apiRequest, workPk, 'lvl_2:true');
    });

    await test.step('Проверить наличие вкладки «На согласование» для технического директора', async () => {
      await verifyTabs(td, 'На согласование');
    });

    await test.step('Технический директор согласовывает табель', async () => {
      await approveTimeTable(workPk, work.name, TD_TIME_TABLE_PATH, td);
      await expectAgreementStage(apiRequest, workPk, 'lvl_3:true');
    });

    await test.step('Проверить наличие вкладки «Полностью согласованные» после согласования ТД', async () => {
      await verifyTabs(td, 'Полностью согласованные');
    });
  });

  test('Сценарий 5. Привилегированный сотрудник проверяет все статусы табеля', async ({
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

    await prepareActualVisits(
      apiRequest,
      work,
      workPk,
      privileged,
      leader,
      skip
    );

    await test.step('Пройти табель по всем этапам согласования', async () => {
      await fillReportCardAndSend(apiRequest, work, workPk, privileged);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:');
      await approveTimeTable(workPk, work.name, HEAD_TIME_TABLE_PATH, head);
      await expectAgreementStage(apiRequest, workPk, 'lvl_1:true');
      await approveTimeTable(workPk, work.name, SKIP_TIME_TABLE_PATH, skip);
      await expectAgreementStage(apiRequest, workPk, 'lvl_2:true');
      await approveTimeTable(workPk, work.name, TD_TIME_TABLE_PATH, td);
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
