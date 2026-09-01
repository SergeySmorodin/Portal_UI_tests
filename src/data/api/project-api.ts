import { APIRequestContext } from '@playwright/test';
import { ProjectData } from '../../types';
import { api } from './api';

/**
 * Создаёт мегапроект через API /api/megaproject/ (вместо прохождения формы в UI).
 * Возвращает код созданного мегапроекта.
 */
export const createProjectViaApi = async (
  request: APIRequestContext,
  project: ProjectData
): Promise<string> => {
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

  return project.code;
};
