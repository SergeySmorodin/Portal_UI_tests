import { Page, Locator, expect } from '@playwright/test';
import { config } from '../config/config';

export const createBasePage = (page: Page) => {
  const timeout = config.timeout;

  return {
    page,

    // Навигация
    navigate: async (url: string): Promise<void> => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
    },

    openRelative: async (path: string): Promise<void> => {
      await page.goto(`${config.siteUrl}${path}`);
      await page.waitForLoadState('networkidle');
    },

    // Действия с элементами
    click: async (locator: Locator): Promise<void> => {
      await expect(locator).toBeVisible({ timeout });
      await locator.click();
    },

    fill: async (locator: Locator, text: string): Promise<void> => {
      await expect(locator).toBeVisible({ timeout });
      await locator.fill(text);
    },

    // Проверки
    expectVisible: async (locator: Locator): Promise<void> => {
      await expect(locator).toBeVisible({ timeout });
    },

    // Утилиты
    getErrorMessage: async (): Promise<string> => {
      const errorLocator = page.locator('.error-message, .alert-danger').first();
      if (await errorLocator.isVisible()) {
        return (await errorLocator.textContent())?.trim() || '';
      }
      return '';
    },

    takeScreenshot: async (name: string): Promise<string> => {
      const path = `screenshots/${name}-${Date.now()}.png`;
      await page.screenshot({ path, fullPage: true });
      return path;
    },
  };
};

export type BasePage = ReturnType<typeof createBasePage>;
