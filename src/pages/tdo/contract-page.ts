import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import {
  createContractPageLocators,
  createContractsListLocators,
} from '../../locators/contract-page.locators';
import { ContractData } from '../../types';

export const createContractPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/TDO/Contract/new';

  const locators = createContractPageLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectRandomStatus: async (): Promise<string> => {
      return basePage.selectRandomOption(locators.statusSelect);
    },

    selectRandomCompany: async (): Promise<string> => {
      return basePage.selectRandomFromSearchable(locators.companyButton);
    },

    selectRandomManager: async (): Promise<string> => {
      const addBtn = page.getByRole('button', { name: '+', exact: true }).first();
      return basePage.addRowAndSelectFromSearchable(addBtn, locators.managerToggle);
    },

    selectRandomWorkType: async (): Promise<string> => {
      const addBtn = page.getByRole('button', { name: '+', exact: true }).last();
      return basePage.addRowAndSelectRandomOption(addBtn, locators.workTypeSelect);
    },

    fillBasicFields: async (data: ContractData): Promise<void> => {
      await locators.contractInput.fill(data.contractNumber);
      await locators.dateInput.fill(data.date);
      await locators.moneyInput.fill(data.money);
      await locators.statusSelect.selectOption(data.status);
    },

    save: async (): Promise<void> => {
      await locators.saveButton.click();
    },
  };
};

export const createContractsListPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/TDO/Contracts';

  const locators = createContractsListLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    searchByContractNumber: async (contractNumber: string): Promise<void> => {
      await basePage.waitForElement(locators.searchInput);
      await locators.searchInput.fill(contractNumber);
      await page.waitForLoadState('networkidle').catch(() => {});
    },
  };
};

export type ContractPage = ReturnType<typeof createContractPage>;
export type ContractsListPage = ReturnType<typeof createContractsListPage>;
