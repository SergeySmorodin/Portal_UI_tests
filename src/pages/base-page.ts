import { Page, Locator, expect } from '@playwright/test';
import { config } from '../config/config';

export const createBasePage = (page: Page) => {
  const timeout = config.timeouts.normal;

  return {
    page,

    navigate: async (url: string): Promise<void> => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
    },

    openRelative: async (path: string): Promise<void> => {
      await page.goto(`${config.siteUrl}${path}`, { waitUntil: 'domcontentloaded' });
    },

    click: async (locator: Locator): Promise<void> => {
      await expect(locator).toBeVisible({ timeout });
      await locator.click();
    },

    fill: async (locator: Locator, text: string): Promise<void> => {
      await expect(locator).toBeVisible({ timeout });
      await locator.fill(text);
    },

    expectVisible: async (locator: Locator): Promise<void> => {
      await locator.waitFor({ state: 'visible', timeout });
    },

    waitForElement: async (locator: Locator, t: number = timeout): Promise<void> => {
      await locator.waitFor({ state: 'visible', timeout: t });
    },

    isElementPresent: async (locator: Locator): Promise<boolean> => {
      try {
        return await locator.isVisible();
      } catch {
        return false;
      }
    },

    selectRandomOption: async (locator: Locator): Promise<string> => {
      const options = locator.locator('option');
      const count = await options.count();
      const values: string[] = [];
      for (let i = 0; i < count; i++) {
        const val = await options.nth(i).getAttribute('value');
        if (val) values.push(val);
      }
      const randomIndex = Math.floor(Math.random() * values.length);
      const selected = values[randomIndex];
      await locator.selectOption(selected);
      return selected;
    },

    selectRandomFromList: async (
      container: Locator,
      itemSelector: string = 'button'
    ): Promise<string> => {
      await container.waitFor({ state: 'visible', timeout });
      const items = container.locator(itemSelector);
      const count = await items.count();
      const randomIndex = Math.floor(Math.random() * count);
      const selectedText = (await items.nth(randomIndex).textContent())?.trim() || '';
      await items.nth(randomIndex).click();
      return selectedText;
    },

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
