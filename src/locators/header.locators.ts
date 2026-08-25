import { Page } from '@playwright/test';

/** Пункты бокового меню (общая шапка внутренних страниц). */
export const SIDEBAR_MENU_ITEMS = [
  'Главная',
  'СКиП',
  'ТДО',
  'Сопровождение проектов',
  'Сервисы',
  'Охрана труда',
] as const;

export const createHeaderLocators = (page: Page) => ({
  userNameHeading: page.locator('h3[class*="text-white"]').first(),
  hamburgerButton: page.locator('.container-header .cursor-pointer').first(),
  sidebar: page.locator('#sidebar'),
});

export type HeaderLocators = ReturnType<typeof createHeaderLocators>;
