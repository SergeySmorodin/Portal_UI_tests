import { APIRequestContext } from '@playwright/test';
import {
  expect,
  test,
  type CreatePortalWorker,
  type CreatedApprover,
} from '../../../fixtures/test-fixtures';
import { createReportCardPage } from '../../../pages/services/supervision/report-card-page';
import {
  createTimeTableApprovalPage,
  createTimeTablePage,
} from '../../../pages/services/supervision/time-table-page';
import { type WorkData } from '../../../types';
import { addDays, formatDmy, parseDmy } from '../../../utils/date';
import { config } from '../../../config';
import {
  APPROVAL_STAGE_TITLES,
  HEAD_TIME_TABLE_PATH,
  SKIP_TIME_TABLE_PATH,
  TD_TIME_TABLE_PATH,
  VISIT_COUNT,
  approveDistributionRequest,
  expectActualVisits,
  expectAgreementStage,
  prepareWorkWithVisitsByNames,
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

const fillReportCardAndSend = async (
  apiRequest: APIRequestContext,
  work: WorkData,
  workPk: string,
  privileged: CreatedApprover
): Promise<void> => {
  const workerName = await getWorkerName(apiRequest, workPk);
  expect(workerName, 'В табеле нет сотрудника для заполнения').not.toBe('');

  const reportCard = createReportCardPage(privileged);
  await reportCard.open(workPk);
  await reportCard.waitForLoaded(work.name);
  await reportCard.expectWorkerVisible(workerName);
  await reportCard.openRateRows();
  await reportCard.fillRateFor([workerName]);
  await reportCard.fillHoursFor([workerName]);
  await reportCard.save();
  await reportCard.openApproval();
  await reportCard.submitApproval(work.stopDate);
};

const approveTimeTable = async (
  workPk: string,
  workName: string,
  pagePath: string,
  approver: CreatedApprover
): Promise<void> => {
  const approvalPage = createTimeTableApprovalPage(approver, pagePath);
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
  approver: CreatedApprover
): Promise<void> => {
  const approvalPage = createTimeTableApprovalPage(approver, pagePath);
  await approvalPage.open();
  await approvalPage.searchProject(workName);
  await approvalPage.expectWorkVisible(workName);
  await approvalPage.openWork(workName);
  await approvalPage.reject();
};

const verifyTabs = async (approver: CreatedApprover, expectedTab: string): Promise<void> => {
  const timeTablePage = createTimeTablePage(approver);
  await timeTablePage.open();
  await timeTablePage.expectTabVisible(expectedTab);
};

const setupAndSubmit = async (
  superUserRequest: APIRequestContext,
  workPk: string,
  work: WorkData,
  privileged: CreatedApprover,
  leader: CreatedApprover,
  skip: CreatedApprover,
  createPortalWorker: CreatePortalWorker
): Promise<void> => {
  // Сотрудники создаются до открытия карточки работы: «Доступный персонал»
  // подгружается при открытии и не подтягивает новых людей. Сотрудники с
  // должностью потока «Супервайзинг» (фикстура createPortalWorker) попадают
  // в «Доступный персонал» без дополнительного назначения через API.
  const workerNames = await test.step(`Создать через API ${VISIT_COUNT} сотрудников`, async () => {
    const names: string[] = [];
    for (let i = 1; i <= VISIT_COUNT; i++) {
      const worker = await createPortalWorker({
        lastName: 'Табельных',
        firstName: `Сотрудник${i}`,
        patronymic: 'Тестович',
      });
      names.push(worker.fullName);
    }
    return names;
  });

  await test.step('Распределить созданных сотрудников на проект из доступного персонала', async () => {
    await prepareWorkWithVisitsByNames(superUserRequest, workPk, privileged, workerNames);
  });

  await submitRequestForApproval(superUserRequest, work, workPk, privileged, {
    start: formatDmy(visitPeriod(work).start),
    stop: formatDmy(visitPeriod(work).stop),
    ticketDate: formatDmy(visitPeriod(work).start),
  });
  await approveDistributionRequest(work, leader);
  await processRequestInSkip(work, skip, visitPeriod(work));
  await expectActualVisits(superUserRequest, workPk);
};

test.describe('Согласование табеля (пользователи с ролями через API-запросы)', () => {
  test.describe.configure({ mode: 'serial', timeout: 900_000 });

  test('Полный цикл согласования табеля: от заполнения до финального согласования ТД', async ({
    superUserRequest,
    createdWorkExecution,
    createApprovers,
    createPortalWorker,
  }) => {
    const { work, workPk } = createdWorkExecution;
    const { privileged, leader, head, skip, td } = await createApprovers();

    await test.step('Подготовка визитов и подача заявки на командировку', async () => {
      await setupAndSubmit(
        superUserRequest,
        workPk,
        work,
        privileged,
        leader,
        skip,
        createPortalWorker
      );
    });

    await test.step('Заполнение табеля и отправка на согласование', async () => {
      await fillReportCardAndSend(superUserRequest, work, workPk, privileged);
      await expectAgreementStage(superUserRequest, workPk, 'lvl_1:');
    });

    await test.step('Проверка вкладки «На согласование» для руководителя службы', async () => {
      await verifyTabs(head, 'На согласование');
    });

    await test.step('Согласование табеля руководителем службы', async () => {
      await approveTimeTable(workPk, work.name, HEAD_TIME_TABLE_PATH, head);
      await expectAgreementStage(superUserRequest, workPk, 'lvl_1:true');
    });

    await test.step('Проверка вкладки «Отработанные» после согласования руководителем', async () => {
      await verifyTabs(head, 'Отработанные');
    });

    await test.step('Проверка вкладки «На согласование» для отдела планирования', async () => {
      await verifyTabs(skip, 'На согласование');
    });

    await test.step('Согласование табеля отделом планирования (СКИП)', async () => {
      await approveTimeTable(workPk, work.name, SKIP_TIME_TABLE_PATH, skip);
      await expectAgreementStage(superUserRequest, workPk, 'lvl_2:true');
    });

    await test.step('Проверка вкладки «Отработанные» после согласования отделом планирования', async () => {
      await verifyTabs(skip, 'Отработанные');
    });

    await test.step('Проверка вкладки «На согласование» для технического директора', async () => {
      await verifyTabs(td, 'На согласование');
    });

    await test.step('Согласование табеля техническим директором', async () => {
      await approveTimeTable(workPk, work.name, TD_TIME_TABLE_PATH, td);
      await expectAgreementStage(superUserRequest, workPk, 'lvl_3:true');
    });

    await test.step('Проверка вкладки «Полностью согласованные» после согласования ТД', async () => {
      await verifyTabs(td, 'Полностью согласованные');
    });

    await test.step('Проверка отображения всех этапов согласования в табеле', async () => {
      const reportCard = createReportCardPage(privileged);
      await reportCard.open(workPk);
      await reportCard.waitForLoaded(work.name);
      await reportCard.expectApprovalStagesVisible(APPROVAL_STAGE_TITLES);
    });
  });

  test('Табель отклонен руководителем службы', async ({
    superUserRequest,
    createdWorkExecution,
    createApprovers,
    createPortalWorker,
  }) => {
    const { work, workPk } = createdWorkExecution;
    const { privileged, leader, head, skip } = await createApprovers();

    await test.step('Подготовка визитов и подача заявки на командировку', async () => {
      await setupAndSubmit(
        superUserRequest,
        workPk,
        work,
        privileged,
        leader,
        skip,
        createPortalWorker
      );
    });

    await test.step('Заполнение табеля и отправка на согласование', async () => {
      await fillReportCardAndSend(superUserRequest, work, workPk, privileged);
      await expectAgreementStage(superUserRequest, workPk, 'lvl_1:');
    });

    await test.step('Проверка вкладки «На согласование» для руководителя службы', async () => {
      await verifyTabs(head, 'На согласование');
    });

    await test.step('Отклонение табеля руководителем службы', async () => {
      await rejectTimeTable(workPk, work.name, HEAD_TIME_TABLE_PATH, head);
    });

    await test.step('Проверка, что табель вернулся на доработку', async () => {
      const reportCard = createReportCardPage(privileged);
      await reportCard.open(workPk);
      await reportCard.waitForLoaded(work.name);
      await reportCard.locators.approvalButton.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
    });
  });

  test('Табель отклонен техническим директором', async ({
    superUserRequest,
    createdWorkExecution,
    createApprovers,
    createPortalWorker,
  }) => {
    const { work, workPk } = createdWorkExecution;
    const { privileged, leader, head, skip, td } = await createApprovers();

    await test.step('Подготовка визитов и подача заявки на командировку', async () => {
      await setupAndSubmit(
        superUserRequest,
        workPk,
        work,
        privileged,
        leader,
        skip,
        createPortalWorker
      );
    });

    await test.step('Заполнение табеля и отправка на согласование', async () => {
      await fillReportCardAndSend(superUserRequest, work, workPk, privileged);
      await expectAgreementStage(superUserRequest, workPk, 'lvl_1:');
    });

    await test.step('Согласование табеля руководителем службы', async () => {
      await approveTimeTable(workPk, work.name, HEAD_TIME_TABLE_PATH, head);
      await expectAgreementStage(superUserRequest, workPk, 'lvl_1:true');
    });

    await test.step('Согласование табеля отделом планирования (СКИП)', async () => {
      await approveTimeTable(workPk, work.name, SKIP_TIME_TABLE_PATH, skip);
      await expectAgreementStage(superUserRequest, workPk, 'lvl_2:true');
    });

    await test.step('Проверка вкладки «На согласование» для технического директора', async () => {
      await verifyTabs(td, 'На согласование');
    });

    await test.step('Отклонение табеля техническим директором', async () => {
      await rejectTimeTable(workPk, work.name, TD_TIME_TABLE_PATH, td);
    });

    await test.step('Проверка, что табель вернулся на доработку', async () => {
      const reportCard = createReportCardPage(privileged);
      await reportCard.open(workPk);
      await reportCard.waitForLoaded(work.name);
      await reportCard.locators.approvalButton.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
    });
  });
});
