import { Page } from '@playwright/test';
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
    lkLink: page.getByRole('link', { name: 'Личный кабинет' }),
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
      await page.waitForLoadState('networkidle');
    },

    // Проверки
    isLoginSuccessful: async (): Promise<boolean> => {
      try {
        await page.waitForURL((url) => !url.pathname.includes(PAGE_PATH), {
          timeout: 5000,
        });
        return true;
      } catch {
        return false;
      }
    },

    hasLkLink: async (): Promise<boolean> => {
      await page.waitForTimeout(1000);
      return await locators.lkLink.isVisible();
    },
  };
};

export type LoginPage = ReturnType<typeof createLoginPage>;
