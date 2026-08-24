import { test, expect } from '../fixtures/test-fixtures';
import { createUser, userFactory } from '../data/test-data';

test.describe('Авторизация', () => {
  test.describe('Позитивные сценарии', () => {
    test('Отображение формы логина', async ({ loginPage }) => {
      await test.step('Открыть страницу логина', async () => {
        await loginPage.open();
      });

      await test.step('Проверить отображение поля "Имя пользователя"', async () => {
        await expect(loginPage.locators.usernameInput).toBeVisible();
      });

      await test.step('Проверить отображение поля "Пароль"', async () => {
        await expect(loginPage.locators.passwordInput).toBeVisible();
      });

      await test.step('Проверить отображение кнопки "Войти"', async () => {
        await expect(loginPage.locators.loginButton).toBeVisible();
      });
    });

    test('Успешная авторизация', async ({ loginPage }) => {
      await test.step('Открыть страницу логина', async () => {
        await loginPage.open();
      });

      await test.step('Ввести данные администратора и нажать кнопку входа', async () => {
        await loginPage.login(userFactory.admin());
      });

      await test.step('Проверить успешную авторизацию', async () => {
        await loginPage.verifySuccessfulLogin();
      });
    });
  });

  test.describe('Негативные сценарии', () => {
    test('Вход с неверным паролем', async ({ loginPage }) => {
      await test.step('Открыть страницу логина', async () => {
        await loginPage.open();
      });

      await test.step('Ввести данные пользователя с неверным паролем', async () => {
        await loginPage.login(userFactory.withWrongPassword());
      });

      await test.step('Проверить сообщение об ошибке', async () => {
        const errorText = await loginPage.verifyLoginError();

        // Проверяем только наличие ошибки и кода 401
        expect(errorText).toBeTruthy();
        expect(errorText).toContain('401');
      });
    });

    test('Вход несуществующего пользователя', async ({ loginPage }) => {
      await test.step('Открыть страницу логина', async () => {
        await loginPage.open();
      });

      await test.step('Ввести данные несуществующего пользователя', async () => {
        await loginPage.login(createUser());
      });

      await test.step('Проверить сообщение об ошибке', async () => {
        const errorText = await loginPage.verifyLoginError();

        // Проверяем только наличие ошибки
        expect(errorText).toBeTruthy();
      });
    });

    test('Вход с пустыми полями', async ({ loginPage }) => {
      await test.step('Открыть страницу логина', async () => {
        await loginPage.open();
      });

      await test.step('Нажать кнопку входа без заполнения полей', async () => {
        await loginPage.locators.loginButton.click();
        await loginPage.page.waitForLoadState('domcontentloaded');
      });

      await test.step('Проверить сообщение об ошибке валидации', async () => {
        await loginPage.verifyLoginError();
      });
    });
  });
});
