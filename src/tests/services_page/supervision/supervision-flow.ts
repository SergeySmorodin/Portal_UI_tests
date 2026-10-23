import { APIRequestContext, Page } from '@playwright/test';
import { config } from '../../../config';
import { expect, type RoleSession } from '../../../fixtures/test-fixtures';
import { createResourcePlanningPage } from '../../../pages/services/supervision/resource-planning-page';
import { createDistributionRequestsPage } from '../../../pages/services/supervision/distribution-requests-page';
import { createDistributionRequestsApprovalPage } from '../../../pages/services/supervision/distribution-requests-approval-page';
import { createSkipRequisitionsPage } from '../../../pages/skip/skip-requisitions-page';
import { getWorkRequisitions } from '../../../test-data/api/requisition-api';
import { type WorkData } from '../../../types';
import { formatDmy, parseDmy, randomDate } from '../../../utils/date';

//todo вынести
/**
 * Общие шаги супервайзинга: визиты → заявка на командировку → согласование
 * руководителем → обработка в СКИП (визиты становятся «Фактическими»,
 * после чего в табеле появляются ячейки дней).
 */
export const VISIT_COUNT = 2;
export const SKIP_TIME_TABLE_PATH = '/SKIP/approval/time-table';
export const TD_TIME_TABLE_PATH = '/TechnicalDirector/approval/time-table';
export const APPROVAL_STAGE_TITLES = [
  'Руководитель службы',
  'Отдел планирования',
  'Технический директор',
];

export interface Agreement {
  stage?: string;
  success?: boolean | null;
  to_user?: { full_name?: string } | null;
}

export interface ReportCardVisit {
  actual?: string;
  new_report_card?: Array<{ agreements_report_card?: Agreement[] }>;
}

export interface ReportCardPerson {
  user?: { full_name?: string };
  visits?: ReportCardVisit[];
}

export interface ReportCardResponse {
  personal_project?: ReportCardPerson[];
}

export interface RequestData {
  start: string;
  stop: string;
  ticketDate: string;
}

export const buildRequestData = (workStart: string, workStop: string): RequestData => {
  const start = parseDmy(workStart);
  const stop = parseDmy(workStop);
  const requestStart = randomDate(start, stop);
  return {
    start: formatDmy(requestStart),
    stop: formatDmy(randomDate(requestStart, stop)),
    ticketDate: formatDmy(requestStart),
  };
};

export const getReportCard = async (
  apiRequest: APIRequestContext,
  workPk: string
): Promise<ReportCardResponse> =>
  (await (
    await apiRequest.get(`/api/project_report_card/${workPk}/`)
  ).json()) as ReportCardResponse;

export const getAgreements = async (
  apiRequest: APIRequestContext,
  workPk: string
): Promise<string[]> => {
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

export const getWorkerName = async (
  apiRequest: APIRequestContext,
  workPk: string
): Promise<string> => {
  const rc = await getReportCard(apiRequest, workPk);
  return rc.personal_project?.[0]?.user?.full_name ?? '';
};

export const expectAgreementStage = async (
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
export const submitRequest = async (page: Page, data: RequestData): Promise<void> => {
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

export const prepareWorkWithVisits = async (
  apiRequest: APIRequestContext,
  workPk: string,
  privileged: RoleSession
): Promise<void> => {
  const resourcePlanningPage = createResourcePlanningPage(privileged.page);
  await resourcePlanningPage.openWorkByPk(workPk);
  await resourcePlanningPage.addAvailableWorkers(VISIT_COUNT);
  await resourcePlanningPage.saveVisitsPersisted(apiRequest, workPk, VISIT_COUNT);
};

export const submitRequestForApproval = async (
  apiRequest: APIRequestContext,
  work: WorkData,
  workPk: string,
  privileged: RoleSession,
  data: RequestData = buildRequestData(work.startDate, work.stopDate)
): Promise<void> => {
  const requests = createDistributionRequestsPage(privileged.page);
  await requests.open();
  await requests.findWork(work.name);
  await submitRequest(privileged.page, data);

  await expect
    .poll(async () => (await getWorkRequisitions(apiRequest, workPk))[0]?.status, {
      timeout: config.timeouts.long,
    })
    .toBe('На согласование');
};

export const approveDistributionRequest = async (
  work: WorkData,
  leader: RoleSession
): Promise<void> => {
  const approval = createDistributionRequestsApprovalPage(leader.page);
  await approval.findAndOpenWork(work.name);
  await approval.openRequisitionCard();
  await approval.selectAllEmployees();
  expect(await approval.approve()).toBe(200);
};

/** Сотрудник СКИП обрабатывает заявку, после чего визиты становятся фактическими. */
export const processRequestInSkip = async (
  work: WorkData,
  skip: RoleSession,
  dates?: { start: Date; stop: Date }
): Promise<void> => {
  const skipPage = createSkipRequisitionsPage(skip.page);
  await skipPage.open();
  await skipPage.findWork(work.name);
  await skipPage.openWork(work.name);

  const visitStart = parseDmy(work.startDate);
  const visitStop = parseDmy(work.stopDate);
  const correctedStart = dates?.start ?? randomDate(visitStart, visitStop);
  const correctedStop = dates?.stop ?? randomDate(correctedStart, visitStop);

  await skipPage.takeRequestIntoWork();
  for (let i = 0; i < VISIT_COUNT; i++) {
    await skipPage.correctVisitDates(i, formatDmy(correctedStart), formatDmy(correctedStop));
  }
  await skipPage.processingNext();
  await skipPage.alignPerDiemStart(formatDmy(correctedStart));
  await skipPage.processingNext();
  await skipPage.finishProcessing();
};

export const expectActualVisits = async (
  apiRequest: APIRequestContext,
  workPk: string
): Promise<void> => {
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
