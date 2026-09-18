import { Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createReportCardLocators } from '../../../locators/report-card.locators';
import { config } from '../../../config';

export const createReportCardPage = (page: Page) => {
  const basePage = createBasePage(page);
  const locators = createReportCardLocators(page);

  return {
    ...basePage,
    locators,

    getHeading: async (): Promise<string> => {
      return (await locators.heading.textContent())?.trim() || '';
    },

    waitForLoaded: async (workName: string): Promise<void> => {
      await locators
        .headingTab(workName)
        .waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    getWorkerNames: async (): Promise<string[]> => {
      const count = await locators.workerRows.count();
      const names: string[] = [];
      for (let i = 0; i < count; i++) {
        const text = (await locators.workerRows.nth(i).textContent())?.trim() || '';
        names.push(text);
      }
      return names;
    },

    getWorkerCount: async (): Promise<number> => {
      return await locators.workerRows.count();
    },

    expectWorkerVisible: async (name: string): Promise<void> => {
      await locators
        .workerRow(name)
        .first()
        .waitFor({ state: 'visible', timeout: config.timeouts.normal });
    },
  };
};

export type ReportCardPage = ReturnType<typeof createReportCardPage>;
