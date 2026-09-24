import { Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createEmployeeTimelineLocators } from '../../../locators/employee-timeline.locators';
import { config } from '../../../config';

export const createEmployeeTimelinePage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/services/supervision/employee-timeline';

  const locators = createEmployeeTimelineLocators(page);

  const waitForDataLoaded = async (): Promise<void> => {
    const loading = page.getByText('Загрузка данных...');
    try {
      await loading.waitFor({ state: 'detached', timeout: config.timeouts.long });
    } catch {
      // Если индикатор уже исчез — считаем данные загруженными
    }
  };

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await waitForDataLoaded();
      await basePage.expectVisible(locators.employeeNameInput);
    },

    setPeriod: async (from: string, to: string): Promise<void> => {
      await locators.periodFromInput.fill(from);
      await page.waitForLoadState('networkidle').catch(() => {});
      await locators.periodToInput.fill(to);
      await waitForDataLoaded();
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    searchEmployee: async (name: string): Promise<void> => {
      await locators.employeeNameInput.fill(name);
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    expectEmployeeVisible: async (name: string): Promise<void> => {
      await locators.employeeRow(name).waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    expectPlannedVisitVisible: async (projectCode: string): Promise<void> => {
      await locators
        .plannedVisitRow(projectCode)
        .waitFor({ state: 'visible', timeout: config.timeouts.long });
    },
  };
};

export type EmployeeTimelinePage = ReturnType<typeof createEmployeeTimelinePage>;
