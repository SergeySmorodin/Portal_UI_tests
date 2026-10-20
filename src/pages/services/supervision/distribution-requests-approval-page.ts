import { expect, Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createDistributionRequestsApprovalLocators } from '../../../locators/distribution-requests-approval.locators';
import { config } from '../../../config';

export const createDistributionRequestsApprovalPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/services/supervision/distribution-requests/approval';

  const locators = createDistributionRequestsApprovalLocators(page);

  const expand = async (): Promise<void> => {
    const tab = locators.requestsTab;
    if ((await tab.count()) > 0 && (await tab.first().isVisible())) {
      await tab.first().click();
    }
    await locators.requestsTable
      .first()
      .waitFor({ state: 'visible', timeout: config.timeouts.long })
      .catch(() => {});

    const action = locators.openApprovalButton.or(locators.openWorkButton);
    await action.first().waitFor({ state: 'visible', timeout: config.timeouts.long });
    await action.first().click();
  };

  return {
    ...basePage,
    locators,

    /**
     * Открывает карточку согласования заявки по работе.
     *
     * Список заявок у директора (`/services/supervision/distribution-requests/list`)
     * пуст, поэтому заявка открывается напрямую по pk работы.
     */
    openWork: async (workPk: string): Promise<void> => {
      await basePage.openRelative(`${PAGE_PATH}/${workPk}`);
      await locators.requestsHeading.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    /** Сводка по заявке: «Сотрудников: N Визитов: N Билетов: N». */
    getSummary: async (): Promise<string> =>
      ((await locators.summary.innerText()) ?? '').replace(/\s+/g, ' ').trim(),

    /**
     * Статус заявки из таблицы «Заявки(N)».
     *
     * Индекс колонки берётся из заголовка «СТАТУС»: у строки есть ячейки
     * «№», «ФИО СОЗДАТЕЛЯ», «ДАТА СОЗДАНИЯ», «СТАТУС» и «КОММЕНТАРИЙ»,
     * поэтому жёстко заданный номер td указывал бы на дату.
     */
    requestRowStatus: async (): Promise<string> => {
      const column = await locators.requestsTable
        .locator('thead th')
        .evaluateAll((headers) =>
          headers.findIndex((h) => (h.textContent ?? '').trim().toUpperCase() === 'СТАТУС')
        );

      if (column < 0) {
        throw new Error('В таблице заявок нет колонки «СТАТУС»');
      }

      const cell = locators.requestsTable.locator('tbody tr').first().locator('td').nth(column);
      return ((await cell.innerText()) ?? '').trim();
    },

    /**
     * Раскрывает карточку согласования по строке заявки.
     *
     * По умолчанию открыта вкладка «Визиты», строка заявки живёт на вкладке
     * «Заявки(N)», поэтому вкладка переключается, если она есть.
     * Иконка с `title="Согласовать"` только раскрывает блок «Состав заявки»;
     * само решение принимается кнопкой «Согласовано» внизу раскрытой карточки.
     */
    openRequisitionCard: async (): Promise<void> => {
      await expand();
      await locators.requisitionComposition.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
    },

    /** Повторно раскрывает карточку согласования (после сворачивания). */
    ensureCardExpanded: expand,

    /** Выбирает всех сотрудников заявки согласующим. */
    selectAllEmployees: async (): Promise<void> => {
      await locators.selectAllEmployees.click();
      await locators.selectedEmployeesCount.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
    },

    /**
     * Согласовывает заявку и возвращает HTTP-статус ответа `PATCH /api/requisition/<pk>/`.
     * Статус нужен тесту: сервер отвечает 200, но может не зафиксировать решение.
     */
    approve: async (): Promise<number> => {
      const response = page.waitForResponse(
        (r) => r.url().includes('/api/requisition/') && r.request().method() === 'PATCH',
        { timeout: config.timeouts.long }
      );
      await locators.approveButton.first().click();
      return (await response).status();
    },

    /** Текст блока «История согласования» — этап и состояние каждого сотрудника. */
    getApprovalHistory: async (): Promise<string> => {
      const history = locators.approvalHistory;
      if (!(await history.isVisible().catch(() => false))) {
        await expand();
      }
      await history.waitFor({ state: 'visible', timeout: config.timeouts.long });
      return (await history.innerText()).replace(/\s+/g, ' ').trim();
    },

    /**
     * Открывает список «Согласование заявок (N)», ищет работу по названию
     * и через иконку `fa-eye` открывает карточку согласования.
     */
    findAndOpenWork: async (workName: string): Promise<void> => {
      await basePage.openRelative('/services/supervision/distribution-requests/list');
      const search = page.getByPlaceholder('Название проекта...');
      await search.waitFor({ state: 'visible', timeout: config.timeouts.long });
      await search.fill(workName);
      await page.waitForLoadState('networkidle').catch(() => {});
      const workButton = page.getByRole('button', { name: workName }).first();
      await workButton.waitFor({ state: 'visible', timeout: config.timeouts.long });
      await workButton.click();
      await page.waitForURL((url) => url.pathname.includes('/distribution-requests/approval/'), {
        timeout: config.timeouts.long,
      });
      await locators.requestsHeading.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    /** Статус первой заявки из списка «Согласование заявок» (до открытия карточки). */
    listRowStatus: async (workName: string): Promise<string> => {
      const table = page
        .locator('table')
        .filter({ has: page.getByRole('button', { name: workName }) });
      const column = await table
        .locator('thead th')
        .evaluateAll((headers) =>
          headers.findIndex((h) => (h.textContent ?? '').trim().toUpperCase() === 'СТАТУС')
        );
      if (column < 0) {
        throw new Error('В списке согласования нет колонки «СТАТУС»');
      }
      const cell = table.locator('tbody tr').first().locator('td').nth(column);
      return ((await cell.innerText()) ?? '').trim();
    },

    /** Текст раскрытой карточки: состав заявки и перемещения (маршруты). */
    getCompositionAndMovement: async (): Promise<string> =>
      ((await locators.movementTable.innerText()) ?? '').replace(/\s+/g, ' ').trim(),

    /**
     * Открывает карточку заявки по иконке `fa-eye` (`title="Просмотр"`) и
     * возвращает текст модала «Просмотр заявки» (состав, перемещения, согласование).
     */
    openRequestView: async (): Promise<string> => {
      await locators.openWorkButton.first().click();
      await locators.viewModal.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await expect(locators.viewModal)
        .not.toContainText('Загрузка данных', { timeout: config.timeouts.long })
        .catch(() => {});
      return ((await locators.viewModal.innerText()) ?? '').replace(/\s+/g, ' ').trim();
    },

    closeRequestView: async (): Promise<void> => {
      await locators.viewModalClose.click();
      await locators.viewModal
        .waitFor({ state: 'hidden', timeout: config.timeouts.long })
        .catch(() => {});
    },
  };
};

export type DistributionRequestsApprovalPage = ReturnType<
  typeof createDistributionRequestsApprovalPage
>;
