import { createLkPage } from '../../pages/profile/lk-page';
import { expect, test } from '../../fixtures/test-fixtures';

// FIXME баг сайта: POST /api/auth/users/ отвечает 400 «Невозможно создать учетную запись.»,
// поэтому создание новых пользователей для мультипользовательского сценария не проходит.
test.describe('Мультипользовательский сценарий', () => {
  test('Согласование двумя пользователями', { tag: '@smoke' }, async ({ createUserPage }) => {
    const author = await createUserPage();
    const approver = await createUserPage();

    await test.step('Проверить, что созданные пользователи разные и авторизованы', async () => {
      expect(author.user.username).not.toBe(approver.user.username);

      const authorLk = createLkPage(author.page);
      const approverLk = createLkPage(approver.page);

      await authorLk.open();
      await approverLk.open();

      await expect(authorLk.locators.userNameHeading).toBeVisible();
      await expect(approverLk.locators.userNameHeading).toBeVisible();
    });
  });
});
