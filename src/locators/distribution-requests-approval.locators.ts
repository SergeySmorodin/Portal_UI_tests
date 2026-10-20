import { Page } from '@playwright/test';

export const createDistributionRequestsApprovalLocators = (page: Page) => ({
  /**
   * Карточка «Информация о заявке». Счётчики приходят одним текстовым узлом
   * («Сотрудников: 2 Визитов: 2 Билетов: 2»), поэтому берётся текст всей карточки.
   */
  summary: page
    .locator('div.bg-white')
    .filter({ has: page.getByText('Информация о заявке') })
    .last(),

  /** Таблица «Заявки(N)» со статусом заявки. */
  requestsHeading: page.getByText(/^Заявки\(\d+\)$/),
  requestsTab: page.getByRole('button', { name: /^Заявки\(\d+\)$/ }),
  visitsTab: page.getByRole('button', { name: /^Визиты\(\d+\)$/ }),
  requestsTable: page
    .locator('table')
    .filter({ has: page.getByRole('columnheader', { name: 'СТАТУС' }) }),
  requestsRows: page.locator('table tbody tr'),

  /**
   * Иконка `fa-file-signature` в строке заявки: раскрывает карточку согласования.
   * У группы origin_service_director клик отправляет PATCH и получает 403,
   * поэтому прогресс проверяется по появлению состава заявки, а не по сети.
   */
  openApprovalButton: page.getByTitle('Согласовать'),

  /** Иконка `fa-eye` в строке заявки списка «Согласование заявок (N)». */
  openWorkButton: page.getByTitle('Просмотр'),

  /** Раскрытая карточка: состав заявки и перемещения. */
  requisitionComposition: page.getByText(/^Состав заявки \(\d+\)$/),
  /** Чекбокс «Выбрать всех» рядом с подписью. */
  selectAllEmployees: page.locator('input[type="checkbox"]').first(),
  selectedEmployeesCount: page.getByText(/^Выбрано: \d+$/),
  movementTable: page
    .locator('table')
    .filter({ has: page.getByRole('columnheader', { name: 'ТРАНСПОРТ' }) }),

  /** Таблица «Перемещения (N)» в карточке согласования. */
  movementHeading: page.getByText(/^Перемещения \(\d+\)$/),
  compositionHeading: page.getByText(/^Состав заявки \(\d+\)$/),

  /** Модал просмотра заявки, открываемый иконкой `fa-eye`. */
  viewModal: page
    .locator('.fixed.inset-0')
    .filter({ has: page.getByText('Просмотр заявки', { exact: true }) })
    .last(),
  viewModalClose: page.getByRole('button', { name: 'Закрыть' }).last(),

  /** Кнопки решения согласующего: «Согласовано» / «Не согласовано». */
  approveButton: page.locator('button').filter({ hasText: /^Согласовано$/ }),
  rejectButton: page.locator('button').filter({ hasText: /^Не согласовано$/ }),

  /** Блок «История согласования»: список сотрудников и их этапов. */
  approvalHistory: page
    .getByText('История согласования', { exact: true })
    .locator('xpath=ancestor::div[contains(@class,"bg-white")][1]'),
});

export type DistributionRequestsApprovalLocators = ReturnType<
  typeof createDistributionRequestsApprovalLocators
>;
