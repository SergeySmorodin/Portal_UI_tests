import { createLoginPage } from '../../pages/login/login-page';
import { expect, test } from '../../fixtures/test-fixtures';

test.describe('Создание пользователя через API', () => {
  test(
    'Созданный через API пользователь может авторизоваться',
    { tag: '@smoke' },
    async ({ browser, createdUser }) => {
      await test.step('Проверить, что пользователь создан через API /api/auth/users/', async () => {
        expect(createdUser.uuid).toBeTruthy();
        expect(createdUser.username).toBeTruthy();
      });

      await test.step('Войти под созданным пользователем в новом контексте', async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loginPage = createLoginPage(page);

        await loginPage.open();
        await loginPage.login({ username: createdUser.username, password: createdUser.password });
        await loginPage.verifySuccessfulLogin();

        await context.close();
      });
    }
  );
});
