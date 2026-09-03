import { Page } from '@playwright/test';

export const createDistributionRequestsLocators = (page: Page) => {
  const modal = page
    .locator('div.bg-white.rounded-lg')
    .filter({ has: page.getByText('Управление заявками', { exact: true }) });

  return {
    // Страница выбора проекта (создание заявки на командировку)
    searchInput: page.getByPlaceholder('Поиск по названию, ИНН...'),
    workButton: (name: string) => page.getByRole('button', { name }).first(),

    // Вкладки на странице работы
    visitsTab: page.getByRole('button', { name: /Визиты\(\d+\)/ }),
    requestsTab: page.getByRole('button', { name: /Заявки\(\d+\)/ }),
    createRequestButton: page.getByRole('button', { name: 'Создать заявку' }),

    // Модал «Управление заявками» — шаг 1 (заявки)
    modal,
    requestHeaderDate: (label: string) =>
      modal.locator('label', { hasText: label }).locator('xpath=following-sibling::div[1]//input'),
    requestHeaderSelect: (label: string) =>
      modal.locator('label', { hasText: label }).locator('xpath=following-sibling::select[1]'),
    requestHeaderInput: (label: string) =>
      modal.locator('label', { hasText: label }).locator('xpath=following-sibling::input[1]'),
    nextButton: page.getByRole('button', { name: 'Далее' }),

    // Модал «Управление заявками» — шаг 2: массовое редактирование билетов (шапка)
    massEditDropdown: (label: string) =>
      modal
        .locator('label', { hasText: new RegExp(`^${label}$`) })
        .first()
        .locator('xpath=following-sibling::div[1]'),
    massEditDate: (label: string) =>
      modal
        .locator('label', { hasText: new RegExp(`^${label}$`) })
        .first()
        .locator('xpath=following-sibling::div[1]//input'),
    massEditSelect: (label: string) =>
      modal
        .locator('label', { hasText: new RegExp(`^${label}$`) })
        .first()
        .locator('xpath=following-sibling::select[1]'),
    // Поиск города в выпадающем списке
    citySearchInput: page.getByPlaceholder('Поиск города...').first(),
    cityOption: (name: string) => page.locator('div.p-4.cursor-pointer', { hasText: name }).first(),
    // Карточка визита в шаге 2 и её билеты
    visitCard: (index: number) => modal.locator('div.bg-white.rounded-lg.p-4').nth(index),
    visitCardAddTicket: (index: number) =>
      modal
        .locator('div.bg-white.rounded-lg.p-4')
        .nth(index)
        .getByRole('button', { name: '+ Добавить билет' }),
    submitForApprovalButton: page.getByRole('button', { name: 'Отправить на согласование' }),
  };
};

export type DistributionRequestsLocators = ReturnType<typeof createDistributionRequestsLocators>;
