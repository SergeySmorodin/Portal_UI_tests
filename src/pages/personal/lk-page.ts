import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createLkPageLocators } from '../../locators/lk-page.locators';
import { SIDEBAR_MENU_ITEMS } from '../../locators/header.locators';

const TAB_NAMES = [
  'Общая информация',
  'История проектов',
  'Аттестация',
  'Доп. образование',
  'Настройки',
] as const;

export type LkTabName = (typeof TAB_NAMES)[number];

export const createLkPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/lk';

  const locators = createLkPageLocators(page);

  return {
    ...basePage,
    locators,
    tabNames: TAB_NAMES,

    // Пункты бокового меню
    sidebarMenuItems: SIDEBAR_MENU_ITEMS,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.tabButtons.generalInfo);
    },

    openSidebar: async (): Promise<void> => {
      await basePage.click(locators.hamburgerButton);
      await basePage.expectVisible(locators.sidebar);
    },

    openTab: async (tab: LkTabName): Promise<void> => {
      await page.getByRole('button', { name: tab }).click();
    },

    getUserNameHeading: async (): Promise<string> => {
      return (await locators.userNameHeading.textContent())?.trim() || '';
    },
  };
};

export type LkPage = ReturnType<typeof createLkPage>;
