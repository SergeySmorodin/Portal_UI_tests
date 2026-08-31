import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import {
  createWorkPageLocators,
  createWorksListLocators,
  createAllWorksListLocators,
} from '../../locators/work-page.locators';
import { WorkData } from '../../types';
import { config } from '../../config/config';

export const createWorkPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/TDO/Work/new';

  const locators = createWorkPageLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectRandomDirection: async (): Promise<string> => {
      return basePage.selectRandomOption(locators.directionSelect);
    },

    selectContract: async (): Promise<string> => {
      return basePage.selectRandomFromSearchable(locators.contractButton);
    },

    fillBasicFields: async (data: WorkData): Promise<void> => {
      await locators.nameInput.fill(data.name);
      await locators.directionSelect.selectOption(data.direction);
      await locators.startFactDateInput.fill(data.startDate);
      await locators.stopFactDateInput.fill(data.stopDate);
      await locators.temporaryPersonalInput.fill(data.temporaryPersonal);
      await locators.workShiftInput.fill(data.workShift);
    },

    save: async (): Promise<void> => {
      await locators.saveButton.click();
    },
  };
};

export const createWorksListPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/TDO/Works';

  const locators = createWorksListLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    addWork: async (): Promise<void> => {
      await basePage.waitForElement(locators.addWorkButton);
      await locators.addWorkButton.click();
      await page.waitForURL((url) => url.pathname.includes('/TDO/Work/new'), {
        timeout: config.timeouts.long,
      });
    },
  };
};

export const createAllWorksListPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/TDO/AllWorks';

  const locators = createAllWorksListLocators(page);

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

export type WorkPage = ReturnType<typeof createWorkPage>;
export type WorksListPage = ReturnType<typeof createWorksListPage>;
export type AllWorksListPage = ReturnType<typeof createAllWorksListPage>;
