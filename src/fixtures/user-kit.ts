import { APIRequestContext, BrowserContext, Page } from '@playwright/test';
import { deleteUserViaApi, type CreatedApiUser } from '../test-data/api/user-api';

/** Пользователь, созданный через API /api/auth/users/ (uuid + учётные данные). */
export type CreatedUser = CreatedApiUser;

export interface UserContextKit {
  page: Page;
  context: BrowserContext;
  /** Данные созданного через API пользователя, под которым авторизована page. */
  user: CreatedUser;
}

/**
 * Реестр пользователей, созданных фикстурами, и их браузерных контекстов.
 *
 * Нужен, чтобы тестовые пользователи гарантированно удалялись из портала:
 * - если создание упало уже после `createUserViaApi` (например, не назначилась
 *   группа), пользователь всё равно создан и должен быть удалён сразу;
 * - ошибка при удалении одного пользователя не должна оставлять остальных.
 */
export const createUserCleanup = (request: APIRequestContext) => {
  const entries = new Map<string, BrowserContext | undefined>();
  const errors: string[] = [];

  return {
    /** `context` не обязателен: у сотрудников, созданных только для API, его нет. */
    track: (uuid: string, context?: BrowserContext): void => {
      entries.set(uuid, context);
    },

    /** Пользователь удалён сразу же, не дожидаясь конца теста. */
    discard: async (uuid: string): Promise<void> => {
      const context = entries.get(uuid);
      entries.delete(uuid);
      if (context) await context.close();
      try {
        await deleteUserViaApi(request, uuid);
      } catch (error) {
        errors.push(`не удалён сразу (${uuid}): ${(error as Error).message}`);
      }
    },

    run: async (): Promise<void> => {
      for (const [uuid, context] of entries) {
        if (context) await context.close();
        try {
          await deleteUserViaApi(request, uuid);
        } catch (error) {
          errors.push(`не удалён (${uuid}): ${(error as Error).message}`);
        }
      }
      entries.clear();

      if (errors.length > 0) {
        throw new Error(`Очистка тестовых пользователей не удалась: ${errors.join('; ')}`);
      }
    },
  };
};
