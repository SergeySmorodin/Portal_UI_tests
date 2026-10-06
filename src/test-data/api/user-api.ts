import { APIRequestContext } from '@playwright/test';
import { config } from '../../config';
import { UserRegistrationData } from '../../types';
import { api, profileGroupsEndpoint } from './api-handles';

export interface CreatedApiUser extends UserRegistrationData {
  uuid: string;
}

/**
 * Группы портала: назначаются сотруднику через POST /api/users/profile/<uuid>/groups/
 * (см. addUserToGroups). Группы задаются именем, а не pk админки.
 */
export const PORTAL_GROUPS = [
  'skip_employee',
  'tdo_employee',
  'certification_employee',
  'head_of_service',
  'origin_service_director',
  'ot_pb_employee',
  'personal_manager',
  'skr_employee',
  'skr_leader',
  'skr_privileged_employee',
  'supervising_employee',
  'supervising_leader',
  'supervising_privileged_employee',
  'uukr_employee',
  'uukr_leader',
  'uukr_privileged_employee',
  'vp_employee',
  'vp_leader',
  'vp_privileged_employee',
  'welding_chief',
  'zam_service_director',
] as const;

export type PortalGroup = (typeof PORTAL_GROUPS)[number];

export interface AddUserToGroupsOptions {
  /** Заменить текущие группы пользователя вместо добавления к ним. */
  replace?: boolean;
}

/**
 * Добавляет сотрудника в группы через API /api/users/profile/<uuid>/groups/.
 * По умолчанию группы добавляются к уже имеющимся (replace=false).
 */
export const addUserToGroups = async (
  request: APIRequestContext,
  uuid: string,
  groups: readonly PortalGroup[],
  options: AddUserToGroupsOptions = {}
): Promise<void> => {
  const response = await request.post(profileGroupsEndpoint(uuid), {
    data: { groups, replace: options.replace ?? false },
  });

  if (!response.ok()) {
    throw new Error(
      `Добавление в группы не удалось (${response.status()}): ${await response.text()}`
    );
  }
};

/**
 * Создаёт нового пользователя через API /api/auth/users/.
 * Возвращает uuid и учётные данные созданного пользователя.
 */
export const createUserViaApi = async (
  request: APIRequestContext,
  user: UserRegistrationData
): Promise<CreatedApiUser> => {
  const response = await request.post(api.auth.add_user, {
    data: { username: user.username, password: user.password, snils: user.snils },
  });

  if (!response.ok()) {
    throw new Error(
      `Создание пользователя через API не удалось (${response.status()}): ${await response.text()}`
    );
  }

  const body = (await response.json()) as { uuid?: string };
  return { uuid: body.uuid ?? '', ...user };
};

/** Удаляет пользователя через API /api/auth/users/<uuid>. */
export const deleteUserViaApi = async (request: APIRequestContext, uuid: string): Promise<void> => {
  if (!uuid) return;

  const response = await request.delete(`${api.auth.add_user}${uuid}`, {
    data: { current_password: config.password },
  });

  if (!response.ok()) {
    throw new Error(
      `Удаление пользователя через API не удалось (${response.status()}): ${await response.text()}`
    );
  }
};
