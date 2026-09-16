import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createIndustrialSafetyLocators } from '../../locators/industrial-safety.locators';
import { createOtPbBase } from './ot-pb-base';
import { config } from '../../config/config';

export const createIndustrialSafetyPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/OT_PB/IndustrialSafety';

  const locators = createIndustrialSafetyLocators(page);

  const industrialSafetyPage = {
    ...basePage,
    locators,
    ...createOtPbBase(page, basePage, locators),

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectCategories: async (): Promise<void> => {
      await basePage.waitForElement(locators.selectAllCheckbox);
      if (!(await locators.selectAllCheckbox.isChecked())) {
        await locators.selectAllCheckbox.click();
      }
    },

    selectRandomEmployee: async (): Promise<string> => {
      await locators.employeeCheckboxes
        .first()
        .waitFor({ state: 'visible', timeout: config.timeouts.long });
      const count = await locators.employeeCheckboxes.count();
      if (count === 0) {
        throw new Error('selectRandomEmployee: no employee checkboxes found');
      }
      const randomIndex = Math.floor(Math.random() * count);
      const checkbox = locators.employeeCheckboxes.nth(randomIndex);
      const row = checkbox.locator('xpath=ancestor::tr[1]');
      await checkbox.click();
      const surname = await row.locator('td').nth(1).textContent();
      return surname?.trim() || '';
    },

    clickCreateRecord: async (): Promise<void> => {
      await basePage.waitForElement(locators.createRecordButton);
      await locators.createRecordButton.click();
      await page.waitForURL('**/IndustrialSafety/create');
      await basePage.expectVisible(locators.createPageHeading);
    },

    fillEmployeeRecord: async (
      employee: string,
      protocolNumber: string,
      startDate: string,
      endDate: string,
      area: string
    ): Promise<void> => {
      await basePage.fill(locators.employeeProtocolInput(employee), protocolNumber);
      await basePage.fill(locators.employeeStartDateInput(employee), startDate);
      await basePage.fill(locators.employeeEndDateInput(employee), endDate);
      await locators.areaSelect.selectOption(area);
    },

    saveCreatePage: async (): Promise<void> => {
      await basePage.waitForElement(locators.createPageSaveButton);
      await basePage.runAndCheckResponse('/api/safety/pb/', async () => {
        await locators.createPageSaveButton.click();
      });
    },

    verifyRecordInResults: async (employee: string, protocolNumber: string): Promise<void> => {
      const row = locators.recordRow(employee, protocolNumber);
      await row.waitFor({ state: 'visible', timeout: config.timeouts.long });
    },
  };

  return industrialSafetyPage;
};

export type IndustrialSafetyPage = ReturnType<typeof createIndustrialSafetyPage>;
