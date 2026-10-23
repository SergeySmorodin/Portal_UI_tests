import { APIRequestContext, Page } from '@playwright/test';
import { config } from '../../../config';
import { expect, test, type RoleSession } from '../../../fixtures/test-fixtures';
import { createResourcePlanningPage } from '../../../pages/services/supervision/resource-planning-page';
import { createDistributionRequestsPage } from '../../../pages/services/supervision/distribution-requests-page';
import { createDistributionRequestsApprovalPage } from '../../../pages/services/supervision/distribution-requests-approval-page';
import { createSkipRequisitionsPage } from '../../../pages/skip/skip-requisitions-page';
import { createReportCardPage } from '../../../pages/services/supervision/report-card-page';
import { createTimeTableApprovalPage } from '../../../pages/services/supervision/time-table-page';
import { getWorkRequisitions } from '../../../test-data/api/requisition-api';
import { type WorkData } from '../../../types';
import { formatDmy, parseDmy, randomDate } from '../../../utils/date';

const VISIT_COUNT = 2;
const SKIP_TIME_TABLE_PATH = '/SKIP/approval/time-table';
const TD_TIME_TABLE_PATH = '/TechnicalDirector/approval/time-table';
const APPROVAL_STAGE_TITLES = ['Руководитель службы', 'Отдел планирования', 'Технический директор'];

interface Agreement {
  stage?: string;
  success?: boolean | null;
  to_user?: { full_name?: string } | null;
}

interface ReportCardVisit {
  actual?: string;
  new_report_card?: Array<{ agreements_report_card?: Agreement[] }>;
}

interface ReportCardPerson {
  user?: { full_name?: string };
  visits?: ReportCardVisit[];
}

interface ReportCardResponse {
  personal_project?: ReportCardPerson[];
}

interface RequestData {
  start: string;
  stop: string;
  ticketDate: string;
}

const buildRequestData = (workStart: string, workStop: string): RequestData => {
  const start = parseDmy(workStart);
  const stop = parseDmy(workStop);
  const requestStart = randomDate(start, stop);
  return {
    start: formatDmy(requestStart),
    stop: formatDmy(randomDate(requestStart, stop)),
    ticketDate: formatDmy(requestStart),
  };
};

const getReportCard = async (
  apiRequest: APIRequestContext,
  workPk: string
): Promise<ReportCardResponse> =>
  (await (
    await apiRequest.get(`/api/project_report_card/${workPk}/`)
  ).json()) as ReportCardResponse;

const getAgreements = async (apiRequest: APIRequestContext, workPk: string): Promise<string[]> => {
  const rc = await getReportCard(apiRequest, workPk);
  return (rc.personal_project ?? []).flatMap((person) =>
    (person.visits ?? []).flatMap((visit) =>
      (visit.new_report_card ?? []).flatMap((reportCard) =>
        (reportCard.agreements_report_card ?? []).map((agreement) => {
          const to = agreement.to_user;
          return `${agreement.stage}:${agreement.success === null ? 'null' : String(agreement.success)}:${to?.full_name ?? 'null'}`;
        })
      )
    )
  );
};

const getWorkerName = async (apiRequest: APIRequestContext, workPk: string): Promise<string> => {
  const rc = await getReportCard(apiRequest, workPk);
  return rc.personal_project?.[0]?.user?.full_name ?? '';
};

const expectAgreementStage = async (
  apiRequest: APIRequestContext,
  workPk: string,
  prefix: string
): Promise<void> => {
  await expect
    .poll(async () => (await getAgreements(apiRequest, workPk)).some((a) => a.startsWith(prefix)), {
      timeout: config.timeouts.long,
    })
    .toBe(true);
};

