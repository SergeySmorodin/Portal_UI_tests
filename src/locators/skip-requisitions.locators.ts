import { Page } from '@playwright/test';

export const createSkipRequisitionsLocators = (page: Page) => ({
  /** Поиск по проекту/работе в шапке списка заявок СКИП. */
  searchInput: page.getByPlaceholder('Название проекта...'),

  /** Таблица «Заявки на обработку (СКИП)». */
  listTable: page
    .locator('table')
    .filter({ has: page.getByRole('columnheader', { name: 'ПРОЕКТ' }) }),
  listRows: page.locator('table tbody tr'),
  emptyState: page.getByText('Нет данных'),

  /** Кнопка с названием работы в строке списка: открывает карточку заявок СКИП. */
  workButton: (workName: string) => page.getByRole('button', { name: workName }).first(),

  /**
   * Ссылка на карточку заявок СКИП по работе.
   * pk работы уже приходит с префиксом `p_`, поэтому он не добавляется повторно.
   */
  workDetailsUrl: (projectPk: string): string => `/SKIP/requisitions/${projectPk}`,

  // Карточка заявок СКИП
  projectNotFound: page.getByText('Проект не найден'),
  newRequestsTab: page.getByRole('button', { name: /Новые\(\d+\)/ }),
  processedRequestsTab: page.getByRole('button', { name: /Обработанные\(\d+\)/ }),
  requestsTable: page
    .locator('table')
    .filter({ has: page.getByRole('columnheader', { name: 'ФИО СОЗДАТЕЛЯ' }) }),
  emptyRequests: page.getByText('Нет заявок'),
});

export type SkipRequisitionsLocators = ReturnType<typeof createSkipRequisitionsLocators>;
