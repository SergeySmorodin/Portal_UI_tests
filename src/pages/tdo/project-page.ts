import { Page } from '@playwright/test';
import { createBasePage } from '../base-page';
import {
  createProjectPageLocators,
  createProjectsListLocators,
} from '../../locators/project-page.locators';
import { ProjectData } from '../../types';
import { config } from '../../config/config';

export const createProjectPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/TDO/Project/new';

  const locators = createProjectPageLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    selectRandomStatus: async (): Promise<string> => {
      return basePage.selectRandomOption(locators.statusSelect);
    },

    selectStatus: async (statusValue: string): Promise<string> => {
      await locators.statusSelect.selectOption(statusValue);
      return statusValue;
    },

    selectRandomGroupProject: async (): Promise<string> => {
      return basePage.selectRandomOption(locators.groupProjectSelect);
    },

    selectRandomTypeProject: async (): Promise<string> => {
      return basePage.selectRandomOption(locators.typeProjectSelect);
    },

    selectRandomDepartment: async (): Promise<string> => {
      return basePage.selectRandomOption(locators.departmentProjectSelect);
    },

    selectRandomKindProject: async (): Promise<string> => {
      return basePage.selectRandomOption(locators.kindProjectSelect);
    },

    fillBasicFields: async (data: ProjectData): Promise<void> => {
      await locators.codeInput.fill(data.code);
      await locators.startDateInput.fill(data.startDate);
      await locators.stopDateInput.fill(data.stopDate);
      await locators.noteTextarea.fill(data.note);
    },

    save: async (): Promise<void> => {
      await locators.saveButton.click();
    },
  };
};

export const createProjectsListPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/TDO/Projects';

  const locators = createProjectsListLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.heading);
    },

    searchByCode: async (code: string): Promise<void> => {
      await basePage.waitForElement(locators.searchInput);
      await locators.searchInput.fill(code);
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    openWorks: async (code: string): Promise<void> => {
      await basePage.waitForElement(locators.worksButton(code));
      await locators.worksButton(code).click();
      await page.waitForURL((url) => url.pathname.includes('/TDO/Works'), {
        timeout: config.timeouts.long,
      });
    },
  };
};

export type ProjectPage = ReturnType<typeof createProjectPage>;
export type ProjectsListPage = ReturnType<typeof createProjectsListPage>;
