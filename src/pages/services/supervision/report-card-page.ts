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

    createPeriods: async (): Promise<void> => {
      await locators.createButton.click();
      await locators.createConfirmButton.click();
    },

    openRateRows: async (): Promise<void> => {
      await locators.rateRowsButton.click();
    },

    getRateInputValue: async (name: string): Promise<string> => {
      return await locators.workerRateInput(name).inputValue();
    },

    fillRate: async (name: string, value: string): Promise<void> => {
      await locators.workerRateInput(name).fill(value);
    },

    fillWorkHours: async (name: string, dayIndexes: number[], value: string): Promise<void> => {
      for (const dayIndex of dayIndexes) {
        await locators.workerDayInput(name, dayIndex).fill(value);
      }
    },

    getHours: async (name: string): Promise<string> => {
      return (await locators.workerHoursCell(name).textContent())?.trim() || '';
    },

    getSum: async (name: string): Promise<string> => {
      return (await locators.workerSumCell(name).textContent())?.trim() || '';
    },

    save: async (): Promise<void> => {
      await locators.saveButton.click();
    },
  };
};

export type ReportCardPage = ReturnType<typeof createReportCardPage>;
