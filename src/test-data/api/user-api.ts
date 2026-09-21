import { APIRequestContext } from '@playwright/test';
import { UserCredentials } from '../../types';
import { api } from './api-handles';

export interface CreatedApiUser extends UserCredentials {
  uuid: string;
}

/**
 * Создаёт нового пользователя через API /api/auth/users/.
 * Возвращает uuid и учётные данные созданного пользователя.
 */
export const createUserViaApi = async (
  request: APIRequestContext,
  user: UserCredentials
): Promise<CreatedApiUser> => {
  const response = await request.post(api.auth.add_user, {
    data: { username: user.username, password: user.password },
  });

  if (!response.ok()) {
    throw new Error(
      `Создание пользователя через API не удалось (${response.status()}): ${await response.text()}`
    );
  }

  const body = (await response.json()) as { uuid?: string };
  return { uuid: body.uuid ?? '', username: user.username, password: user.password };
};

/** Удаляет пользователя через API /api/auth/users/<uuid>/ (не роняет тест при ошибке). */
export const deleteUserViaApi = async (request: APIRequestContext, uuid: string): Promise<void> => {
  if (!uuid) return;
  try {
    await request.delete(`${api.auth.add_user}${uuid}/`);
  } catch {
    // очистка не критична для результата теста
  }
};
