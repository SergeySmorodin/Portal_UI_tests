import { Page } from '@playwright/test';

export const createProjectPageLocators = (page: Page) => ({
  heading: page.locator('h1'),

  // Поля формы
  codeInput: page.locator('input[name="code"]'),
  statusSelect: page.locator('select[name="status"]'),
  startDateInput: page.locator('#startDate'),
  stopDateInput: page.locator('#stopDate'),
  groupProjectSelect: page.locator('select[name="group_project"]'),
  typeProjectSelect: page.locator('select[name="type_project"]'),
  departmentProjectSelect: page.locator('select[name="department_project"]'),
  kindProjectSelect: page.locator('select[name="kind_project"]'),
  noteTextarea: page.locator('textarea[name="note"]'),

  // Кнопки управления
  saveButton: page.getByRole('button', { name: 'Сохранить' }),
  backButton: page.getByRole('button', { name: 'Назад' }),
  closeButton: page.getByRole('button', { name: 'Закрыть' }),
});

export const createProjectsListLocators = (page: Page) => ({
  heading: page.locator('h1:has-text("Проекты")'),

  // Поиск и фильтры
  searchInput: page.locator('input[name="search"]'),
  codeFilter: page.locator('input[name="code"]'),
  statusFilter: page.locator('select[name="status"]'),

  // Таблица
  table: page.locator('table'),
  tableRows: page.locator('table tbody tr'),
  projectCodeCell: (code: string) => page.locator('table tbody tr').filter({ hasText: code }),
  worksButton: (code: string) =>
    page.locator('table tbody tr').filter({ hasText: code }).locator('button:has-text("Работы")'),
});

export type ProjectPageLocators = ReturnType<typeof createProjectPageLocators>;
export type ProjectsListLocators = ReturnType<typeof createProjectsListLocators>;
