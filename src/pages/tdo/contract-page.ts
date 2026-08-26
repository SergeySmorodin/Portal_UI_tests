import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createContractPageLocators } from '../../locators/contract-page.locators';
import { ContractData } from '../../types';
import { testHelpers } from '../../utils/helpers';

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
      return testHelpers.selectRandomOption(locators.statusSelect);
    },

    selectRandomCompany: async (): Promise<string> => {
      await locators.companyButton.click();
      const searchInput = page.locator('input[placeholder="Поиск..."]').first();
      await testHelpers.waitForElement(searchInput);
      await searchInput.fill('');
      await locators.companyListContainer.locator('button').first().waitFor({ state: 'visible' });
      return testHelpers.selectRandomFromList(locators.companyListContainer);
    },

    selectRandomManager: async (): Promise<string> => {
      const addBtn = page.getByRole('button', { name: '+', exact: true }).first();
      await testHelpers.waitForElement(addBtn);
      await addBtn.click();
      const nameBtn = page.locator('button:has(i.fa-chevron-down)').last();
      await nameBtn.waitFor({ state: 'visible' });
      const managerName = (await nameBtn.textContent())?.trim() || '';
      await nameBtn.click();
      const searchInput = page.locator('input[placeholder="Поиск..."]').last();
      await testHelpers.waitForElement(searchInput);
      await searchInput.fill('');
      const container = page.locator('.max-h-60').last();
      await container.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if (await testHelpers.isElementPresent(container)) {
        return testHelpers.selectRandomFromList(container);
      }
      return managerName;
    },

    selectRandomWorkType: async (): Promise<string> => {
      const addBtn = page.getByRole('button', { name: '+', exact: true }).last();
      await testHelpers.waitForElement(addBtn);
      await addBtn.click();
      const workSelect = page.locator('select:not([name="status"])').last();
      await workSelect.waitFor({ state: 'visible' });
      return testHelpers.selectRandomOption(workSelect);
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

export type ContractPage = ReturnType<typeof createContractPage>;
