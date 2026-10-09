import { APIRequestContext } from '@playwright/test';
import { userFactory } from '../test-data/factory/user-factory';
import {
  createUserViaApi,
  deleteUserViaApi,
  nextPersonalNumber,
  updateUserProfile,
  SUPERVISION_POSITION_PK,
} from '../test-data/api/user-api';
import { createUserCleanup } from './user-kit';

/** ФИО создаваемого сотрудника (полное имя = «Фамилия Имя Отчество»). */
export interface PortalWorkerName {
  lastName: string;
  firstName: string;
  patronymic: string;
}

/** Созданный через API сотрудник, добавляемый в «Доступный персонал». */
export interface CreatedPortalWorker {
  uuid: string;
  /** Полное имя в том виде, в котором его показывает портал. */
  fullName: string;
}

export type CreatePortalWorker = (name: PortalWorkerName) => Promise<CreatedPortalWorker>;

interface PortalWorkerArgs {
  request: APIRequestContext;
  apiRequest: APIRequestContext;
}

/**
 * Создаёт сотрудника, которого портал показывает в «Доступном персонале»
 * карточки работы (`GET /api/project/opt1/<pk>/` -> `available_user`):
 *
 * 1. `POST /api/auth/users/` — учётная запись вместе с должностью с потоком
 *    `Супервайзинг` (`SUPERVISION_POSITION_PK`);
 * 2. `PATCH /api/users/profile/<uuid>/` — ФИО и почта (без ФИО имя в списке
 *    пустое, без почты сотрудник не проходит отбор кандидатов).
 */
const createPortalWorker =
  ({ request, apiRequest }: PortalWorkerArgs) =>
  async ({ lastName, firstName, patronymic }: PortalWorkerName): Promise<CreatedPortalWorker> => {
    const user = await createUserViaApi(request, userFactory.regular(), {
      position: SUPERVISION_POSITION_PK,
      ratePay: '1.00',
      personalNumber: nextPersonalNumber(),
    });

    try {
      await updateUserProfile(apiRequest, user.uuid, {
        lastName,
        firstName,
        patronymic,
        email: `${user.username}@example.com`,
      });

      return { uuid: user.uuid, fullName: `${lastName} ${firstName} ${patronymic}` };
    } catch (error) {
      await deleteUserViaApi(apiRequest, user.uuid).catch(() => {});
      throw error;
    }
  };

type CreatePortalWorkerFixture = (
  args: PortalWorkerArgs,
  use: (createWorker: CreatePortalWorker) => Promise<void>
) => Promise<void>;

/**
 * Фикстура-фабрика: создаёт сотрудников для «Доступного персонала» и удаляет
 * их по окончании теста. Первый аргумент — только destructuring:
 * Playwright определяет зависимости фикстуры по именам параметров.
 */
export const createPortalWorkerFixture: CreatePortalWorkerFixture = async (
  { request, apiRequest },
  use
) => {
  const cleanup = createUserCleanup(apiRequest);
  const createWorker = createPortalWorker({ request, apiRequest });

  await use(async (name) => {
    const worker = await createWorker(name);
    // Браузерного контекста у сотрудника нет — только uuid для очистки.
    cleanup.track(worker.uuid);
    return worker;
  });

  await cleanup.run();
};
