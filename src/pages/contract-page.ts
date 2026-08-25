import { Page } from '@playwright/test';
import { createBasePage } from './base-page';
import { createContractPageLocators } from '../locators/contract-page.locators';
import { ContractData } from '../types';

export const createContractPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/TDO/Contract/new';

  const locators = createContractPageLocators(page);

  const getStatusOptions = async (): Promise<string[]> => {
    return locators.statusSelect
      .locator('option')
      .evaluateAll((els) => els.map((e) => (e as HTMLOptionElement).value).filter(Boolean));
  };

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectRandomStatus: async (): Promise<string> => {
      const options = await getStatusOptions();
      const randomStatus = options[Math.floor(Math.random() * options.length)];
      await locators.statusSelect.selectOption(randomStatus);
      return randomStatus;
    },

    selectRandomCompany: async (): Promise<string> => {
      await locators.companyButton.click();
      const searchInput = page.locator('input[placeholder="Поиск..."]').first();
      await searchInput.waitFor({ state: 'visible', timeout: 10000 });
      await searchInput.fill('');
      await page.waitForTimeout(1500);
      const container = locators.companyListContainer;
      await container.waitFor({ state: 'visible', timeout: 10000 });
      const items = container.locator('button');
      const count = await items.count();
      const randomIndex = Math.floor(Math.random() * count);
      const selectedText = (await items.nth(randomIndex).textContent())?.trim() || '';
      await items.nth(randomIndex).click();
      await page.waitForTimeout(500);
      return selectedText;
    },

    selectRandomManager: async (): Promise<string> => {
      const addBtn = page.getByRole('button', { name: '+', exact: true }).first();
      await addBtn.waitFor({ state: 'visible', timeout: 10000 });
      await addBtn.click();
      await page.waitForTimeout(1000);
      const nameBtn = page.locator('button:has(i.fa-chevron-down)').last();
      const managerName = (await nameBtn.textContent())?.trim() || '';
      await nameBtn.click();
      await page.waitForTimeout(500);
      const searchInput = page.locator('input[placeholder="Поиск..."]').last();
      await searchInput.waitFor({ state: 'visible', timeout: 10000 });
      await searchInput.fill('');
      await page.waitForTimeout(1500);
      const container = page.locator('.max-h-60').last();
      await container.waitFor({ state: 'visible', timeout: 10000 });
      const items = container.locator('button');
      const count = await items.count();
      if (count > 0) {
        const randomIndex = Math.floor(Math.random() * count);
        const selectedText = (await items.nth(randomIndex).textContent())?.trim() || '';
        await items.nth(randomIndex).click();
        await page.waitForTimeout(500);
        return selectedText;
      }
      return managerName;
    },

    selectRandomWorkType: async (): Promise<string> => {
      const addBtn = page.getByRole('button', { name: '+', exact: true }).last();
      await addBtn.waitFor({ state: 'visible', timeout: 10000 });
      await addBtn.click();
      await page.waitForTimeout(1000);
      const workSelect = page.locator('select:not([name="status"])').last();
      const options = workSelect.locator('option');
      const optionCount = await options.count();
      const values: string[] = [];
      for (let j = 0; j < optionCount; j++) {
        const val = await options.nth(j).getAttribute('value');
        if (val) values.push(val);
      }
      const randomIndex = Math.floor(Math.random() * values.length);
      const selected = values[randomIndex];
      await workSelect.selectOption(selected);
      return selected;
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
