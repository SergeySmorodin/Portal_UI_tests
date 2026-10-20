import { APIRequestContext } from '@playwright/test';
import { config } from '../../config';
import { UserRegistrationData } from '../../types';
import { api } from './api-handles';

export interface CreatedApiUser extends UserRegistrationData {
  uuid: string;
}

/**
 * Группы портала: назначаются при создании пользователя полем `groups`
 * (POST /api/auth/users/). Группы задаются именем, а не pk админки.
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

export const SUPERVISION_POSITION_PK = '581';

/** Признаки того, что DRF-поле `position` не нашло pk должности в базе. */
const MISSING_POSITION_RE = /не существует|does not exist|invalid pk|неверный первичный ключ/i;

/**
 * Формирует понятный текст ошибки при создании пользователя. Отдельно
 * распознаёт отсутствие должности с указанным pk (частая причина — устаревший
 * SUPERVISION_POSITION_PK или старый бэкенд), чтобы не разбирать тело ответа.
 */
const describeCreateUserFailure = (
  status: number,
  options: CreateUserOptions,
  body: string
): string => {
  if (options.position && MISSING_POSITION_RE.test(body)) {
    return (
      `Должность с pk "${options.position}" не найдена в базе портала. ` +
      `Проверьте значение SUPERVISION_POSITION_PK в src/test-data/api/user-api.ts ` +
      `и актуальность бэкенда. Ответ API (${status}): ${body}`
    );
  }
  return `Создание пользователя через API не удалось (${status}): ${body}`;
};

/** ФИО и почта пользователя, сохраняемые сразу при создании. */
export interface UserProfileData {
  lastName: string;
  firstName: string;
  patronymic: string;
  email: string;
}

/** Дополнительные поля создания пользователя (одним запросом POST /api/auth/users/). */
export interface CreateUserOptions {
  /** pk должности. Уходит вложенным объектом position_user вместе со ставкой и табельным номером. */
  position?: string;
  /** Ставка по должности, например «1.00». */
  ratePay?: string;
  /** Табельный номер (уникален в пределах должности). */
  personalNumber?: string;
  /** Подразделение/сотрудник компании (uuid). */
  companyEmployee?: string;
  profile?: UserProfileData;
  /** Группы портала, назначаемые при создании. */
  groups?: readonly PortalGroup[];
  /** Заменить текущие группы, а не добавить к ним. */
  replace?: boolean;
}

/** Порталу нужен числовой pk должности: строковые pk из констант приводим к числу. */
const toPositionPk = (pk: string): number | string => (/^\d+$/.test(pk) ? Number(pk) : pk);

let personalNumberSeq = 0;

/**
 * Табельный номер должен быть уникален
 */
export const nextPersonalNumber = (): string => {
  personalNumberSeq += 1;
  return String((Date.now() + personalNumberSeq * 7919) % 1_000_000_000);
};

/**
 * Создаёт нового пользователя через API /api/auth/users/.
 * Должность и группы задаются сразу в запросе (CreateUserOptions).
 * Возвращает uuid и учётные данные созданного пользователя.
 */
export const createUserViaApi = async (
  request: APIRequestContext,
  user: UserRegistrationData,
  options: CreateUserOptions = {}
): Promise<CreatedApiUser> => {
  const data: Record<string, unknown> = {
    username: user.username,
    password: user.password,
  };

  if (options.profile) {
    data.first_name = options.profile.firstName;
    data.last_name = options.profile.lastName;
    data.patronymic = options.profile.patronymic;
    data.email = options.profile.email;
  }

  if (options.position) {
    const positionUser: Record<string, unknown> = {
      position: { pk: toPositionPk(options.position) },
    };
    if (options.ratePay) positionUser.rate_pay = options.ratePay;
    if (options.personalNumber) positionUser.personal_number = options.personalNumber;
    if (options.companyEmployee) positionUser.company_employee = options.companyEmployee;
    data.position_user = positionUser;
  }

  if (options.groups?.length) data.groups = options.groups;
  if (options.replace !== undefined) data.replace = options.replace;

  const response = await request.post(api.auth.add_user, { data });

  if (!response.ok()) {
    throw new Error(describeCreateUserFailure(response.status(), options, await response.text()));
  }

  const body = (await response.json()) as { uuid?: string };
  return { uuid: body.uuid ?? '', ...user };
};

/** Удаляет пользователя через API /api/auth/users/<uuid>. */
export const deleteUserViaApi = async (request: APIRequestContext, uuid: string): Promise<void> => {
  if (!uuid) return;

  const response = await request.delete(`${api.auth.add_user}${uuid}/`, {
    data: { current_password: config.password },
  });

  if (!response.ok()) {
    throw new Error(
      `Удаление пользователя через API не удалось (${response.status()}): ${await response.text()}`
    );
  }
};
