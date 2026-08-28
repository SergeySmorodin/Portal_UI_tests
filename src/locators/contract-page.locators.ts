import { Page } from '@playwright/test';

export const createContractPageLocators = (page: Page) => ({
  heading: page.locator('h1'),

  // Поля формы
  contractInput: page.locator('input[name="contract"]'),
  dateInput: page.locator('input[name="contract_date"]'),
  moneyInput: page.locator('input[name="money"]'),
  statusSelect: page.locator('select[name="status"]'),

  // Компания
  companyButton: page.getByRole('button', { name: 'Выберите компанию' }),

  // Файл (обязательное поле)
  fileInput: page.locator('input[type="file"]'),

  // Строки договора: переключатель менеджера (список с поиском) и select вида работ
  managerToggle: page.locator('button:has(i.fa-chevron-down)').last(),
  workTypeSelect: page.locator('select:not([name="status"])').last(),

  // Кнопки управления
  saveButton: page.getByRole('button', { name: 'Сохранить' }),
  backButton: page.getByRole('button', { name: 'Назад' }),
  closeButton: page.getByRole('button', { name: 'Закрыть' }),
});

export const createContractsListLocators = (page: Page) => ({
  heading: page.locator('h1:has-text("Договоры")'),

  // Поиск и фильтры
  searchInput: page.getByPlaceholder('Номер договора'),

  // Таблица
  table: page.locator('table'),
  tableRows: page.locator('table tbody tr'),
  contractNumberCell: (contractNumber: string) =>
    page.locator('table tbody tr').filter({ hasText: contractNumber }),
});

export type ContractPageLocators = ReturnType<typeof createContractPageLocators>;
export type ContractsListLocators = ReturnType<typeof createContractsListLocators>;