/** Проводит заявку по модалу «Управление заявками» до отправки на согласование. */
const submitRequest = async (page: Page, data: RequestData): Promise<void> => {
  const requests = createDistributionRequestsPage(page);

  await requests.createRequest();
  await requests.fillRequestCommon({
    start: data.start,
    stop: data.stop,
    living: 'Не требуется',
    taxi: 'Не требуется',
    money: '500',
    pass: 'Да',
  });
  await requests.clickNext();

  await requests.addRoutesToAll(VISIT_COUNT);
  await requests.addExtraTicketToFirst();
  await requests.selectMassEditCity('Откуда:', 'Москва');
  await requests.selectMassEditCity('Куда:', 'Санкт-Петербург');
  await requests.fillMassEdit({ date: data.ticketDate, transport: 'Авиа' });

  const submitted = page.waitForResponse(
    (response) =>
      response.url().includes('/api/project/opt2/') && response.request().method() === 'PATCH',
    { timeout: config.timeouts.long }
  );
  await requests.submitForApproval();

  const response = await submitted;
  expect(
    response.status(),
    `Заявка не отправлена: ${response.status()} ${await response.text()}`
  ).toBe(200);
};

const prepareWorkWithVisits = async (
  apiRequest: APIRequestContext,
  workPk: string,
  privileged: RoleSession
): Promise<void> => {
  const resourcePlanningPage = createResourcePlanningPage(privileged.page);
  await resourcePlanningPage.openWorkByPk(workPk);
  await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
  await resourcePlanningPage.saveVisitsPersisted(apiRequest, workPk, VISIT_COUNT);
};

const submitRequestForApproval = async (
  apiRequest: APIRequestContext,
  work: WorkData,
  workPk: string,
  privileged: RoleSession
): Promise<void> => {
  const requests = createDistributionRequestsPage(privileged.page);
  await requests.open();
  await requests.findWork(work.name);
  await submitRequest(privileged.page, buildRequestData(work.startDate, work.stopDate));

  await expect
    .poll(async () => (await getWorkRequisitions(apiRequest, workPk))[0]?.status, {
      timeout: config.timeouts.long,
    })
    .toBe('На согласование');
};

const approveDistributionRequest = async (work: WorkData, leader: RoleSession): Promise<void> => {
  const approval = createDistributionRequestsApprovalPage(leader.page);
  await approval.findAndOpenWork(work.name);
  await approval.openRequisitionCard();
  await approval.selectAllEmployees();
  expect(await approval.approve()).toBe(200);
};

/** Сотрудник СКИП обрабатывает заявку, после чего визиты становятся фактическими. */
const processRequestInSkip = async (work: WorkData, skip: RoleSession): Promise<void> => {
  const skipPage = createSkipRequisitionsPage(skip.page);
  await skipPage.open();
  await skipPage.findWork(work.name);
  await skipPage.openWork(work.name);

  const visitStart = parseDmy(work.startDate);
  const visitStop = parseDmy(work.stopDate);
  const correctedStart = randomDate(visitStart, visitStop);
  const correctedStop = randomDate(correctedStart, visitStop);

  await skipPage.takeRequestIntoWork();
  for (let i = 0; i < VISIT_COUNT; i++) {
    await skipPage.correctVisitDates(i, formatDmy(correctedStart), formatDmy(correctedStop));
  }
  await skipPage.processingNext();
  await skipPage.alignPerDiemStart(formatDmy(correctedStart));
  await skipPage.processingNext();
  await skipPage.finishProcessing();
};

const expectActualVisits = async (apiRequest: APIRequestContext, workPk: string): Promise<void> => {
  await expect
    .poll(
      async () => {
        const rc = await getReportCard(apiRequest, workPk);
        const visits = (rc.personal_project ?? []).flatMap((person) => person.visits ?? []);
        return (
          visits.length > 0 &&
          visits.every(
            (visit) => visit.actual === 'Фактическое' && (visit.new_report_card ?? []).length > 0
          )
        );
      },
      { timeout: config.timeouts.long }
    )
    .toBe(true);
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
  await reportCard.openRateRows();
  await reportCard.fillRate(workerName, '500');
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
