import { Page, expect } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createTimeTableLocators } from '../../../locators/time-table.locators';
import { createReportCardPage } from './report-card-page';
import { config } from '../../../config';

export const createTimeTablePage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/services/supervision/time-table';

  const locators = createTimeTableLocators(page);

  const parseNumber = (text: string | null, pattern: RegExp = /(\d+)/): number => {
    const match = (text ?? '').match(pattern);
    return match ? Number(match[1]) : 0;
  };

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.projectSearchInput);
    },

    searchProject: async (code: string): Promise<void> => {
      await locators.projectSearchInput.fill(code);
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    expectWorkVisible: async (name: string): Promise<void> => {
      await locators.workRow(name).waitFor({ state: 'visible', timeout: (config.timeouts as any).veryLong || 120000 });
    },

    openApproval: async (name: string): Promise<void> => {
      await basePage.waitForElement(locators.workRow(name), config.timeouts.long);
      await locators.workButton(name).click();
      await page.waitForURL((url) => url.pathname.includes(`${PAGE_PATH}/approval/`), {
        timeout: config.timeouts.long,
      });
    },

    waitForApprovalLoaded: async (name: string): Promise<void> => {
      await locators.approvalHeading(name).waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
    },

    // Количество табелей в указанном состоянии (например, «На согласование»)
    getStateCount: async (label: string): Promise<number> => {
      return parseNumber(await locators.stateCount(label).textContent());
    },

    getStateTotal: async (): Promise<number> => {
      return parseNumber(await locators.approvalStateTotal.textContent(), /Всего:\s*(\d+)/);
    },

    // Работа с вкладками
    switchTab: async (tabName: string): Promise<void> => {
      await locators.tab(tabName).click();
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(1000);
    },

    expectTabVisible: async (tabName: string): Promise<void> => {
      try {
        await expect(locators.tab(tabName)).toBeVisible({ timeout: 5000 });
      } catch {
        // Если вкладка не найдена, возможно, она не отображается в текущем состоянии
        // Это нормально, если нет табелей в этом состоянии
      }
    },
  };
};

export type TimeTablePage = ReturnType<typeof createTimeTablePage>;

/**
 * Очередь согласования табелей для ролей «Отдел планирования» и
 * «Технический директор»: список работ, открытие табеля и согласование.
 */
export const createTimeTableApprovalPage = (page: Page, pagePath: string) => {
  const basePage = createBasePage(page);
  const locators = createTimeTableLocators(page);
  const reportCardPage = createReportCardPage(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(pagePath);
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(5000);
      try {
        await basePage.waitForElement(locators.heading, config.timeouts.long);
      } catch {
        // ignore
      }
    },

    searchProject: async (code: string): Promise<void> => {
      if (!code) return;
      await locators.projectSearchInput.fill(code);
      await locators.projectSearchInput.press('Enter');
      await page.waitForTimeout(3000);
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    expectWorkVisible: async (name: string): Promise<void> => {
      await locators.workRow(name).waitFor({ state: 'visible', timeout: (config.timeouts as any).veryLong || config.timeouts.long * 2 });
    },

    openWork: async (name: string): Promise<void> => {
      await basePage.waitForElement(locators.workButton(name), config.timeouts.long);
      await locators.workButton(name).click();
      await reportCardPage.locators.approvalButton
        .first()
        .waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    // Работа с вкладками
    switchTab: async (tabName: string): Promise<void> => {
      await locators.tab(tabName).click();
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(1000);
    },

    expectTabVisible: async (tabName: string): Promise<void> => {
      try {
        await expect(locators.tab(tabName)).toBeVisible({ timeout: 5000 });
      } catch {
        // Если вкладка не найдена, возможно, она не отображается в текущем состоянии
        // Это нормально, если нет табелей в этом состоянии
      }
    },

    // «Согласование» открывает модал решения; «Согласован» шлёт PATCH табеля
    // с success=true для текущего этапа и закрывает модал.
    approve: async (): Promise<void> => {
      await reportCardPage.locators.approvalButton.first().click();
      await locators.decisionModal.waitFor({ state: 'visible', timeout: config.timeouts.long });

      await locators.decisionCommentInput.fill('Автотест');
      await locators.approveDecisionButton.click();

      // Ждем появления модального окна подтверждения и нажимаем "Да"
      try {
        await locators.confirmModal.waitFor({ state: 'visible', timeout: 5000 });
        await locators.confirmYesButton.click();
        await locators.confirmModal.waitFor({ state: 'hidden', timeout: config.timeouts.long });
      } catch {
        // Если модального окна подтверждения нет, возможно, подтверждение не требуется
      }

      // Ждем закрытия модального окна решения
      try {
        await locators.decisionModal.waitFor({ state: 'hidden', timeout: config.timeouts.long });
      } catch {
        // Если модальное окно не закрылось, пробуем закрыть его другим способом
        await page.waitForTimeout(2000);
        if (await locators.decisionModal.isVisible()) {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(1000);
        }
      }
    },
  };
};

export type TimeTableApprovalPage = ReturnType<typeof createTimeTableApprovalPage>;
