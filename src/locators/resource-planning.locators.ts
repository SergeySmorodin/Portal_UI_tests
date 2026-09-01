import { Page } from '@playwright/test';

export const createResourcePlanningLocators = (page: Page) => {
  const availableSection = page
    .locator('div.bg-white')
    .filter({ has: page.getByText('Доступный персонал', { exact: true }) });
  const claimedSection = page
    .locator('div.bg-white')
    .filter({ has: page.getByText('Заявленный персонал', { exact: true }) });

  return {
    heading: page.locator('h1'),

    // Поиск работы (левая панель со списком карточек)
    searchInput: page.getByPlaceholder('Поиск работы...'),
    workCard: (name: string) => page.locator('button').filter({ hasText: name }).first(),

    // Доступный персонал
    availableSection,
    availableAddButton: (index: number) =>
      availableSection.locator('button[title="Добавить"]').nth(index),
    availableAddButtons: availableSection.locator('button[title="Добавить"]'),
    availablePersonName: (index: number) =>
      availableSection
        .locator('button[title="Добавить"]')
        .nth(index)
        .locator('xpath=..')
        .locator('span')
        .first(),

    // Заявленный персонал
    claimedSection,
    claimedCount: claimedSection.locator('span.text-xs').first(),
    claimedPerson: (name: string) => claimedSection.locator('span', { hasText: name }),

    // Управление визитами
    manageVisitsButton: page.getByRole('button', { name: 'Управление визитами' }),
    saveButton: page.getByRole('button', { name: 'Сохранить', exact: true }),
    cancelButton: page.getByRole('button', { name: 'Отмена', exact: true }),
  };
};

export type ResourcePlanningLocators = ReturnType<typeof createResourcePlanningLocators>;
