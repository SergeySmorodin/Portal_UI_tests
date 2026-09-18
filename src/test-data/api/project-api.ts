import { APIRequestContext } from '@playwright/test';
import { ProjectData, WorkData } from '../../types';
import { api } from './api-handles';
import { formatYmd, parseDmy } from '../../utils/date';

export interface WorkCreateOptions {
  megaProjectPk: string;
  contractPk: string;
  status?: string;
  equipment?: string;
}

/**
 * Возвращает pk первого доступного договора (для привязки работы) или выбрасывает ошибку.
 */
export const getFirstContractPk = async (request: APIRequestContext): Promise<string> => {
  const response = await request.get(api.contract);
  const body = (await response.json()) as
    Array<{ pk: string }> | { results: Array<{ pk: string }> };
  const contracts = Array.isArray(body) ? body : body.results;

  const contract = contracts?.find((c) => Boolean(c?.pk));
  if (!contract) {
    throw new Error('Нет доступных договоров для создания работы');
  }
  return contract.pk;
};

/**
 * Создаёт мегапроект через API /api/megaproject/ (вместо прохождения формы в UI).
 * Возвращает код и pk созданного мегапроекта.
 */
export const createProjectViaApi = async (
  request: APIRequestContext,
  project: ProjectData
): Promise<{ code: string; pk: string }> => {
  const response = await request.post(api.project, {
    data: {
      code: project.code,
      status: project.status,
      start_date: project.startDate,
      stop_date: project.stopDate,
      group_project: project.groupProject || undefined,
      type_project: project.typeProject || undefined,
      department_project: project.departmentProject || undefined,
      kind_project: project.kindProject || undefined,
      note: project.note,
    },
  });

  if (!response.ok()) {
    throw new Error(
      `Создание мегапроекта через API не удалось (${response.status()}): ${await response.text()}`
    );
  }

  const body = (await response.json()) as { code: string; pk: string };
  return { code: body.code, pk: body.pk };
};

/**
 * Создаёт работу через API /api/project/create/ и привязывает её к мегапроекту.
 * Возвращает pk созданной работы.
 */
export const createWorkViaApi = async (
  request: APIRequestContext,
  work: WorkData,
  options: WorkCreateOptions
): Promise<string> => {
  const response = await request.post(api.work, {
    data: {
      name: work.name,
      status: options.status || 'Подготовка',
      fact_start: work.startDate,
      fact_stop: work.stopDate,
      temporary_personal: Number(work.temporaryPersonal) || 0,
      work_shift: Number(work.workShift) || 0,
      to_contract: [{ pk: options.contractPk }],
      to_cfo: null,
      to_mega_project: { pk: options.megaProjectPk },
      place: [],
      project_supervision: { equipment: options.equipment || work.direction },
    },
  });

  if (!response.ok()) {
    throw new Error(
      `Создание работы через API не удалось (${response.status()}): ${await response.text()}`
    );
  }

  const body = (await response.json()) as { pk: string };
  return body.pk;
};

interface RcVisit {
  pk: string;
  start: string;
  stop: string;
  actual: string;
}

interface RcPerson {
  pk: string;
  visits?: RcVisit[];
}

interface ReportCardData {
  pk: string;
  project_supervision?: { equipment?: string };
  personal_project?: RcPerson[];
}

const getReportCard = async (
  request: APIRequestContext,
  workPk: string
): Promise<ReportCardData> => {
  const response = await request.get(`${api.reportCard}${workPk}/?exclude=url_project`);
  if (!response.ok()) {
    throw new Error(
      `Получение табеля работы через API не удалось (${response.status()}): ${await response.text()}`
    );
  }
  return (await response.json()) as ReportCardData;
};

export interface WorkCompositionInfo {
  personCount: number;
  visitCount: number;
}

/**
 * Возвращает количество заявленного персонала и визитов работы по данным табеля.
 */
export const getWorkCompositionInfo = async (
  request: APIRequestContext,
  workPk: string
): Promise<WorkCompositionInfo> => {
  const reportCard = await getReportCard(request, workPk);
  const persons = reportCard.personal_project ?? [];
  return {
    personCount: persons.length,
    visitCount: persons.reduce((total, person) => total + (person.visits ?? []).length, 0),
  };
};

/**
 * Проверяет, что все визиты работы переведены в статус «На согласовании»
 * (т.е. заявка на командировку успешно подана).
 */
export const areVisitsApproved = async (
  request: APIRequestContext,
  workPk: string
): Promise<boolean> => {
  const reportCard = await getReportCard(request, workPk);
  const persons = reportCard.personal_project ?? [];
  if (persons.length === 0 || persons.some((p) => (p.visits ?? []).length === 0)) {
    return false;
  }
  return persons.every((p) => (p.visits ?? []).every((v) => v.actual === 'На согласовании'));
};

/**
 * Подаёт заявку на командировку (перевод визитов в «На согласовании») через API,
 * повторяя payload, который шлёт модал «Отправить на согласование» в /api/project/opt2/.
 */
export const approveVisitsViaApi = async (
  request: APIRequestContext,
  workPk: string
): Promise<void> => {
  const reportCard = await getReportCard(request, workPk);
  const personalProject = (reportCard.personal_project ?? []).map((person) => ({
    pk: person.pk,
    visits: (person.visits ?? []).map((visit) => ({
      pk: visit.pk,
      ticket: [],
      corp_taxi: '',
      apartments: '',
      additional_costs: '',
      unforeseen_purpose: '',
      pass_plant: '',
      daily: { [formatYmd(parseDmy(visit.start))]: { '1': '0' } },
      actual: 'Фактическое',
      start: visit.start,
      stop: visit.stop,
    })),
  }));

  const response = await request.patch(`${api.projectOpt2}${workPk}/`, {
    data: {
      pk: workPk,
      project_supervision: {
        equipment: reportCard.project_supervision?.equipment || 'Супервайзинг',
      },
      personal_project: personalProject,
    },
  });

  if (!response.ok()) {
    throw new Error(
      `Подача заявки на командировку через API не удалась (${response.status()}): ${await response.text()}`
    );
  }
};
