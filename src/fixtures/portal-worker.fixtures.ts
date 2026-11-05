import { APIRequestContext, BrowserContext, Page } from '@playwright/test';
import { userFactory } from '../test-data/factory/user-factory';
import {
  createUserViaApi,
  nextPersonalNumber,
  SUPERVISION_POSITION_PK,
  type PortalGroup,
} from '../test-data/api/user-api';
import { createUserCleanup } from './user-kit';
import { createLoginPage } from '../pages/login/login-page';

/** ФИО создаваемого сотрудника (полное имя = «Фамилия Имя Отчество»). */
export interface PortalWorkerName {
  lastName: string;
  firstName: string;
  patronymic: string;
}

/** Созданный через API сотрудник, добавляемый в «Доступный персонал». */
export interface CreatedPortalWorker {
  uuid: string;
  username: string;
  password: string;
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
 * `POST /api/auth/users/` — учётная запись вместе с должностью с потоком
 * `Супервайзинг` (`SUPERVISION_POSITION_PK`) и ФИО/почтой (без ФИО имя в
 * списке пустое, без почты сотрудник не проходит отбор кандидатов).
 */
const createPortalWorker =
  ({ request }: PortalWorkerArgs) =>
  async ({ lastName, firstName, patronymic }: PortalWorkerName): Promise<CreatedPortalWorker> => {
    const user = userFactory.regular();

    const created = await createUserViaApi(request, user, {
      position: SUPERVISION_POSITION_PK,
      ratePay: '1.00',
      personalNumber: nextPersonalNumber(),
      groups: ['supervising_employee'],
      kind: 'worker',
      profile: {
        lastName,
        firstName,
        patronymic,
        email: `${user.username}@example.com`,
      },
    });

    return {
      uuid: created.uuid,
      username: user.username,
      password: user.password,
      fullName: `${lastName} ${firstName} ${patronymic}`,
    };
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

/** Создает согласующего с нужной группой (head, skip, td, leader, privileged). */
export interface ApproverName {
  lastName: string;
  firstName: string;
  patronymic: string;
  group: PortalGroup;
}

export interface CreatedApprover {
  uuid: string;
  username: string;
  password: string;
  fullName: string;
  page: Page;
  context: BrowserContext;
}

export type CreateApprover = (name: ApproverName) => Promise<CreatedApprover>;

export interface ApproversNames {
  privileged?: PortalWorkerName;
  leader?: PortalWorkerName;
  head?: PortalWorkerName;
  skip?: PortalWorkerName;
  td?: PortalWorkerName;
}

export type CreatedApprovers = {
  privileged: CreatedApprover;
  leader: CreatedApprover;
  head: CreatedApprover;
  skip: CreatedApprover;
  td: CreatedApprover;
};

export type CreateApprovers = (names?: ApproversNames) => Promise<CreatedApprovers>;

interface CreateApproverArgs {
  request: APIRequestContext;
  browser: any;
}

const createApprover =
  ({ request, browser }: CreateApproverArgs) =>
  async ({ lastName, firstName, patronymic, group }: ApproverName): Promise<CreatedApprover> => {
    const user = userFactory.regular();

    const created = await createUserViaApi(request, user, {
      position: SUPERVISION_POSITION_PK,
      ratePay: '1.00',
      personalNumber: nextPersonalNumber(),
      groups: [group],
      profile: {
        lastName,
        firstName,
        patronymic,
        email: `${user.username}@example.com`,
      },
    });

    // Создаем контекст и страницу для авторизации
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = createLoginPage(page);
    await loginPage.open();
    await loginPage.login({ username: user.username, password: user.password });
    await loginPage.waitForLoginSuccess();

    return {
      uuid: created.uuid,
      username: user.username,
      password: user.password,
      fullName: `${lastName} ${firstName} ${patronymic}`,
      page,
      context,
    };
  };

type CreateApproverFixture = (
  args: CreateApproverArgs,
  use: (createApprover: CreateApprover) => Promise<void>
) => Promise<void>;

export const createApproverFixture: CreateApproverFixture = async ({ request, browser }, use) => {
  const cleanup = createUserCleanup(request);
  const contexts: BrowserContext[] = [];

  await use(async (name) => {
    const approver = await createApprover({ request, browser })(name);
    cleanup.track(approver.uuid);
    contexts.push(approver.context);
    return approver;
  });

  await cleanup.run();
  await Promise.all(contexts.map((ctx) => ctx.close()));
};

/** Фикстура-фабрика согласующих для супервайзинга (privileged, leader, head, skip, td). */
export const createApproversFixture = async (
  { createApprover }: { createApprover: CreateApprover },
  use: (createApprovers: CreateApprovers) => Promise<void>
) => {
  const createApprovers: CreateApprovers = async (names = {}) => {
    const n = names ?? {};
    const privileged = await createApprover({
      lastName: n.privileged?.lastName ?? 'Привилегированный',
      firstName: n.privileged?.firstName ?? 'Сотрудник',
      patronymic: n.privileged?.patronymic ?? 'Супервайзинга',
      group: 'supervising_privileged_employee',
    });
    const leader = await createApprover({
      lastName: n.leader?.lastName ?? 'Руководитель',
      firstName: n.leader?.firstName ?? 'Подразделения',
      patronymic: n.leader?.patronymic ?? 'Супервайзинга',
      group: 'supervising_leader',
    });
    const head = await createApprover({
      lastName: n.head?.lastName ?? 'Руководитель',
      firstName: n.head?.firstName ?? 'Всех',
      patronymic: n.head?.patronymic ?? 'Сервисов',
      group: 'head_of_service',
    });
    const skip = await createApprover({
      lastName: n.skip?.lastName ?? 'Сотрудник',
      firstName: n.skip?.firstName ?? 'Отдела',
      patronymic: n.skip?.patronymic ?? 'Планирования',
      group: 'skip_employee',
    });
    const td = await createApprover({
      lastName: n.td?.lastName ?? 'Технический',
      firstName: n.td?.firstName ?? 'Директор',
      patronymic: n.td?.patronymic ?? 'Производства',
      group: 'origin_service_director',
    });
    return { privileged, leader, head, skip, td };
  };
  await use(createApprovers);
};
