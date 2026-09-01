import { Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createResourcePlanningLocators } from '../../../locators/resource-planning.locators';
import { config } from '../../../config/config';

export const createResourcePlanningPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/services/supervision/resource-planning';

  const locators = createResourcePlanningLocators(page);

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.searchInput);
    },

    searchWork: async (name: string): Promise<void> => {
      await locators.searchInput.fill(name);
      await page.waitForLoadState('networkidle').catch(() => {});
    },

    openWork: async (name: string): Promise<void> => {
      await basePage.waitForElement(locators.workCard(name), config.timeouts.long);
      await locators.workCard(name).click();
      await page.waitForURL((url) => url.pathname.includes(`${PAGE_PATH}/`), {
        timeout: config.timeouts.long,
      });
      await locators.availableAddButton(0).waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
    },

    addAvailableWorkers: async (count: number): Promise<string[]> => {
      await locators.availableAddButton(0).waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      const total = await locators.availableAddButtons.count();
      if (total < count) {
        throw new Error(
          `Доступно только ${total} доступных работников, а запрошено добавить ${count}`
        );
      }

      const added: string[] = [];
      for (let i = 0; i < count; i++) {
        const name = (await locators.availablePersonName(i).textContent())?.trim() || '';
        await locators.availableAddButton(i).click();
        added.push(name);
        await page.waitForLoadState('networkidle').catch(() => {});
      }
      return added;
    },

    getClaimedPersonnelCount: async (): Promise<string> => {
      return (await locators.claimedCount.textContent())?.trim() || '';
    },

    assertClaimedContains: async (names: string[]): Promise<void> => {
      for (const name of names) {
        await locators
          .claimedPerson(name)
          .waitFor({ state: 'visible', timeout: config.timeouts.normal });
      }
    },

    openVisitsManagement: async (): Promise<void> => {
      await basePage.waitForElement(locators.manageVisitsButton);
      await locators.manageVisitsButton.click();
    },

    saveVisits: async (): Promise<void> => {
      await basePage.waitForElement(locators.saveButton);
      await locators.saveButton.click();
    },
  };
};

export type ResourcePlanningPage = ReturnType<typeof createResourcePlanningPage>;
