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
  requestsRows: page.locator('table tbody tr'),
  emptyRequests: page.getByText('Нет заявок'),
  editRequestButton: page.getByTitle('Взять в работу', { exact: true }),
  actionModal: page.locator('.fixed.inset-0').filter({ hasText: 'Действие с заявкой' }),
  takeIntoWorkButton: page
    .locator('.fixed.inset-0')
    .locator('button')
    .filter({ hasText: /^Взять в работу$/ }),
  viewRequestButton: page
    .locator('.fixed.inset-0')
    .locator('button')
    .filter({ hasText: /^Просмотреть$/ }),

  // Модал «Обработка заявки (СКИП)» — трёхшаговый мастер
  processingModal: page
    .locator('.fixed.inset-0')
    .filter({ has: page.getByText('Обработка заявки (СКИП)', { exact: true }) })
    .last(),
  processingHeading: page.getByText('Обработка заявки (СКИП)', { exact: true }),
  processingStepHeading: page.getByText(/^Шаг \d из \d$/),
  /** Шаг 2 «Суточные»: даты начала периодов суточных (по одной на сотрудника/период). */
  perDiemStartInputs: page.locator('.fixed.inset-0').locator('input[placeholder="дд-мм-гггг"]'),
  massEditStart: page
    .locator('.fixed.inset-0')
    .locator('label', { hasText: 'Старт:' })
    .first()
    .locator('xpath=following::input[@placeholder="дд-мм-гггг"][1]'),
  massEditStop: page
    .locator('.fixed.inset-0')
    .locator('label', { hasText: 'Стоп:' })
    .first()
    .locator('xpath=following::input[@placeholder="дд-мм-гггг"][1]'),
  visitRows: page.locator('.fixed.inset-0').locator('table tbody tr'),
  visitRowStart: (index: number) =>
    page
      .locator('.fixed.inset-0')
      .locator('table tbody tr')
      .nth(index)
      .locator('input[placeholder="дд-мм-гггг"]')
      .nth(0),
  visitRowStop: (index: number) =>
    page
      .locator('.fixed.inset-0')
      .locator('table tbody tr')
      .nth(index)
      .locator('input[placeholder="дд-мм-гггг"]')
      .nth(1),
  visitRowCheckbox: (index: number) =>
    page
      .locator('.fixed.inset-0')
      .locator('table tbody tr')
      .nth(index)
      .locator('input[type="checkbox"]')
      .first(),
  processingNextButton: page
    .locator('.fixed.inset-0')
    .locator('button')
    .filter({ hasText: /^Далее$/ }),
  processingBackButton: page
    .locator('.fixed.inset-0')
    .locator('button')
    .filter({ hasText: /^Назад$/ }),
  processingFinishButton: page
    .locator('.fixed.inset-0')
    .locator('button')
    .filter({ hasText: /^Завершить$/ }),
  finishConfirmText: page.getByText(
    'После завершения заявка будет доступна только для просмотра. Продолжить?'
  ),
  finishConfirmYes: page.locator('button').filter({ hasText: /^Да$/ }),
});

export type SkipRequisitionsLocators = ReturnType<typeof createSkipRequisitionsLocators>;
