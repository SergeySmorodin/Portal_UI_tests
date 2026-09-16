import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createMedicalCommissionLocators } from '../../locators/medical-commission.locators';
import { createOtPbBase } from './ot-pb-base';
import { config } from '../../config/config';

export const createMedicalCommissionPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/OT_PB/MedicalCommission';

  const locators = createMedicalCommissionLocators(page);

  const medicalCommissionPage = {
    ...basePage,
    locators,
    ...createOtPbBase(page, basePage, locators),

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectCategory: async (label: string): Promise<void> => {
      const checkbox = locators.categoryCheckbox(label);
      await basePage.waitForElement(checkbox);
      if (!(await checkbox.isChecked())) {
        await checkbox.click();
      }
    },

    selectCategories: async (categories: string[]): Promise<void> => {
      for (const category of categories) {
        await medicalCommissionPage.selectCategory(category);
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
      await page.waitForURL('**/MedicalCommission/create');
      await basePage.expectVisible(locators.createPageHeading);
    },

    fillEmployeeDates: async (
      employee: string,
      startDate: string,
      endDate: string
    ): Promise<void> => {
      await basePage.fill(locators.employeeStartDateInput(employee), startDate);
      await basePage.fill(locators.employeeEndDateInput(employee), endDate);
    },

    saveCreatePage: async (): Promise<void> => {
      await basePage.waitForElement(locators.createPageSaveButton);
      await basePage.runAndCheckResponse('/api/safety/mc/', async () => {
        await locators.createPageSaveButton.click();
      });
    },

    verifyRecordInResults: async (employee: string, issueDateDisplay: string): Promise<void> => {
      const row = locators.recordRow(employee, issueDateDisplay);
      await row.waitFor({ state: 'visible', timeout: config.timeouts.long });
    },
  };

  return medicalCommissionPage;
};

export type MedicalCommissionPage = ReturnType<typeof createMedicalCommissionPage>;
