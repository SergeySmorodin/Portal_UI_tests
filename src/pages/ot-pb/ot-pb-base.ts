import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';
import { config } from '../../config/config';

export interface OtPbLocators {
  showAllEmployeesToggle: Locator;
  showButton: Locator;
  surnameSearchInput: Locator;
  surnameOptions: Locator;
  surnameCollapseButton: Locator;
  resultsHeading: Locator;
  employeeRows: Locator;
}

export const createOtPbBase = (page: Page, basePage: BasePage, locators: OtPbLocators) => {
  return {
    toggleShowAllEmployees: async (): Promise<void> => {
      await basePage.waitForElement(locators.showAllEmployeesToggle);
      await locators.showAllEmployeesToggle.click();
    },

    clickShow: async (): Promise<void> => {
      await locators.showButton.click();
    },

    isResultsVisible: async (): Promise<boolean> => {
      await locators.resultsHeading.waitFor({ state: 'visible', timeout: config.timeouts.long });
      return true;
    },

    getEmployeeRowsCount: async (): Promise<number> => {
      await locators.employeeRows
        .first()
        .waitFor({ state: 'visible', timeout: config.timeouts.long });
      return locators.employeeRows.count();
    },

    selectRandomSurname: async (): Promise<string> => {
      await locators.surnameSearchInput.click();
      await locators.surnameOptions
        .first()
        .waitFor({ state: 'visible', timeout: config.timeouts.long });
      const count = await locators.surnameOptions.count();
      const randomIndex = Math.floor(Math.random() * count);
      const surname = (await locators.surnameOptions.nth(randomIndex).textContent())?.trim() || '';
      if (!surname) {
        throw new Error('selectRandomSurname: surname is empty');
      }
      await locators.surnameOptions.nth(randomIndex).click();
      await locators.surnameCollapseButton.first().click();
      return surname;
    },
  };
};

export type OtPbBase = ReturnType<typeof createOtPbBase>;
