import { Page } from '@playwright/test';

export const createReportCardLocators = (page: Page) => {
  const approvalModal = page
    .locator('div.fixed.inset-0')
    .filter({ has: page.getByRole('heading', { name: 'Согласование табеля' }) });

  return {
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
    periodsCount: page.getByText(/Периодов:\s*\d+/),

    // Согласование табеля
    approvalButton: page.locator('button:has(i.fa-file-signature)'),
    approvalModal,
    approvalPeriodEndInput: approvalModal.locator('input[placeholder="дд-мм-гггг"]'),
    approvalSubmitButton: approvalModal.locator('button:has(i.fa-paper-plane)'),
  };
};

export type ReportCardLocators = ReturnType<typeof createReportCardLocators>;
