import { Page } from '@playwright/test';

export const createWorkPageLocators = (page: Page) => ({
  heading: page.locator('h1'),

  // Поля формы
  nameInput: page.locator('input[name="name"]'),
  directionSelect: page.locator('select[name="direction"]'),
  contractButton: page.getByRole('button', { name: 'Выберите договор' }),
  startFactDateInput: page.locator('#startFactDate'),
  stopFactDateInput: page.locator('#stopFactDate'),
  temporaryPersonalInput: page.locator('input[name="temporary_personal"]'),
  workShiftInput: page.locator('input[name="work_shift"]'),

  // Кнопки управления
  saveButton: page.getByRole('button', { name: 'Создать работу' }),
  backButton: page.getByRole('button', { name: 'Назад' }),
  closeButton: page.getByRole('button', { name: 'Закрыть' }),
});

export const createWorksListLocators = (page: Page) => ({
  heading: page.locator('h1'),

  // Панель навигации: кнопка "+" для создания новой работы
  addWorkButton: page.locator('#panel-left button i.fa-plus'),

  // Поиск и фильтры
  searchInput: page.locator('input[name="search"]'),
  nameFilter: page.locator('input[name="name"]'),
  statusFilter: page.locator('select[name="status"]'),

  // Таблица
  table: page.locator('table'),
  tableRows: page.locator('table tbody tr'),
  workRow: (name: string) => page.locator('table tbody tr').filter({ hasText: name }),
});

export const createAllWorksListLocators = (page: Page) => ({
  heading: page.locator('h1:has-text("Все работы")'),

  // Поиск и фильтры
  searchInput: page.locator('input[name="search"]'),
  nameFilter: page.locator('input[name="name"]'),
  statusFilter: page.locator('select[name="status"]'),

  // Таблица
  table: page.locator('table'),
  tableRows: page.locator('table tbody tr'),
  workNameCell: (name: string) => page.locator('table tbody tr').filter({ hasText: name }).first(),
  workLink: (name: string) =>
    page.locator('table tbody tr').filter({ hasText: name }).first().locator('a'),
});

export type WorkPageLocators = ReturnType<typeof createWorkPageLocators>;
export type WorksListLocators = ReturnType<typeof createWorksListLocators>;
