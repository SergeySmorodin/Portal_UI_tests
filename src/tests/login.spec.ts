import { test, expect } from '../fixtures/test-fixtures';
import { createUser, userFactory } from '../data/test-data';

test.describe('Авторизация', () => {
  test.describe('Позитивные сценарии', () => {
    test('Отображение формы логина', async ({ loginPage }) => {
      await loginPage.open();

      await expect(loginPage.locators.usernameInput).toBeVisible();
      await expect(loginPage.locators.passwordInput).toBeVisible();
      await expect(loginPage.locators.loginButton).toBeVisible();
    });

    test('Успешная авторизация', async ({ loginPage, page }) => {
      await loginPage.open();
      await loginPage.login(userFactory.admin());

      expect(await loginPage.isLoginSuccessful()).toBeTruthy();
      await expect(loginPage.locators.lkLink).toBeVisible();
      expect(page.url()).not.toContain('login');
    });
  });

  test.describe('Негативные сценарии', () => {
    test('Вход с неверным паролем', async ({ loginPage, page }) => {
      await loginPage.open();

      await loginPage.login(userFactory.withWrongPassword());

      await page.waitForLoadState('networkidle');

      const errorText = await loginPage.getErrorMessage();

      if (errorText) {
        console.log(`Сообщение об ошибке: ${errorText}`);
        await test.info().attach('error-message', {
          body: errorText,
          contentType: 'text/plain',
        });
      } else {
        expect(await loginPage.isLoginSuccessful()).toBeFalsy();
      }
    });

    test('Вход несуществующего пользователя', async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login(createUser());

      expect(await loginPage.isLoginSuccessful()).toBeFalsy();
    });

    test('Вход с пустыми полями', async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.locators.loginButton.click();

      expect(await loginPage.isLoginSuccessful()).toBeFalsy();
    });
  });
});
