import { Page } from '@playwright/test';

export const createIndustrialSafetyLocators = (page: Page) => ({
  heading: page.locator('h1.title-page'),

  // Колонка «Выбор категорий и столбцов»
  selectAllCheckbox: page
    .locator('div.bg-white')
    .filter({ hasText: 'Выбор категорий и столбцов' })
    .locator('label', { hasText: 'Выбрать всё' })
    .locator('input[type="checkbox"]'),

  // Колонка «Фильтрация выбора»
  showAllEmployeesToggle: page.locator('label:has(input[name="show-all-employees"])'),
  filterColumn: page.locator('div.bg-white').filter({ hasText: 'Фильтрация выбора' }),

  // Фильтры
  surnameSearchInput: page.getByPlaceholder('Поиск по фамилии...'),
  surnameOptions: page
    .locator('div.bg-white')
    .filter({ hasText: 'Фильтрация выбора' })
    .locator('div.px-3.py-2.cursor-pointer')
    .filter({ hasText: /\S/ }),
  surnameCollapseButton: page
    .locator('div.bg-white')
    .filter({ hasText: 'Фильтрация выбора' })
    .locator('button:has(i.fa-solid)'),

  // Кнопки действий
  showButton: page.getByRole('button', { name: 'Показать' }),

  // Результаты
  resultsTable: page.locator('table'),
  resultsHeading: page.getByRole('columnheader', { name: 'ФИО' }),
  employeeRows: page.locator('table tbody tr'),
});

export type IndustrialSafetyLocators = ReturnType<typeof createIndustrialSafetyLocators>;
