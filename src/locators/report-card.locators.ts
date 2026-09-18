import { Page } from '@playwright/test';

export const createReportCardLocators = (page: Page) => ({
  heading: page.locator('h1'),
  headingTab: (name: string) => page.locator(`h1:has-text("Табель работы ${name}")`),
  createButton: page.getByRole('button', { name: 'Создать табель' }),
  createConfirmButton: page.getByRole('button', { name: 'Создать' }).last(),
  rateRowsButton: page.getByRole('button', { name: 'Ставка', exact: true }),
  saveButton: page.getByRole('button', { name: 'Сохранить' }),

  // Таблица персонала
  workerRows: page.locator('table tbody tr'),
  workerNameCells: page.locator('table tbody tr td').nth(2),
  workerRow: (name: string) => page.locator('table tbody tr').filter({ hasText: name }),
  workerRateInput: (name: string) =>
    page
      .locator('table tbody tr')
      .filter({ hasText: name })
      .locator('td')
      .nth(5)
      .locator('input')
      .first(),
  workerDayInput: (name: string, dayIndex: number) =>
    page
      .locator('table tbody tr')
      .filter({ hasText: name })
      .locator('td')
      .nth(6 + dayIndex)
      .locator('input')
      .first(),
  workerDayCells: (name: string) =>
    page.locator('table tbody tr').filter({ hasText: name }).locator('td'),

  // Состояние табелей
  stateText: page.locator('text=Состояние табелей'),
});

export type ReportCardLocators = ReturnType<typeof createReportCardLocators>;
