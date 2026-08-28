import { Page } from '@playwright/test';

export const createCuratorPageLocators = (page: Page) => ({
  heading: page.locator('h1'),

  // Поля формы
  lastNameInput: page.locator('input[name="last_name"]'),
  firstNameInput: page.locator('input[name="first_name"]'),
  patronymicInput: page.locator('input[name="patronymic"]'),
  positionInput: page.locator('input[name="position"]'),
  departmentInput: page.locator('input[name="department"]'),
  emailInput: page.locator('input[name="email"]'),
  dateBirthInput: page.locator('input[name="date_birth"]'),
  aboutInput: page.locator('input[name="about"]'),

  // Компания (обязательное поле)
  companyButton: page.getByRole('button', { name: 'Выберите компанию' }),

  // Кнопки управления
  saveButton: page.getByRole('button', { name: 'Сохранить' }),
  backButton: page.getByRole('button', { name: 'Назад' }),
  closeButton: page.getByRole('button', { name: 'Закрыть' }),
});

export const createCuratorsListLocators = (page: Page) => ({
  heading: page.locator('h1:has-text("Кураторы")'),

  // Поиск и фильтры
  searchInput: page.locator('input[name="search"]'),

  // Таблица
  table: page.locator('table'),
  curatorRow: (name: string) => page.locator('table tbody tr').filter({ hasText: name }),
});

export type CuratorPageLocators = ReturnType<typeof createCuratorPageLocators>;
export type CuratorsListLocators = ReturnType<typeof createCuratorsListLocators>;
