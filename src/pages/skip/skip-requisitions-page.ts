import { Locator, Page } from '@playwright/test';
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
    },
  };
};

export type SkipRequisitionsPage = ReturnType<typeof createSkipRequisitionsPage>;
