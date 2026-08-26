import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createContractPageLocators } from '../../locators/contract-page.locators';
import { config } from '../../config/config';
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
      await locators.companyButton.click();
      const searchInput = page.locator('input[placeholder="Поиск..."]').first();
      await basePage.waitForElement(searchInput);
      await searchInput.fill('');
      await locators.companyListContainer.locator('button').first().waitFor({ state: 'visible' });
      return basePage.selectRandomFromList(locators.companyListContainer);
    },

    selectRandomManager: async (): Promise<string> => {
      const addBtn = page.getByRole('button', { name: '+', exact: true }).first();
      await basePage.waitForElement(addBtn);
      await addBtn.click();
      const nameBtn = page.locator('button:has(i.fa-chevron-down)').last();
      await nameBtn.waitFor({ state: 'visible' });
      const managerName = (await nameBtn.textContent())?.trim() || '';
      await nameBtn.click();
      const searchInput = page.locator('input[placeholder="Поиск..."]').last();
      await basePage.waitForElement(searchInput);
      await searchInput.fill('');
      const container = page.locator('.max-h-60').last();
      await container.waitFor({ state: 'visible', timeout: config.timeouts.short }).catch(() => {});
      if (await basePage.isElementPresent(container)) {
        return basePage.selectRandomFromList(container);
      }
      return managerName;
    },

    selectRandomWorkType: async (): Promise<string> => {
      const addBtn = page.getByRole('button', { name: '+', exact: true }).last();
      await basePage.waitForElement(addBtn);
      await addBtn.click();
      const workSelect = page.locator('select:not([name="status"])').last();
      await workSelect.waitFor({ state: 'visible' });
      return basePage.selectRandomOption(workSelect);
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
