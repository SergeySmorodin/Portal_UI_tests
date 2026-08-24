import { Page, expect, test } from '@playwright/test';
import { createBasePage } from './base-page';
import { config } from '../config/config';
import { UserCredentials } from '../types';

export const createLoginPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/login';

  // Локаторы
  const locators = {
    usernameInput: page.locator('#username'),
    passwordInput: page.locator('#pass'),
    loginButton: page.getByRole('button', { name: 'Вход' }),
    lkLink: page.getByRole('link', { name: 'Профиль сотрудника' }),
    errorMessage: page
      .locator('.error-message, .alert-danger, .alert-error, [class*="error"]')
      .first(),
  };

  // Вспомогательные функции
  const isOnLoginPage = (): boolean => {
    return page.url().includes(PAGE_PATH);
  };

  const getErrorMessage = async (): Promise<string> => {
    // Ждем появления ошибки
    try {
      await locators.errorMessage.waitFor({
        state: 'visible',
        timeout: 5000,
      });
      return (await locators.errorMessage.textContent())?.trim() || '';
    } catch {
      // Если стандартный локатор не нашел, пробуем найти любой текст с ошибкой
      const bodyText = (await page.locator('body').textContent()) || '';

      // Поиск по ключевым словам
      const errorPatterns = [
        'неверн',
        'ошибк',
        'error',
        'неправильн',
        'invalid',
        'не найден',
        'not found',
        'incorrect',
        'wrong',
        'неверный логин или пароль',
      ];

      for (const pattern of errorPatterns) {
        if (bodyText.toLowerCase().includes(pattern.toLowerCase())) {
          // Ищем элемент с этим текстом
          const errorElement = page.getByText(pattern, { exact: false }).first();
          if (await errorElement.isVisible()) {
            return (await errorElement.textContent())?.trim() || '';
          }
        }
      }

      return '';
    }
  };

  const waitForLoginSuccess = async (): Promise<void> => {
    await page.waitForURL((url) => !url.pathname.includes(PAGE_PATH), {
      timeout: 5000,
    });
  };

  const verifySuccessfulLogin = async (): Promise<void> => {
    await waitForLoginSuccess();
    expect(isOnLoginPage()).toBeFalsy();
    await expect(locators.lkLink).toBeVisible();
  };

  const verifyLoginError = async (expectedErrorText?: string): Promise<string> => {
    expect(isOnLoginPage()).toBeTruthy();

    const errorText = await getErrorMessage();

    await test.info().attach('error-message', {
      body: errorText || 'Сообщение об ошибке не найдено',
      contentType: 'text/plain',
    });

    if (expectedErrorText) {
      expect(errorText).toContain(expectedErrorText);
    }

    return errorText;
  };

  return {
    ...basePage,
    locators,

    // Открытие страницы
    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.usernameInput);
    },

    // Авторизация
    login: async (credentials?: UserCredentials): Promise<void> => {
      const userCredentials = credentials || {
        username: config.login,
        password: config.password,
      };

      await locators.usernameInput.fill(userCredentials.username);
      await locators.passwordInput.fill(userCredentials.password);
      await locators.loginButton.click();

      // Ждем завершения навигации
      await page.waitForLoadState('domcontentloaded');
    },

    // Публичные методы
    isOnLoginPage,
    getErrorMessage,
    waitForLoginSuccess,
    verifySuccessfulLogin,
    verifyLoginError,
  };
};

export type LoginPage = ReturnType<typeof createLoginPage>;
