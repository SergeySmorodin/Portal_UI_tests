import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import {
  createCertificationUploadLocators,
  createCertificationSearchLocators,
} from '../../locators/certification-page.locators';
import { CertificationData } from '../../types';

const TEST_FILE: { name: string; mimeType: string; buffer: Buffer } = {
  name: 'test-document.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('Test certification document'),
};

export const createCertificationUploadPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/certification/upload';

  const locators = createCertificationUploadLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectResourceType: async (resourceType: string): Promise<void> => {
      await locators.resourceTypeSelect.selectOption(resourceType);
    },

    selectDocType: async (docType: string): Promise<void> => {
      await locators.docTypeSelect.selectOption(docType);
    },

    selectStatus: async (status: string): Promise<void> => {
      await locators.statusSelect.selectOption(status);
    },

    fillBasicFields: async (data: CertificationData): Promise<void> => {
      await locators.nameTextarea.fill(data.name);
      await locators.numberInput.fill(data.number);
    },

    setDates: async (data: CertificationData): Promise<void> => {
      await locators.startDateInput.fill(data.startDate);
      await locators.expiryDateInput.fill(data.expiryDate);
      await locators.warningPeriodInput.fill(data.warningPeriod);
    },

    setFile: async (): Promise<void> => {
      await locators.fileInput.setInputFiles(TEST_FILE);
    },

    save: async (): Promise<void> => {
      await locators.submitButton.click();
    },
  };
};

export type CertificationUploadPage = ReturnType<typeof createCertificationUploadPage>;

export const createCertificationSearchPage = (page: Page) => {
  const basePage = createBasePage(page);

  const locators = createCertificationSearchLocators(page);

  return {
    ...basePage,
    locators,

    open: async (resourceType: string): Promise<void> => {
      await basePage.openRelative(`/certification/search?type=${resourceType}`);
      await basePage.expectVisible(locators.heading);
    },

    searchByName: async (name: string): Promise<void> => {
      await basePage.waitForElement(locators.searchInput);
      await locators.searchInput.fill(name);
      await page.waitForLoadState('networkidle').catch(() => {});
    },
  };
};

export type CertificationSearchPage = ReturnType<typeof createCertificationSearchPage>;
