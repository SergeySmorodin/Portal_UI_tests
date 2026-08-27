import { test, expect } from '../../fixtures/test-fixtures';
import { createUser, userFactory } from '../../data/user-factory';

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

    test('Пароль скрыт на форме ввода', async ({ loginPage }) => {
      await test.step('Открыть страницу логина', async () => {
        await loginPage.open();
      });

      await test.step('Проверить, что поле пароля имеет тип password', async () => {
        await expect(loginPage.locators.passwordInput).toHaveAttribute('type', 'password');
      });
    });

    test('Вход с пустым логином и заполненным паролем', async ({ loginPage }) => {
      await test.step('Открыть страницу логина', async () => {
        await loginPage.open();
      });

      await test.step('Заполнить только пароль и нажать кнопку входа', async () => {
        await loginPage.login(userFactory.admin({ username: '' }));
      });

      await test.step('Проверить сообщение об ошибке', async () => {
        const errorText = await loginPage.verifyLoginError();
        expect(errorText).toBeTruthy();
      });
    });

    test('Вход с заполненным логином и пустым паролем', async ({ loginPage }) => {
      await test.step('Открыть страницу логина', async () => {
        await loginPage.open();
      });

      await test.step('Заполнить только логин и нажать кнопку входа', async () => {
        await loginPage.login(userFactory.admin({ password: '' }));
      });

      await test.step('Проверить сообщение об ошибке', async () => {
        const errorText = await loginPage.verifyLoginError();
        expect(errorText).toBeTruthy();
      });
    });

    for (const [name, credentials] of [
      ['SQL-инъекция', { username: "admin' OR '1'='1' --", password: "' OR '1'='1" }],
      [
        'XSS-строка',
        { username: '<script>alert(1)</script>', password: '<img src=x onerror=alert(1)>' },
      ],
    ] as const) {
      test(`Инъекция в поля авторизации: ${name}`, async ({ loginPage }) => {
        await test.step('Открыть страницу логина', async () => {
          await loginPage.open();
        });

        await test.step(`Ввести ${name.toLowerCase()} в поля логина`, async () => {
          await loginPage.login(createUser(credentials));
        });

        await test.step('Проверить, что авторизация не выполнена и приложение не сломалось', async () => {
          await loginPage.verifyLoginError();
          await expect(loginPage.locators.usernameInput).toBeVisible();
        });
      });
    }
  });
});
