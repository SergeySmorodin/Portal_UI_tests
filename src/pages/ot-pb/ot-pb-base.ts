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
  positionSearchInput: Locator;
  departmentSearchInput: Locator;
  branchSearchInput: Locator;
  protocolSearchInput: Locator;
  certificateSearchInput: Locator;
  periodStartInput: Locator;
  periodStopInput: Locator;
  filterOptions: Locator;
  missingFilterButton: Locator;
  expiredFilterButton: Locator;
  lessThan30DaysFilterButton: Locator;
  moreThan30DaysFilterButton: Locator;
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
  selectRandomPosition: () => Promise<string>;
  selectRandomDepartment: () => Promise<string>;
  selectRandomBranch: () => Promise<string>;
  fillProtocolSearch: (value: string) => Promise<void>;
  fillCertificateSearch: (value: string) => Promise<void>;
  setPeriod: (start: string, stop: string) => Promise<void>;
  selectFilterOption: (searchInput: Locator, optionText: string) => Promise<void>;
  isFilterOptionHighlighted: (optionText: string) => Promise<boolean>;
  getResultColumnValues: (columnIndex: number) => Promise<string[]>;
  isButtonActive: (button: Locator) => Promise<boolean>;
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

      return locators.employeeRows.evaluateAll(
        (rows) =>
          rows.filter((row) => {
            const cells = row.querySelectorAll('td');
            for (let j = 1; j < cells.length; j++) {
              if (cells[j].textContent?.trim()) return false;
            }
            return true;
          }).length
      );
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

    selectRandomPosition: async (): Promise<string> => {
      return selectRandomOption(locators.positionSearchInput, locators.filterOptions, 'Position');
    },

    selectRandomDepartment: async (): Promise<string> => {
      return selectRandomOption(
        locators.departmentSearchInput,
        locators.filterOptions,
        'Department'
      );
    },

    selectRandomBranch: async (): Promise<string> => {
      return selectRandomOption(locators.branchSearchInput, locators.filterOptions, 'Branch');
    },

    fillProtocolSearch: async (value: string): Promise<void> => {
      await basePage.waitForElement(locators.protocolSearchInput);
      await locators.protocolSearchInput.click();
      await locators.protocolSearchInput.fill(value);
    },

    fillCertificateSearch: async (value: string): Promise<void> => {
      await basePage.waitForElement(locators.certificateSearchInput);
      await locators.certificateSearchInput.click();
      await locators.certificateSearchInput.fill(value);
    },

    setPeriod: async (start: string, stop: string): Promise<void> => {
      await basePage.waitForElement(locators.periodStartInput);
      await locators.periodStartInput.click();
      await locators.periodStartInput.fill(start);
      await locators.periodStartInput.press('Enter');
      await locators.periodStopInput.click();
      await locators.periodStopInput.fill(stop);
      await locators.periodStopInput.press('Enter');
    },

    selectFilterOption: async (searchInput: Locator, optionText: string): Promise<void> => {
      await searchInput.click();
      const option = locators.filterOptions.getByText(optionText, { exact: true }).first();
      await option.waitFor({ state: 'visible', timeout: config.timeouts.long });
      await option.click();
    },

    isFilterOptionHighlighted: async (optionText: string): Promise<boolean> => {
      const option = locators.filterOptions.getByText(optionText, { exact: true }).first();
      const className = await option.getAttribute('class');
      return Boolean(className && className.includes('bg-intra-orange'));
    },

    isButtonActive: async (button: Locator): Promise<boolean> => {
      const className = await button.getAttribute('class');
      return Boolean(className && className.includes('ring-intra-orange'));
    },

    getResultColumnValues: async (columnIndex: number): Promise<string[]> => {
      await locators.resultsHeading.waitFor({ state: 'visible', timeout: config.timeouts.long });
      return locators.employeeRows.evaluateAll(
        (rows, index) =>
          rows.map((row) => row.querySelectorAll('td')[index]?.textContent?.trim() || ''),
        columnIndex
      );
    },
  };
};

const selectRandomOption = async (
  input: Locator,
  filterOptions: Locator,
  name: string
): Promise<string> => {
  await input.click();
  await filterOptions.first().waitFor({ state: 'visible', timeout: config.timeouts.long });
  const count = await filterOptions.count();
  const randomIndex = Math.floor(Math.random() * count);
  const optionText = (await filterOptions.nth(randomIndex).textContent())?.trim() || '';
  if (!optionText) {
    throw new Error(`selectRandom${name}: option text is empty`);
  }
  await filterOptions.nth(randomIndex).click();
  return optionText;
};

export type OtPbBase = ReturnType<typeof createOtPbBase>;
