import { Page } from '@playwright/test';

export const createLaborProtectionLocators = (page: Page) => ({
  heading: page.locator('h1.title-page'),

  // Колонка «Выбор категорий и столбцов»
  categoryCheckbox: (label: string) =>
    page
      .locator('div.bg-white')
      .filter({ hasText: 'Выбор категорий и столбцов' })
      .locator('label', { hasText: label })
      .locator('input[type="checkbox"]'),

  // Колонка «Фильтрация выбора»
  toggleShowData: page.locator('label:has(input[name="hide-empty-records"])'),
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
  positionSearchInput: page.getByPlaceholder('Поиск по должности...'),
  departmentSearchInput: page.getByPlaceholder('Поиск по отделам...'),
  branchSearchInput: page.getByPlaceholder('Поиск по филиалам...'),

  // Срок действия (фильтр по статусу сертификатов)
  missingFilterButton: page.getByRole('button', { name: 'отсутствует' }),
  expiredFilterButton: page.getByRole('button', { name: 'просрочено' }),
  lessThan30DaysFilterButton: page.getByRole('button', { name: 'до 30 дней' }),
  moreThan30DaysFilterButton: page.getByRole('button', { name: '> 30 дней' }),

  // Кнопки действий
  showButton: page.getByRole('button', { name: 'Показать' }),
  resetButton: page.getByRole('button', { name: 'Сбросить' }),
  closeButton: page.getByRole('button', { name: 'Закрыть' }),

  // Результаты
  resultsTable: page.locator('table'),
  resultsHeading: page.getByRole('columnheader', { name: 'ФИО' }),
  employeeRows: page.locator('table tbody tr'),
});

export type LaborProtectionLocators = ReturnType<typeof createLaborProtectionLocators>;
