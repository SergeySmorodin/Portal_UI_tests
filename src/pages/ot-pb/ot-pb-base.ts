import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';
import { config } from '../../config/config';

export interface OtPbLocators {
  heading: Locator;
  toggleShowData: Locator;
  showButton: Locator;
  surnameSearchInput: Locator;
  surnameOptions: Locator;
  surnameCollapseButton: Locator;
  filterColumn: Locator;
  resultsTable: Locator;
  resultsHeading: Locator;
  employeeRows: Locator;
  categoryCheckbox?: (label: string) => Locator;
}

export interface OtPbPageApi {
  open: () => Promise<void>;
  selectCategories: (categories: string[]) => Promise<void>;
  clickShow: () => Promise<void>;
  toggleShowData: () => Promise<void>;
  isResultsVisible: () => Promise<boolean>;
  getEmployeeRowsCount: () => Promise<number>;
  getEmptyEmployeeRowsCount: () => Promise<number>;
  selectRandomSurname: () => Promise<string>;
  locators: OtPbLocators;
}

export const createOtPbBase = (page: Page, basePage: BasePage, locators: OtPbLocators) => {
  const selectCategories = async (categories: string[]): Promise<void> => {
    if (categories.length === 0) {
      return;
    }
    if (locators.categoryCheckbox) {
      for (const category of categories) {
        const checkbox = locators.categoryCheckbox(category);
        await basePage.waitForElement(checkbox);
        await checkbox.click();
      }
    }
  };

  return {
    selectCategories,

    toggleShowData: async (): Promise<void> => {
      await basePage.waitForElement(locators.toggleShowData);
      await locators.toggleShowData.click();
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

    getEmptyEmployeeRowsCount: async (): Promise<number> => {
      await locators.employeeRows
        .first()
        .waitFor({ state: 'visible', timeout: config.timeouts.long });
      const count = await locators.employeeRows.count();
      let emptyCount = 0;
      for (let i = 0; i < count; i++) {
        const row = locators.employeeRows.nth(i);
        const cells = row.locator('td');
        const cellCount = await cells.count();
        let hasData = false;
        for (let j = 1; j < cellCount; j++) {
          const text = (await cells.nth(j).textContent())?.trim();
          if (text) {
            hasData = true;
            break;
          }
        }
        if (!hasData) {
          emptyCount++;
        }
      }
      return emptyCount;
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
      // await locators.surnameCollapseButton.first().click();
      return surname;
    },
  };
};

export type OtPbBase = ReturnType<typeof createOtPbBase>;
