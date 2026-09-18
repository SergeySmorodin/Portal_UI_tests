import { Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createWorkingToolsLocators } from '../../../locators/working-tools.locators';
import { config } from '../../../config';

export const createWorkingToolsPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/services/supervision/working-tools';

  const locators = createWorkingToolsLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.projectSearchInput);
    },

    searchProject: async (code: string): Promise<void> => {
      await locators.projectSearchInput.fill(code);
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    openProject: async (code: string): Promise<void> => {
      await basePage.waitForElement(locators.projectButton(code), config.timeouts.long);
      await locators.projectButton(code).click();
      await page.waitForURL((url) => url.pathname.includes(`${PAGE_PATH}/works`), {
        timeout: config.timeouts.long,
      });
      await locators.workSearchInput.waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    findWork: async (name: string): Promise<void> => {
      await locators.workSearchInput.fill(name);
      await page.waitForLoadState('networkidle').catch(() => {});
      await basePage.waitForElement(locators.workRow(name), config.timeouts.long);
    },

    openReportCard: async (name: string): Promise<void> => {
      await basePage.waitForElement(locators.reportCardButton(name), config.timeouts.long);
      await locators.reportCardButton(name).click();
      await page.waitForURL((url) => url.pathname.includes('/reportcard'), {
        timeout: config.timeouts.long,
      });
    },
  };
};

export type WorkingToolsPage = ReturnType<typeof createWorkingToolsPage>;
