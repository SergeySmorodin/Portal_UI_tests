import { Page } from '@playwright/test';

export const createReportCardLocators = (page: Page) => ({
  heading: page.locator('h1'),
  headingTab: (name: string) => page.locator(`h1:has-text("Табель работы ${name}")`),
  createButton: page.getByRole('button', { name: 'Создать табель' }),

  // Таблица персонала
  workerRows: page.locator('table tbody tr'),
  workerNameCells: page.locator('table tbody tr td').nth(2),
  workerRow: (name: string) => page.locator('table tbody tr').filter({ hasText: name }),

  // Состояние табелей
  stateText: page.locator('text=Состояние табелей'),
});

export type ReportCardLocators = ReturnType<typeof createReportCardLocators>;
