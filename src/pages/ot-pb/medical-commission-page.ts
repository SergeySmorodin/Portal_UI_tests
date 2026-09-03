import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createMedicalCommissionLocators } from '../../locators/medical-commission.locators';
import { createOtPbBase } from './ot-pb-base';

export const createMedicalCommissionPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/OT_PB/MedicalCommission';

  const locators = createMedicalCommissionLocators(page);

  const medicalCommissionPage = {
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

    selectAllCategories: async (categories: string[]): Promise<void> => {
      for (const category of categories) {
        await medicalCommissionPage.selectCategory(category);
      }
    },
  };

  return medicalCommissionPage;
};

export type MedicalCommissionPage = ReturnType<typeof createMedicalCommissionPage>;
