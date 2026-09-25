import { createLkPage } from '../../pages/profile/lk-page';
import { expect, test } from '../../fixtures/test-fixtures';

test.describe('Мультипользовательский сценарий', () => {
  test(
    'Два пользователя могут одновременно авторизоваться',
    { tag: '@smoke' },
    async ({ createUserPage }) => {
      const author = await createUserPage();
      const approver = await createUserPage();

      await test.step('Проверить, что пользователи различаются', async () => {
        expect(author.user.username).not.toBe(approver.user.username);
      });

      await test.step('Открыть личный кабинет каждого пользователя', async () => {
        const authorLk = createLkPage(author.page);
        const approverLk = createLkPage(approver.page);

        await authorLk.open();
        await approverLk.open();

        await expect(authorLk.locators.userNameHeading).toBeVisible();
        await expect(approverLk.locators.userNameHeading).toBeVisible();
      });
    }
  );
});
