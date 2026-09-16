import { Page, expect } from '@playwright/test';
import { createBasePage } from '../base-page';
import { createLaborProtectionLocators } from '../../locators/labor-protection.locators';
import { createOtPbBase } from './ot-pb-base';
import { config } from '../../config/config';
import path from 'path';

export const createLaborProtectionPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/OT_PB/LaborProtection';

  const locators = createLaborProtectionLocators(page);

  const laborProtectionPage = {
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
        await laborProtectionPage.selectCategory(category);
      }
    },

    clickReset: async (): Promise<void> => {
      await locators.resetButton.click();
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
      await page.waitForURL('**/LaborProtection/create');
      await basePage.expectVisible(locators.createPageHeading);
    },

    addProtocol: async (): Promise<void> => {
      await basePage.waitForElement(locators.addProtocolButton);
      await locators.addProtocolButton.click();
      await locators.protocolModal.waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    fillProtocolForm: async (
      protocolNumber: string,
      date: string,
      filePath: string
    ): Promise<void> => {
      await locators.protocolNumberInput.fill(protocolNumber);
      await locators.protocolDateInput.fill(date);
      await locators.protocolFileInput.setInputFiles(path.resolve(process.cwd(), filePath));
    },

    saveProtocol: async (): Promise<void> => {
      await basePage.waitForElement(locators.saveProtocolButton);
      await basePage.runAndCheckResponse('/api/safety/sf_protocol/', async () => {
        await locators.saveProtocolButton.click();
      });
    },

    refreshCreatePage: async (): Promise<void> => {
      await basePage.openRelative('/OT_PB/LaborProtection/create');
      await basePage.expectVisible(locators.createPageHeading);
    },

    selectEmployeeProtocol: async (employee: string, protocolNumber: string): Promise<void> => {
      const select = locators.employeeProtocolSelect(employee);
      await basePage.waitForElement(select);
      const option = select.locator('option').filter({ hasText: protocolNumber });
      await option.waitFor({ state: 'attached', timeout: config.timeouts.long });
      const value = await option.getAttribute('value');
      if (!value) {
        throw new Error(`selectEmployeeProtocol: option for "${protocolNumber}" has no value`);
      }
      await select.selectOption(value);
    },

    fillEmployeeCertificate: async (employee: string, number: string): Promise<void> => {
      await basePage.fill(locators.employeeCertificateInput(employee), number);
    },

    fillEmployeeDates: async (employee: string, start: string, end: string): Promise<void> => {
      await basePage.fill(locators.employeeStartDateInput(employee), start);
      await basePage.fill(locators.employeeEndDateInput(employee), end);
    },

    saveCreatePage: async (): Promise<void> => {
      await basePage.waitForElement(locators.createPageSaveButton);
      await basePage.runAndCheckResponse('/api/safety/ot/', async () => {
        await locators.createPageSaveButton.click();
      });
    },

    verifyProtocolInResults: async (employee: string, protocolNumber: string): Promise<void> => {
      const link = locators.protocolLink(employee, protocolNumber);
      await link.waitFor({ state: 'visible', timeout: config.timeouts.long });
      await expect(link).toHaveText(protocolNumber);
    },

    clickProtocolLink: async (employee: string, protocolNumber: string): Promise<void> => {
      const link = locators.protocolLink(employee, protocolNumber);
      await link.waitFor({ state: 'visible', timeout: config.timeouts.long });
      const href = await link.getAttribute('href');
      expect(href).not.toBeNull();
      expect(href).toContain('/media/sf_protocols/');

      const popupPromise = page
        .waitForEvent('popup', { timeout: config.timeouts.short })
        .catch(() => null);
      const mediaResponsePromise = new Promise<import('@playwright/test').Response>((resolve) => {
        const handler = (resp: import('@playwright/test').Response) => {
          if (resp.url().includes('/media/sf_protocols/') && resp.request().method() === 'GET') {
            page.context().off('response', handler);
            resolve(resp);
          }
        };
        page.context().on('response', handler);
      });
      await link.click();

      const popup = await popupPromise;
      const mediaResponse = await mediaResponsePromise;
      expect(mediaResponse.status()).toBe(200);
      expect(mediaResponse.url()).toMatch(/\.pdf$/);
      expect(mediaResponse.headers()['content-type']).toContain('pdf');

      if (popup) {
        await popup.waitForURL('**/media/**', { timeout: config.timeouts.long });
        await popup.close();
      }
    },
  };

  return laborProtectionPage;
};

export type LaborProtectionPage = ReturnType<typeof createLaborProtectionPage>;
