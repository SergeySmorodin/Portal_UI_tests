import { Page, Locator } from '@playwright/test';

export const testHelpers = {
  waitForElement: async (locator: Locator, timeout: number = 10000): Promise<void> => {
    await locator.waitFor({ state: 'visible', timeout });
  },

  getText: async (locator: Locator): Promise<string> => {
    if (await locator.isVisible()) {
      return (await locator.textContent())?.trim() || '';
    }
    return '';
  },

  isElementPresent: async (locator: Locator): Promise<boolean> => {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  },

  createScreenshot: async (page: Page, name: string): Promise<string> => {
    const path = `screenshots/${name}-${Date.now()}.png`;
    await page.screenshot({ path, fullPage: true });
    return path;
  },
};
