import { Page } from '@playwright/test';

export const createEmployeeTimelineLocators = (page: Page) => {
  const searchPanel = page
    .locator('div.bg-white.rounded-lg')
    .filter({ has: page.getByRole('heading', { name: 'Параметры поиска' }) })
    .first();

  return {
    heading: page.locator('h1'),

    // «Параметры поиска»
    searchPanel,
    employeeNameInput: searchPanel.getByPlaceholder('ФИО...'),
    statusFilter: searchPanel.locator('select'),
    periodFromInput: searchPanel.getByPlaceholder('дд-мм-гггг').first(),
    periodToInput: searchPanel.getByPlaceholder('дд-мм-гггг').nth(1),

    // Таблица календаря
    employeeRow: (name: string) => page.locator('table tbody tr').filter({ hasText: name }).first(),
    plannedVisitRow: (projectCode: string) =>
      page
        .locator('table tbody tr')
        .filter({ hasText: 'Планируемый' })
        .filter({ has: page.getByText(projectCode, { exact: true }) })
        .first(),
  };
};

export type EmployeeTimelineLocators = ReturnType<typeof createEmployeeTimelineLocators>;
