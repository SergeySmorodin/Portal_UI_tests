import { expect, Locator, Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createSkipRequisitionsLocators } from '../../locators/skip-requisitions.locators';
import { config } from '../../config';

export const createSkipRequisitionsPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/SKIP/requisitions';

  const locators = createSkipRequisitionsLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.searchInput);
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    /** Ищет работу в списке заявок СКИП по названию проекта. */
    findWork: async (projectCode: string): Promise<void> => {
      await locators.searchInput.fill(projectCode);
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    /** Количество заявок в заголовке блока «Заявки на обработку (СКИП)». */
    getPendingCount: async (): Promise<number> => {
      const text = (await page.locator('body').innerText()) || '';
      const match = text.match(/Заявки на обработку \(СКИП\) \((\d+)\)/);
      return match ? Number(match[1]) : 0;
    },

    /** Строка списка с названием работы: открывает карточку заявок СКИП. */
    workRow: (workName: string): Locator =>
      locators.workButton(workName).locator('xpath=ancestor::tr'),

    isWorkListed: async (workName: string): Promise<boolean> =>
      locators.workButton(workName).isVisible(),

    getWorkRow: async (workName: string): Promise<string> => {
      const row = locators.workButton(workName).locator('xpath=ancestor::tr');
      return (await row.innerText()).replace(/\s+/g, ' ').trim();
    },

    openWork: async (workName: string): Promise<void> => {
      await locators.workButton(workName).click();
      await page.waitForURL((url) => url.pathname.startsWith(`${PAGE_PATH}/p_`), {
        timeout: config.timeouts.long,
      });
      await locators.newRequestsTab.waitFor({ state: 'visible', timeout: config.timeouts.long });
      await page
        .getByText('Загрузка данных...')
        .waitFor({ state: 'hidden', timeout: config.timeouts.long })
        .catch(() => {});
    },

    /** Заголовок вкладки «Новые(N)» — количество заявок, ожидающих обработки. */
    newRequestsCount: async (): Promise<number> => {
      const text = (await locators.newRequestsTab.textContent())?.trim() || '';
      const match = text.match(/Новые\((\d+)\)/);
      return match ? Number(match[1]) : 0;
    },

    /** Заголовок вкладки «Обработанные(N)» — количество обработанных заявок. */
    processedRequestsCount: async (): Promise<number> => {
      const text = (await locators.processedRequestsTab.textContent())?.trim() || '';
      const match = text.match(/Обработанные\((\d+)\)/);
      return match ? Number(match[1]) : 0;
    },

    openProcessedTab: async (): Promise<void> => {
      await locators.processedRequestsTab.click();
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    /** Строка заявки в таблице «Новые». */
    requestRow: (index: number): Locator => locators.requestsRows.nth(index),

    requestRowStatus: async (index = 0): Promise<string> =>
      ((await locators.requestsRows.nth(index).innerText()) ?? '').replace(/\s+/g, ' ').trim(),

    /**
     * Открывает модал «Действие с заявкой» по кнопке «Взять в работу» в строке
     * и берёт заявку в работу — открывается мастер «Обработка заявки (СКИП)».
     */
    takeRequestIntoWork: async (): Promise<void> => {
      await locators.editRequestButton.first().click();
      await locators.takeIntoWorkButton.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await locators.takeIntoWorkButton.click();
      await locators.processingModal.waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    /** Шаг 1 «Визиты»: корректирует старт/стоп визита у сотрудника по индексу. */
    correctVisitDates: async (index: number, start: string, stop: string): Promise<void> => {
      await locators.visitRowStart(index).fill(start);
      await locators.visitRowStop(index).fill(stop);
    },

    /** Переводит мастер на следующий шаг («Далее»). */
    processingNext: async (): Promise<void> => {
      await locators.processingNextButton.click();
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    /**
     * Шаг 2 «Суточные»: синхронизирует начало периода суточных каждого сотрудника
     * с фактической датой старта командировки, чтобы число дней суточных совпало
     * с числом дней командировки (иначе бэкенд отклоняет завершение с 400).
     */
    alignPerDiemStart: async (start: string): Promise<void> => {
      const inputs = locators.perDiemStartInputs;
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        await inputs.nth(i).fill(start);
      }
      await page.keyboard.press('Tab');
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    /** Возврат на шаг назад в мастере обработки. */
    processingBack: async (): Promise<void> => {
      await locators.processingBackButton.click();
    },

    /**
     * Шаг 3 «Билеты»: завершает обработку. Кнопка «Завершить» открывает
     * подтверждение «После завершения заявка будет доступна только для просмотра»,
     * которое подтверждается кнопкой «Да». Ждёт успешного ответа PATCH заявки.
     */
    finishProcessing: async (): Promise<void> => {
      await locators.processingFinishButton.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await locators.processingFinishButton.click();
      await locators.finishConfirmText.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });

      const finished = page.waitForResponse(
        (response) =>
          response.url().includes('/api/requisition/') && response.request().method() === 'PATCH',
        { timeout: config.timeouts.long }
      );
      await locators.finishConfirmYes.click();

      const response = await finished;
      expect(
        response.status(),
        `Заявка не завершена: ${response.status()} ${await response.text()}`
      ).toBe(200);

      await locators.processingHeading
        .waitFor({ state: 'detached', timeout: config.timeouts.long })
        .catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
    },
  };
};

export type SkipRequisitionsPage = ReturnType<typeof createSkipRequisitionsPage>;
