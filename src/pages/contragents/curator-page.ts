import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import {
  createCuratorPageLocators,
  createCuratorsListLocators,
} from '../../locators/curator-page.locators';
import { CuratorData } from '../../types';

export const createCuratorPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/help/curator/new';

  const locators = createCuratorPageLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectRandomCompany: async (): Promise<string> => {
      const { container, opened } = await basePage.openSearchableDropdown(
        locators.companyButton,
        'first'
      );
      if (!opened) return '';
      return basePage.selectRandomFromList(container);
    },

    fillBasicFields: async (data: CuratorData): Promise<void> => {
      await locators.lastNameInput.fill(data.lastName);
      await locators.firstNameInput.fill(data.firstName);
      await locators.patronymicInput.fill(data.patronymic);
      await locators.positionInput.fill(data.position);
      await locators.departmentInput.fill(data.department);
      await locators.emailInput.fill(data.email);
      await locators.dateBirthInput.fill(data.dateBirth);
      await locators.aboutInput.fill(data.about);
    },

    save: async (): Promise<void> => {
      await locators.saveButton.click();
    },
  };
};

export const createCuratorsListPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/help/curators';

  const locators = createCuratorsListLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    searchByFullName: async (fullName: string): Promise<void> => {
      await basePage.waitForElement(locators.searchInput);
      await locators.searchInput.fill(fullName);
      await page.waitForLoadState('networkidle').catch(() => {});
    },
  };
};

export type CuratorPage = ReturnType<typeof createCuratorPage>;
export type CuratorsListPage = ReturnType<typeof createCuratorsListPage>;
