import { Page } from '@playwright/test';

export const createTimeTableLocators = (page: Page) => {
  const approvalStateSection = page
    .locator('div.bg-white.rounded-lg')
    .filter({ has: page.getByRole('heading', { name: 'Состояние табелей' }) })
    .first();

  const stateItem = (label: string) =>
    page.locator('div.flex.items-center.justify-between').filter({ hasText: label }).first();

  const decisionModal = page
    .locator('div.fixed.inset-0')
    .filter({ has: page.getByRole('heading', { name: 'Согласование табеля' }) });

  const confirmModal = page
    .locator('div.fixed.inset-0')
    .filter({ hasText: 'Табель будет согласован' });

  return {
    heading: page.locator('h1'),

    // Страница «Согласование табелей» — список работ
    projectSearchInput: page.getByPlaceholder('Название проекта...').first(),
    workRow: (name: string) =>
      page.locator('table tbody tr').filter({ has: page.getByRole('button', { name }) }),
    workButton: (name: string) => page.getByRole('button', { name }).first(),

    // Вкладки на странице согласования табелей
    tabs: page.locator('button[role="tab"]'),
    tab: (name: string) => page.getByRole('tab', { name }).first(),
    activeTab: page.locator('button[role="tab"][aria-selected="true"]'),

    // Страница согласования табеля работы
    approvalHeading: (name: string) =>
      page.locator(`h1:has-text("Согласование табеля работы ${name}")`),
    approvalStateSection,
    approvalStateTotal: approvalStateSection.getByText(/Всего:\s*\d+/),
    stateItem,
    stateCount: (label: string) => stateItem(label).locator('span.shrink-0.font-bold').first(),

    // Модал решения по табелю (руководитель службы, СКИП, ТД)
    decisionModal,
    decisionCommentInput: decisionModal.getByPlaceholder(
      'Общий комментарий (записывается в результат табеля)'
    ),
    // Иконка в начале имени кнопки, поэтому матчим по окончанию (регистр отделяет «Не согласован»)
    approveDecisionButton: decisionModal.getByRole('button', { name: /Согласован$/ }),
    rejectDecisionButton: decisionModal.getByRole('button', { name: /Не согласован$/ }),

    // Модал подтверждения согласования
    confirmModal,
    confirmYesButton: confirmModal.getByRole('button', { name: 'Да' }),
    confirmNoButton: confirmModal.getByRole('button', { name: 'Нет' }),

    // Модал подтверждения несогласования
    rejectConfirmModal: page
      .locator('div.fixed.inset-0')
      .filter({ hasText: 'Табель будет отклонен' }),
    rejectConfirmYesButton: page
      .locator('div.fixed.inset-0')
      .filter({ hasText: 'Табель будет отклонен' })
      .getByRole('button', { name: 'Да' }),
  };
};

export type TimeTableLocators = ReturnType<typeof createTimeTableLocators>;
