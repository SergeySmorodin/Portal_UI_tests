import { Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createTimeTableLocators } from '../../../locators/time-table.locators';
import { createReportCardPage } from './report-card-page';
import { config } from '../../../config';
import { api } from '../../../test-data/api/api-handles';

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

/**
 * Очередь согласования табелей для ролей «Отдел планирования» и
 * «Технический директор»: список работ, открытие табеля и согласование.
 */
export const createTimeTableApprovalPage = (page: Page, pagePath: string) => {
  const basePage = createBasePage(page);
  const locators = createTimeTableLocators(page);
  const reportCardPage = createReportCardPage(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(pagePath);
      await basePage.expectVisible(locators.heading);
    },

    expectWorkVisible: async (name: string): Promise<void> => {
      await locators.workButton(name).waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    openWork: async (name: string): Promise<void> => {
      await basePage.waitForElement(locators.workButton(name), config.timeouts.long);
      await locators.workButton(name).click();
      await reportCardPage.locators.approvalButton
        .first()
        .waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    approve: async (): Promise<void> => {
      await reportCardPage.openApproval();

      const decided = page.waitForResponse(
        (resp) =>
          resp.url().includes(api.reportCard) &&
          resp.request().method() === 'PATCH' &&
          resp.ok(),
        { timeout: config.timeouts.long }
      );

      await locators.approveDecisionButton.click();
      await decided;
      await locators.decisionModal.waitFor({ state: 'hidden', timeout: config.timeouts.long });
    },
  };
};

export type TimeTableApprovalPage = ReturnType<typeof createTimeTableApprovalPage>;
