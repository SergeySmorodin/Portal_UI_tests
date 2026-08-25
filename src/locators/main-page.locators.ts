import { Page } from '@playwright/test';

/** Разделы на главной странице (SVG-схема). */
export const MAIN_PAGE_SECTIONS = [
  'Сертификаты',
  'Контрагенты',
  'Договоры',
  'Проекты',
  'Работы',
  'Центр аналитики',
] as const;

export const createMainPageLocators = (page: Page) => ({
  userProfileLink: page.getByRole('link', { name: 'Профиль сотрудника' }),
});

export type MainPageLocators = ReturnType<typeof createMainPageLocators>;
