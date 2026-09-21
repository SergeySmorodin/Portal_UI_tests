import { Page } from '@playwright/test';

export const createTimeTableLocators = (page: Page) => {
  const approvalStateSection = page
    .locator('div.bg-white.rounded-lg')
    .filter({ has: page.getByRole('heading', { name: 'Состояние табелей' }) })
    .first();

  const stateItem = (label: string) =>
    page.locator('div.flex.items-center.justify-between').filter({ hasText: label }).first();

  return {
    heading: page.locator('h1'),

    // Страница «Согласование табелей» — список работ
    projectSearchInput: page.getByPlaceholder('Название проекта...').first(),
    workRow: (name: string) =>
      page.locator('table tbody tr').filter({ has: page.getByRole('button', { name }) }),
    workButton: (name: string) => page.getByRole('button', { name }).first(),

    // Страница согласования табеля работы
    approvalHeading: (name: string) =>
      page.locator(`h1:has-text("Согласование табеля работы ${name}")`),
    approvalStateSection,
    approvalStateTotal: approvalStateSection.getByText(/Всего:\s*\d+/),
    stateItem,
    stateCount: (label: string) => stateItem(label).locator('span.shrink-0.font-bold').first(),
  };
};

export type TimeTableLocators = ReturnType<typeof createTimeTableLocators>;
