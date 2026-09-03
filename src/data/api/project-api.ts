import { APIRequestContext } from '@playwright/test';
import { ProjectData, WorkData } from '../../types';
import { api } from './api';

export interface WorkCreateOptions {
  megaProjectPk: string;
  contractPk: string;
  status?: string;
  equipment?: string;
}

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


// TODO: добавлять визиты через апи, предварительно создать сотрудников через апи
