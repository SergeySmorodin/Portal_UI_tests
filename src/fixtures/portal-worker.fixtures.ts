import { APIRequestContext, Page } from '@playwright/test';
import { userFactory } from '../test-data/factory/user-factory';
import { assignPortalPosition, SUPERVISION_POSITION_PK } from '../test-data/api/admin-user-api';
import { createUserViaApi, deleteUserViaApi } from '../test-data/api/user-api';
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
  djangoAdminPage: Page;
}

/**
 * Создаёт сотрудника, которого портал показывает в «Доступном персонале»
 * карточки работы (`GET /api/project/opt1/<pk>/` -> `available_user`):
 *
 * 1. `POST /api/auth/users/` — учётная запись;
 * 2. `PATCH /api/users/profile/<uuid>/` — ФИО и почта (без ФИО имя в списке
 *    пустое, без почты сотрудник не проходит отбор кандидатов);
 * 3. форма Django Admin — должность с потоком `Супервайзинг`
 *    (`SUPERVISION_POSITION_PK`) и вид занятости `worker`: кандидатами
 *    считаются только пользователи с `kind` `worker`/`itr`, без вида занятости
 *    в список не попадают.
 */
const createPortalWorker =
  ({ request, apiRequest, djangoAdminPage }: PortalWorkerArgs) =>
  async ({ lastName, firstName, patronymic }: PortalWorkerName): Promise<CreatedPortalWorker> => {
    const user = await createUserViaApi(request, userFactory.regular());

    try {
      const patch = await apiRequest.patch(`/api/users/profile/${user.uuid}/`, {
        data: {
          last_name: lastName,
          first_name: firstName,
          patronymic,
          email: `${user.username}@example.com`,
        },
      });
      if (!patch.ok()) {
        throw new Error(`Заполнение профиля не удалось (${patch.status()}): ${await patch.text()}`);
      }

      await assignPortalPosition(
        djangoAdminPage.context().request,
        djangoAdminPage,
        user.uuid,
        user.snils,
        SUPERVISION_POSITION_PK
      );

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
  { request, apiRequest, djangoAdminPage },
  use
) => {
  const cleanup = createUserCleanup(apiRequest);
  const createWorker = createPortalWorker({ request, apiRequest, djangoAdminPage });

  await use(async (name) => {
    const worker = await createWorker(name);
    // Браузерного контекста у сотрудника нет — только uuid для очистки.
    cleanup.track(worker.uuid);
    return worker;
  });

  await cleanup.run();
};
