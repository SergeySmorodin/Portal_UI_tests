import { Page } from '@playwright/test';

export const createCompanyPageLocators = (page: Page) => ({
  heading: page.locator('h1'),

  // Поля формы
  structureSelect: page.locator('select[name="structure"]'),
  nameInput: page.locator('input[name="company"]'),
  addressInput: page.locator('input[name="address"]'),
  factAddressInput: page.locator('input[name="fact_address"]'),
  innInput: page.locator('input[name="inn"]'),
  ogrnInput: page.locator('input[name="ogrn"]'),
  emailInput: page.locator('input[name="email"]'),

  // Кнопки управления
  saveButton: page.getByRole('button', { name: 'Сохранить' }),
  backButton: page.getByRole('button', { name: 'Назад' }),
  closeButton: page.getByRole('button', { name: 'Закрыть' }),
});

export const createCompaniesListLocators = (page: Page) => ({
  heading: page.locator('h1:has-text("Компании")'),

  // Поиск и фильтры
  searchInput: page.locator('input[name="search"]'),

  // Таблица
  table: page.locator('table'),
  companyRow: (name: string) => page.locator('table tbody tr').filter({ hasText: name }),
});

export type CompanyPageLocators = ReturnType<typeof createCompanyPageLocators>;
export type CompaniesListLocators = ReturnType<typeof createCompaniesListLocators>;
