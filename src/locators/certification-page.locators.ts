import { Page } from '@playwright/test';

export const createCertificationUploadLocators = (page: Page) => ({
  heading: page.locator('h1'),

  // Тип документа и общие поля
  resourceTypeSelect: page.locator('select[name="resource_type"]'),
  docTypeSelect: page.locator('select[name="doc_type"]'),
  statusSelect: page.locator('select[name="status"]'),
  nameTextarea: page.locator('textarea[name="name"]'),
  numberInput: page.locator('input[name="number"]'),

  // Даты
  startDateInput: page.locator('input[name="start_date"]'),
  expiryDateInput: page.locator('input[name="expiry_date"]'),
  warningPeriodInput: page.locator('input[name="expire_warning_period"]'),

  // Файл
  fileInput: page.locator('input[type="file"]'),

  // Кнопки управления
  submitButton: page.getByRole('button', { name: 'Загрузить' }),
  cancelButton: page.getByRole('button', { name: 'Отмена' }),
});

export type CertificationUploadLocators = ReturnType<typeof createCertificationUploadLocators>;

export const createCertificationSearchLocators = (page: Page) => ({
  heading: page.locator('h1'),

  // Поиск
  searchInput: page.locator('input[name="search"]'),

  // Таблица
  table: page.locator('table'),
  docRow: (name: string) => page.locator('table tbody tr').filter({ hasText: name }),
});

export type CertificationSearchLocators = ReturnType<typeof createCertificationSearchLocators>;
