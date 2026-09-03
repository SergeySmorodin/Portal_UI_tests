import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createIndustrialSafetyLocators } from '../../locators/industrial-safety.locators';
import { createOtPbBase } from './ot-pb-base';

export const createIndustrialSafetyPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/OT_PB/IndustrialSafety';

  const locators = createIndustrialSafetyLocators(page);

  const industrialSafetyPage = {
    ...basePage,
    locators,
    ...createOtPbBase(page, basePage, locators),

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectAll: async (): Promise<void> => {
      await basePage.waitForElement(locators.selectAllCheckbox);
      await locators.selectAllCheckbox.click();
    },
  };

  return industrialSafetyPage;
};

export type IndustrialSafetyPage = ReturnType<typeof createIndustrialSafetyPage>;
