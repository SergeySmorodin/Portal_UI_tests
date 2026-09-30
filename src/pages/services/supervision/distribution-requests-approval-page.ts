import { Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createDistributionRequestsApprovalLocators } from '../../../locators/distribution-requests-approval.locators';
import { config } from '../../../config';

export const createDistributionRequestsApprovalPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/services/supervision/distribution-requests/approval';

  const locators = createDistributionRequestsApprovalLocators(page);

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
     * Иконка с `title="Согласовать"` только раскрывает блок «Состав заявки»;
     * само решение принимается кнопкой «Согласовано» внизу раскрытой карточки.
     */
    openRequisitionCard: async (): Promise<void> => {
      await locators.openApprovalButton.first().click();
      await locators.requisitionComposition.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
    },

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
    getApprovalHistory: async (): Promise<string> =>
      (await locators.approvalHistory.innerText()).replace(/\s+/g, ' ').trim(),
  };
};

export type DistributionRequestsApprovalPage = ReturnType<
  typeof createDistributionRequestsApprovalPage
>;
