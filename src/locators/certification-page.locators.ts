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

  // Счётчик и пагинация
  documentsCounter: page.getByText(/^Документы \(\d+\)$/),
  paginationInfo: page.getByText(/^Показано \d+-\d+ из \d+$/),

  // Таблица
  table: page.locator('table'),
  rows: page.locator('table tbody tr'),
  docRow: (name: string) => page.locator('table tbody tr').filter({ hasText: name }),
  docNameLink: (name: string) =>
    page.locator('table tbody tr').filter({ hasText: name }).getByRole('link', { name }),
});

export type CertificationSearchLocators = ReturnType<typeof createCertificationSearchLocators>;

export const createCertificationDetailLocators = (page: Page) => ({
  heading: page.locator('h1'),

  // Тип документа над карточкой, например «Разрешительный документ (Сертификат/Декларация)»
  documentTypeCaption: page.locator('main div.text-center'),

  // Значение поля карточки по его подписи («Наименование», «Номер / Обозначение», «Статус» и т.д.)
  fieldValue: (label: string) =>
    page.getByText(label, { exact: true }).locator('xpath=following-sibling::div[1]'),

  // Кнопки управления
  downloadButton: page.getByRole('button', { name: 'Скачать' }),
  previewButton: page.getByRole('button', { name: 'Предпросмотр' }),
  closeButton: page.getByRole('button', { name: 'Закрыть' }),
});

export type CertificationDetailLocators = ReturnType<typeof createCertificationDetailLocators>;
