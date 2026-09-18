import { Page } from '@playwright/test';

export const createWorkingToolsLocators = (page: Page) => ({
  heading: page.locator('h1'),

  // Страница «Проекты направления супервайзинга»
  projectSearchInput: page.getByPlaceholder('Поиск по коду, названию...').first(),
  projectButton: (code: string) =>
    page.locator('button, [role="button"]').filter({ hasText: code }).first(),

  // Страница списка работ проекта
  workSearchInput: page.getByPlaceholder('Название работы').first(),
  workRow: (name: string) =>
    page.locator('table tbody tr').filter({ has: page.getByRole('link', { name }) }),
  reportCardButton: (name: string) =>
    page
      .locator('table tbody tr')
      .filter({ has: page.getByRole('link', { name }) })
      .locator('td button.text-intra-orange', {
        has: page.locator('i.fa-solid.fa-table'),
      })
      .first(),
});

export type WorkingToolsLocators = ReturnType<typeof createWorkingToolsLocators>;
