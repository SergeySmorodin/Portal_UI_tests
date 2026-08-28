import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import {
  createCompanyPageLocators,
  createCompaniesListLocators,
} from '../../locators/company-page.locators';
import { CompanyData } from '../../types';

export const createCompanyPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/help/company/new';

  const locators = createCompanyPageLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectRandomStructure: async (): Promise<string> => {
      return basePage.selectRandomOption(locators.structureSelect);
    },

    fillBasicFields: async (data: CompanyData): Promise<void> => {
      await locators.structureSelect.selectOption(data.structure);
      await locators.nameInput.fill(data.name);
      await locators.addressInput.fill(data.address);
      await locators.factAddressInput.fill(data.factAddress);
      await locators.innInput.fill(data.inn);
      await locators.ogrnInput.fill(data.ogrn);
      await locators.emailInput.fill(data.email);
    },

    save: async (): Promise<void> => {
      await locators.saveButton.click();
    },
  };
};

export const createCompaniesListPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/help/companys';

  const locators = createCompaniesListLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    searchByName: async (name: string): Promise<void> => {
      await basePage.waitForElement(locators.searchInput);
      await locators.searchInput.fill(name);
      await page.waitForLoadState('networkidle').catch(() => {});
    },
  };
};

export type CompanyPage = ReturnType<typeof createCompanyPage>;
export type CompaniesListPage = ReturnType<typeof createCompaniesListPage>;
