import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createLaborProtectionLocators } from '../../locators/labor-protection.locators';
import { createOtPbBase } from './ot-pb-base';
import { config } from '../../config/config';
import path from 'path';

export const createLaborProtectionPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/OT_PB/LaborProtection';

  const locators = createLaborProtectionLocators(page);

  const laborProtectionPage = {
    ...basePage,
    locators,
    ...createOtPbBase(page, basePage, locators),

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectCategory: async (label: string): Promise<void> => {
      const checkbox = locators.categoryCheckbox(label);
      await basePage.waitForElement(checkbox);
      await checkbox.click();
    },

    selectCategories: async (categories: string[]): Promise<void> => {
      for (const category of categories) {
        await laborProtectionPage.selectCategory(category);
      }
    },

    clickReset: async (): Promise<void> => {
      await locators.resetButton.click();
    },

    selectRandomEmployee: async (): Promise<string> => {
      await locators.employeeCheckboxes
        .first()
        .waitFor({ state: 'visible', timeout: config.timeouts.long });
      const count = await locators.employeeCheckboxes.count();
      if (count === 0) {
        throw new Error('selectRandomEmployee: no employee checkboxes found');
      }
      const randomIndex = Math.floor(Math.random() * count);
      const checkbox = locators.employeeCheckboxes.nth(randomIndex);
      const row = checkbox.locator('xpath=ancestor::tr[1]');
      await checkbox.click();
      const surname = await row.locator('td').nth(1).textContent();
      return surname?.trim() || '';
    },

    clickCreateRecord: async (): Promise<void> => {
      await basePage.waitForElement(locators.createRecordButton);
      await locators.createRecordButton.click();
      await page.waitForURL('**/LaborProtection/create');
      await basePage.expectVisible(locators.createPageHeading);
    },

    addProtocol: async (): Promise<void> => {
      await basePage.waitForElement(locators.addProtocolButton);
      await locators.addProtocolButton.click();
      await locators.protocolModal.waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    fillProtocolForm: async (
      protocolNumber: string,
      date: string,
      filePath: string
    ): Promise<void> => {
      await locators.protocolNumberInput.fill(protocolNumber);
      await locators.protocolDateInput.fill(date);
      await locators.protocolFileInput.setInputFiles(path.resolve(process.cwd(), filePath));
    },

    saveProtocol: async (): Promise<void> => {
      await basePage.waitForElement(locators.saveProtocolButton);
      await basePage.runAndCheckResponse('/api/safety/sf_protocol/', async () => {
        await locators.saveProtocolButton.click();
      });
    },
  };

  return laborProtectionPage;
};

export type LaborProtectionPage = ReturnType<typeof createLaborProtectionPage>;
