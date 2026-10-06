import { APIRequestContext, Browser, Page } from '@playwright/test';
import { createLoginPage } from '../pages/login/login-page';
import { userFactory } from '../test-data/factory/user-factory';
import { assignPortalPosition } from '../test-data/api/admin-user-api';
import { addUserToGroups, createUserViaApi, type PortalGroup } from '../test-data/api/user-api';
import { createUserCleanup, type UserContextKit } from './user-kit';

/** Аргументы фикстур, нужные для создания пользователя с ролью портала. */
interface RoleUserArgs {
  browser: Browser;
  request: APIRequestContext;
  apiRequest: APIRequestContext;
  djangoAdminPage: Page;
}

/**
 * Создаёт пользователя с группой портала и возвращает его авторизованную
 * page/context:
 * - группа назначается через API /api/users/profile/<uuid>/groups/;
 * - должность (опционально) — через форму Django Admin: она задаёт поток
 *   stream, без которого карточка работы недоступна.
 *
 * Должность назначается раньше группы, чтобы отправка формы админки
 * не затёрла группы, назначенные через API.
 */
const createRoleUser = async (
  args: RoleUserArgs,
  cleanup: ReturnType<typeof createUserCleanup>,
  group: PortalGroup,
  positionPk?: string
): Promise<UserContextKit> => {
  const user = await createUserViaApi(args.request, userFactory.regular());

  const context = await args.browser.newContext();
  cleanup.track(user.uuid, context);
  try {
    if (positionPk) {
      await assignPortalPosition(
        args.djangoAdminPage.context().request,
        args.djangoAdminPage,
        user.uuid,
        user.snils,
        positionPk
      );
    }

    await addUserToGroups(args.apiRequest, user.uuid, [group]);

    const page = await context.newPage();

    const loginPage = createLoginPage(page);
    await loginPage.open();
    await loginPage.login({ username: user.username, password: user.password });
    await loginPage.waitForLoginSuccess();

    return { page, context, user };
  } catch (error) {
    // Роль могла не назначиться, а пользователь в портале уже есть.
    await cleanup.discard(user.uuid);
    throw error;
  }
};

type RoleUserFixture = (
  args: RoleUserArgs,
  use: (kit: UserContextKit) => Promise<void>
) => Promise<void>;

// Playwright определяет зависимости фикстуры по именам destructuring-параметра,
// поэтому первый аргумент обязан быть объектным деструктурированием.
const roleUserFixture =
  (group: PortalGroup): RoleUserFixture =>
  async ({ browser, request, apiRequest, djangoAdminPage }, use) => {
    const cleanup = createUserCleanup(apiRequest);
    const kit = await createRoleUser(
      { browser, request, apiRequest, djangoAdminPage },
      cleanup,
      group
    );
    await use(kit);
    await cleanup.run();
  };

/**
 * Фикстуры пользователей всех групп портала: `skipEmployee`, `tdoEmployee`, …
 * Пользователь создаётся, авторизуется и удаляется только если фикстура
 * реально запрошена тестом.
 */
export const roleUserFixtures = {
  skipEmployee: roleUserFixture('skip_employee'),
  tdoEmployee: roleUserFixture('tdo_employee'),
  certificationEmployee: roleUserFixture('certification_employee'),
  headOfService: roleUserFixture('head_of_service'),
  originServiceDirector: roleUserFixture('origin_service_director'),
  otPbEmployee: roleUserFixture('ot_pb_employee'),
  personalManager: roleUserFixture('personal_manager'),
  skrEmployee: roleUserFixture('skr_employee'),
  skrLeader: roleUserFixture('skr_leader'),
  skrPrivilegedEmployee: roleUserFixture('skr_privileged_employee'),
  supervisingEmployee: roleUserFixture('supervising_employee'),
  supervisingLeader: roleUserFixture('supervising_leader'),
  supervisingPrivilegedEmployee: roleUserFixture('supervising_privileged_employee'),
  uukrEmployee: roleUserFixture('uukr_employee'),
  uukrLeader: roleUserFixture('uukr_leader'),
  uukrPrivilegedEmployee: roleUserFixture('uukr_privileged_employee'),
  vpEmployee: roleUserFixture('vp_employee'),
  vpLeader: roleUserFixture('vp_leader'),
  vpPrivilegedEmployee: roleUserFixture('vp_privileged_employee'),
  weldingChief: roleUserFixture('welding_chief'),
  zamServiceDirector: roleUserFixture('zam_service_director'),
};

/** Значения фикстур пользователей: каждая отдаёт авторизованного UserContextKit. */
export type RoleUserFixtures = { [K in keyof typeof roleUserFixtures]: UserContextKit };

/**
 * Фабрика ролевых пользователей: группа + должность. Нужна там, где одной
 * группы недостаточно — например, руководителю подачи заявки нужна должность
 * с потоком project_supervision (см. SUPERVISION_POSITION_PK).
 */
export type CreateRoleUserWithPosition = (
  group: PortalGroup,
  positionPk: string
) => Promise<UserContextKit>;

type CreateRoleUserWithPositionFixture = (
  args: RoleUserArgs,
  use: (createRoleUser: CreateRoleUserWithPosition) => Promise<void>
) => Promise<void>;

/**
 * Фикстура-фабрика: создаёт пользователей с любой группой портала и
 * должностью; удаляет их по окончании теста.
 * Первый аргумент — только destructuring, см. комментарий к roleUserFixture.
 */
export const createRoleUserWithPositionFixture: CreateRoleUserWithPositionFixture = async (
  { browser, request, apiRequest, djangoAdminPage },
  use
) => {
  const args = { browser, request, apiRequest, djangoAdminPage };
  const cleanup = createUserCleanup(apiRequest);
  await use((group, positionPk) => createRoleUser(args, cleanup, group, positionPk));
  await cleanup.run();
};
