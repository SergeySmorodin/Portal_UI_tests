import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createLaborProtectionLocators } from '../../locators/labor-protection.locators';
import { createOtPbBase } from './ot-pb-base';

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
  };

  return laborProtectionPage;
};

export type LaborProtectionPage = ReturnType<typeof createLaborProtectionPage>;
