import { Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createTimeTableLocators } from '../../../locators/time-table.locators';
import { config } from '../../../config';

export const createTimeTablePage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/services/supervision/time-table';

  const locators = createTimeTableLocators(page);

  const parseNumber = (text: string | null, pattern: RegExp = /(\d+)/): number => {
    const match = (text ?? '').match(pattern);
    return match ? Number(match[1]) : 0;
  };

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

    expectWorkVisible: async (name: string): Promise<void> => {
      await locators.workRow(name).waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    openApproval: async (name: string): Promise<void> => {
      await basePage.waitForElement(locators.workRow(name), config.timeouts.long);
      await locators.workButton(name).click();
      await page.waitForURL((url) => url.pathname.includes(`${PAGE_PATH}/approval/`), {
        timeout: config.timeouts.long,
      });
    },

    waitForApprovalLoaded: async (name: string): Promise<void> => {
      await locators.approvalHeading(name).waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
    },

    // Количество табелей в указанном состоянии (например, «На согласование»)
    getStateCount: async (label: string): Promise<number> => {
      return parseNumber(await locators.stateCount(label).textContent());
    },

    getStateTotal: async (): Promise<number> => {
      return parseNumber(await locators.approvalStateTotal.textContent(), /Всего:\s*(\d+)/);
    },
  };
};

export type TimeTablePage = ReturnType<typeof createTimeTablePage>;
