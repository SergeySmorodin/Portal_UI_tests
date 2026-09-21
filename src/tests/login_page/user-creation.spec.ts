import { createLoginPage } from '../../pages/login/login-page';
import { expect, test } from '../../fixtures/test-fixtures';

// FIXME баг сайта: POST /api/auth/users/ стабильно отвечает 400 «Невозможно создать учетную запись.»
// (серверная ошибка на стороне API), поэтому фикстура createdUser не может создать пользователя,
// а вход под новым пользователем нельзя проверить.
test.describe('Создание пользователя через API', () => {
  test.fixme(
    'Созданный через API пользователь может авторизоваться',
    { tag: '@smoke' },
    async ({ browser, createdUser }) => {
      test.info().annotations.push({
        type: 'skip reason',
        description: 'Не реализовано на стороне бэкенда',
      });

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
