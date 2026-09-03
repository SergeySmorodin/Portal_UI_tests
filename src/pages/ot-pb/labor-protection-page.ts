import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createLaborProtectionLocators } from '../../locators/labor-protection.locators';
import { config } from '../../config/config';

export const createLaborProtectionPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/OT_PB/LaborProtection';

  const locators = createLaborProtectionLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectCategory: async (label: string): Promise<void> => {
      const checkbox = locators.categoryCheckbox(label);
      await basePage.waitForElement(checkbox);
      await checkbox.click();
    },

    toggleShowAllEmployees: async (): Promise<void> => {
      await basePage.waitForElement(locators.showAllEmployeesToggle);
      await locators.showAllEmployeesToggle.click();
    },

    clickShow: async (): Promise<void> => {
      await locators.showButton.click();
    },

    clickReset: async (): Promise<void> => {
      await locators.resetButton.click();
    },

    isResultsVisible: async (): Promise<boolean> => {
      await locators.resultsHeading.waitFor({ state: 'visible', timeout: config.timeouts.long });
      return true;
    },

    getEmployeeRowsCount: async (): Promise<number> => {
      await locators.employeeRows.first().waitFor({ state: 'visible', timeout: config.timeouts.long });
      return locators.employeeRows.count();
    },
  };
};

export type LaborProtectionPage = ReturnType<typeof createLaborProtectionPage>;
