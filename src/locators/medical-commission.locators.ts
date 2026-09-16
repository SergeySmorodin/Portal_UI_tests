import { Page } from '@playwright/test';

export const createMedicalCommissionLocators = (page: Page) => ({
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
  filterOptions: page
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
  createRecordButton: page.getByRole('button', { name: 'Создать запись' }),

  // Результаты
  resultsTable: page.locator('table'),
  resultsHeading: page.getByRole('columnheader', { name: 'ФИО' }),
  employeeRows: page.locator('table tbody tr'),
  employeeCheckboxes: page.locator('table tbody tr td input[type="checkbox"]'),
  recordRow: (employee: string, issueDate: string) =>
    page.locator('table tbody tr').filter({ hasText: employee }).filter({ hasText: issueDate }),

  // Создание записи
  createPageHeading: page.getByRole('heading', { name: 'Создание записей' }),
  createPageSaveButton: page.locator('main').getByRole('button', { name: 'Сохранить' }),
  createTableRow: (employee: string) =>
    page.locator('table tbody tr').filter({ hasText: employee }),
  employeeStartDateInput: (employee: string) =>
    page
      .locator('table tbody tr')
      .filter({ hasText: employee })
      .getByPlaceholder('дд-мм-гггг')
      .nth(0),
  employeeEndDateInput: (employee: string) =>
    page
      .locator('table tbody tr')
      .filter({ hasText: employee })
      .getByPlaceholder('дд-мм-гггг')
      .nth(1),
});

export type MedicalCommissionLocators = ReturnType<typeof createMedicalCommissionLocators>;
