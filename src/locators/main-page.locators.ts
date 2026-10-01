import { Page } from '@playwright/test';

/** Разделы на главной странице (SVG-схема). */
export const MAIN_PAGE_SECTIONS = [
  'Сертификаты',
  'Контрагенты',
  'Договоры',
  'Проекты',
  'Работы',
] as const;

export const createMainPageLocators = (page: Page) => ({
  userProfileLink: page.getByRole('link', { name: 'Профиль сотрудника' }),
  /** Контейнер SVG-схемы разделов — позволяет не искать подписи по всему документу. */
  sectionSchema: page.locator('.radial-menu-container'),
});

export type MainPageLocators = ReturnType<typeof createMainPageLocators>;
