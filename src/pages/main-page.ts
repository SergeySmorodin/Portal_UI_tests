import { Page } from '@playwright/test';
import { createBasePage } from './base-page';
import { createMainPageLocators, MAIN_PAGE_SECTIONS } from '../locators/main-page.locators';

export const createMainPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/';

  const locators = createMainPageLocators(page);

  return {
    ...basePage,
    locators,
    mainSections: MAIN_PAGE_SECTIONS,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.userProfileLink);
    },

    navigateToProfile: async (): Promise<void> => {
      await locators.userProfileLink.click();
      await page.waitForURL((url) => url.pathname.includes('/lk'), { timeout: 10000 });
    },
  };
};

export type MainPage = ReturnType<typeof createMainPage>;
