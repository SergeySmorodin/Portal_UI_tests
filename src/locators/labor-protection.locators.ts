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
  protocolSearchInput: page.getByPlaceholder('найти протокол...'),
  certificateSearchInput: page.getByPlaceholder('найти удостоверение...'),
  periodStartInput: page
    .locator('div.bg-white')
    .filter({ hasText: 'Фильтрация выбора' })
    .getByPlaceholder('дд-мм-гггг')
    .nth(0),
  periodStopInput: page
    .locator('div.bg-white')
    .filter({ hasText: 'Фильтрация выбора' })
    .getByPlaceholder('дд-мм-гггг')
    .nth(1),

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
  employeeCheckboxes: page.locator('table tbody tr td input[type="checkbox"]'),
  protocolRow: (employee: string, protocolNumber: string) =>
    page
      .locator('table tbody tr')
      .filter({ hasText: employee })
      .filter({ hasText: protocolNumber }),
  protocolLink: (employee: string, protocolNumber: string) =>
    page
      .locator('table tbody tr')
      .filter({ hasText: employee })
      .filter({ hasText: protocolNumber })
      .getByRole('link', { name: protocolNumber }),

  // Создание записи
  createRecordButton: page.getByRole('button', { name: 'Создать запись' }),
  createPageHeading: page.getByRole('heading', { name: 'Создание записей' }),
  addProtocolButton: page.getByRole('button', { name: '+ Добавить протокол' }),
  createPageSaveButton: page.locator('main').getByRole('button', { name: 'Сохранить' }),

  // Таблица «Создание записей» (строки выбранных сотрудников)
  createTableRow: (employee: string) =>
    page.locator('table tbody tr').filter({ hasText: employee }),
  employeeProtocolSelect: (employee: string) =>
    page.locator('table tbody tr').filter({ hasText: employee }).getByRole('combobox'),
  employeeCertificateInput: (employee: string) =>
    page
      .locator('table tbody tr')
      .filter({ hasText: employee })
      .getByPlaceholder('№ удостоверения'),
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

  // Модальное окно «Создание протокола»
  protocolModal: page.locator('div.fixed.inset-0').filter({ hasText: 'Создание протокола' }),
  protocolNumberInput: page
    .locator('div.fixed.inset-0')
    .filter({ hasText: 'Создание протокола' })
    .getByPlaceholder('например: ПТ-2025-001'),
  protocolDateInput: page
    .locator('div.fixed.inset-0')
    .filter({ hasText: 'Создание протокола' })
    .getByPlaceholder('дд-мм-гггг'),
  protocolFileInput: page.locator('#protocol-file-input'),
  saveProtocolButton: page
    .locator('div.fixed.inset-0')
    .filter({ hasText: 'Создание протокола' })
    .getByRole('button', { name: 'Сохранить' }),
});

export type LaborProtectionLocators = ReturnType<typeof createLaborProtectionLocators>;
