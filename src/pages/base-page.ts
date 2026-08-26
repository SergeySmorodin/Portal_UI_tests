import { Page, Locator, expect } from '@playwright/test';
import { config } from '../config/config';
import { testHelpers } from '../utils/helpers';

export const createBasePage = (page: Page) => {
  const timeout = config.timeouts.normal;

  return {
    page,

    navigate: async (url: string): Promise<void> => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
    },

    openRelative: async (path: string): Promise<void> => {
      await testHelpers.openPage(page, config.siteUrl, path);
    },

    click: async (locator: Locator): Promise<void> => {
      await testHelpers.clickWhenVisible(locator, timeout);
    },

    fill: async (locator: Locator, text: string): Promise<void> => {
      await testHelpers.fillField(locator, text, timeout);
    },

    expectVisible: async (locator: Locator): Promise<void> => {
      await testHelpers.waitForElement(locator, timeout);
    },

    getErrorMessage: async (): Promise<string> => {
      const errorLocator = page.locator('.error-message, .alert-danger').first();
      return testHelpers.getText(errorLocator);
    },

    takeScreenshot: async (name: string): Promise<string> => {
      return testHelpers.createScreenshot(page, name);
    },
  };
};

export type BasePage = ReturnType<typeof createBasePage>;
