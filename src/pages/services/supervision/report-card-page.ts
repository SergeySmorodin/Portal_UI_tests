import { expect } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createReportCardLocators } from '../../../locators/report-card.locators';
import { config } from '../../../config';
import { api } from '../../../test-data/api/api-handles';
import { resolvePage, type PageSource } from '../../page-source';

/**
 * Значения по умолчанию для заполнения табеля: стоимость часа, часы в день
 * и дни, за которые эти часы вносятся (первые три дня визита).
 *
 * Ожидаемые итоги считаются из них же, поэтому в тестах не нужно повторять
 * магические «24» и «12000».
 */
export const REPORT_CARD_FILL = {
  rate: '500',
  hoursPerDay: '8',
  dayIndexes: [0, 1, 2],
} as const;

/** Параметры заполнения табеля; не заданные поля берутся из REPORT_CARD_FILL. */
export interface ReportCardFill {
  /** Стоимость часа. */
  rate?: string;
  /** Часы в день. */
  hoursPerDay?: string;
  /** Индексы дней, за которые вносятся часы. */
  dayIndexes?: readonly number[];
}

export const createReportCardPage = (source: PageSource) => {
  const page = resolvePage(source);
  const basePage = createBasePage(page);
  const locators = createReportCardLocators(page);

  const lastCellValue = async (name: string, offsetFromEnd: number): Promise<string> => {
    const cells = locators.workerDayCells(name);
    const count = await cells.count();
    return (await cells.nth(count - offsetFromEnd).textContent())?.trim() || '';
  };

  const fillRate = async (name: string, value: string): Promise<void> => {
    await locators.workerRateInput(name).fill(value);
  };

  const fillWorkHours = async (
    name: string,
    dayIndexes: readonly number[],
    value: string
  ): Promise<void> => {
    for (const dayIndex of dayIndexes) {
      await locators.workerDayInput(name, dayIndex).fill(value);
    }
  };

  return {
    ...basePage,
    locators,

    open: async (workPk: string): Promise<void> => {
      await basePage.openRelative(`/services/supervision/project/${workPk}/reportcard`);
    },

    getHeading: async (): Promise<string> => {
      return (await locators.heading.textContent())?.trim() || '';
    },

    waitForLoaded: async (workName: string): Promise<void> => {
      await locators
        .headingTab(workName)
        .waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    getWorkerNames: async (): Promise<string[]> => {
      const count = await locators.workerRows.count();
      const names: string[] = [];
      for (let i = 0; i < count; i++) {
        const text = (await locators.workerRows.nth(i).textContent())?.trim() || '';
        names.push(text);
      }
      return names;
    },

    getWorkerCount: async (): Promise<number> => {
      return await locators.workerRows.count();
    },

    expectWorkerVisible: async (name: string): Promise<void> => {
      await locators
        .workerRow(name)
        .first()
        .waitFor({ state: 'visible', timeout: config.timeouts.normal });
    },

    openRateRows: async (): Promise<void> => {
      await locators.rateRowsButton.click();
    },

    selectAllRows: async (): Promise<void> => {
      const checkbox = locators.headerCheckbox;
      if (await checkbox.count()) {
        await checkbox
          .first()
          .check()
          .catch(async () => {
            await checkbox.first().click();
          });
      }
    },

    getRateInputValue: async (name: string): Promise<string> => {
      return await locators.workerRateInput(name).inputValue();
    },

    fillRate,

    fillWorkHours,

    /** Заполняет ставку всем сотрудникам и проверяет, что портал её принял. */
    fillRateFor: async (workers: string[], rate: string = REPORT_CARD_FILL.rate): Promise<void> => {
      for (const name of workers) {
        await fillRate(name, rate);
        await expect(locators.workerRateInput(name)).toHaveValue(rate);
      }
    },

    /** Заполняет часы всем сотрудникам за указанные дни (по умолчанию — первые три). */
    fillHoursFor: async (
      workers: string[],
      {
        hoursPerDay = REPORT_CARD_FILL.hoursPerDay,
        dayIndexes = REPORT_CARD_FILL.dayIndexes,
      }: ReportCardFill = {}
    ): Promise<void> => {
      for (const name of workers) {
        await fillWorkHours(name, dayIndexes, hoursPerDay);
      }
    },

    /**
     * Проверяет итоги табеля по тем же параметрам, которыми его заполняли:
     * сумма часов = часы в день × количество дней,
     * сумма денег = ставка × сумма часов.
     */
    expectTotals: async (
      workers: string[],
      {
        rate = REPORT_CARD_FILL.rate,
        hoursPerDay = REPORT_CARD_FILL.hoursPerDay,
        dayIndexes = REPORT_CARD_FILL.dayIndexes,
      }: ReportCardFill = {}
    ): Promise<void> => {
      const hours = String(Number(hoursPerDay) * dayIndexes.length);
      const sum = String(Number(rate) * Number(hours));
      for (const name of workers) {
        await expect.poll(() => lastCellValue(name, 2)).toBe(hours);
        await expect.poll(() => lastCellValue(name, 1)).toBe(sum);
      }
    },

    getHours: async (name: string): Promise<string> => {
      return await lastCellValue(name, 2);
    },

    getSum: async (name: string): Promise<string> => {
      return await lastCellValue(name, 1);
    },

    // Сохранение шлёт PATCH /api/project_report_card/<pk>/ и затем перезагружает
    // табель (GET). Дожидаемся завершения обоих запросов, иначе последующий
    // ререндер страницы «отцепляет» открытую модалку согласования.
    save: async (): Promise<void> => {
      const patched = page.waitForResponse(
        (resp) =>
          resp.url().includes(api.reportCard) && resp.request().method() === 'PATCH' && resp.ok(),
        { timeout: config.timeouts.long }
      );

      await locators.saveButton.click();
      await patched;
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    openApproval: async (): Promise<void> => {
      const button = locators.approvalButton;
      await button.waitFor({ state: 'visible', timeout: config.timeouts.long });
      const enabled = await button.isEnabled();
      if (!enabled) {
        throw new Error(
          `Кнопка согласования недоступна: ${(await button.getAttribute('title')) ?? ''}`
        );
      }
      await button.click();
      await locators.approvalModal.waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    submitApproval: async (periodEnd: string): Promise<void> => {
      await locators.approvalPeriodEndInput.fill(periodEnd);
      // Календарь react-datepicker перекрывает кнопку отправки — закрываем его.
      await page.keyboard.press('Escape');
      await locators.approvalSubmitButton.click();
      await locators.approvalModal.waitFor({ state: 'hidden', timeout: config.timeouts.long });
    },

    expectApprovalStagesVisible: async (titles: string[]): Promise<void> => {
      for (const title of titles) {
        await locators
          .approvalStageIcon(title)
          .first()
          .waitFor({ state: 'visible', timeout: config.timeouts.long });
      }
    },

    getPeriodsCount: async (): Promise<number> => {
      const text = (await locators.periodsCount.textContent())?.trim() || '';
      const match = text.match(/Периодов:\s*(\d+)/);
      return match ? Number(match[1]) : 0;
    },
  };
};

export type ReportCardPage = ReturnType<typeof createReportCardPage>;
