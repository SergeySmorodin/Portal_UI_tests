import { APIRequestContext, Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createResourcePlanningLocators } from '../../../locators/resource-planning.locators';
import { config } from '../../../config';
import { getWorkCompositionInfo } from '../../../test-data/api/project-api';

export const createResourcePlanningPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/services/supervision/resource-planning';

  const locators = createResourcePlanningLocators(page);

  const openWorkByPkInternal = async (pk: string): Promise<void> => {
    await basePage.openRelative(`${PAGE_PATH}/${pk}`);
    await locators.claimedSection.waitFor({
      state: 'visible',
      timeout: config.timeouts.long,
    });
  };

  const openVisitsManagement = async (): Promise<void> => {
    await basePage.waitForElement(locators.manageVisitsButton);
    await locators.manageVisitsButton.click();
  };

  const saveVisits = async (): Promise<void> => {
    await basePage.waitForElement(locators.saveButton);
    await locators.saveButton.click();
  };

  const waitForCondition = async (
    predicate: () => Promise<boolean>,
    timeout: number
  ): Promise<boolean> => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await predicate()) {
        return true;
      }
      await page.waitForTimeout(500);
    }
    return false;
  };

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

    openWorkByPk: openWorkByPkInternal,

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

    openVisitsManagement,

    saveVisits,

    /**
     * Сохраняет визиты так, чтобы изменение гарантированно зафиксировалось на сервере:
     * сначала дожидается заявленного персонала, затем сохраняет визиты и проверяет их наличие
     * через API, повторяя попытку (с перезагрузкой страницы работы) при сбое.
     */
    saveVisitsPersisted: async (
      request: APIRequestContext,
      workPk: string,
      count: number
    ): Promise<void> => {
      const composition = (): Promise<
        import('../../../test-data/api/project-api').WorkCompositionInfo
      > => getWorkCompositionInfo(request, workPk);

      const personnelCommitted = await waitForCondition(
        async () => (await composition()).personCount >= count,
        config.timeouts.long
      );
      if (!personnelCommitted) {
        throw new Error(
          `Заявленный персонал не зафиксирован на сервере (ожидалось ${count}): ${JSON.stringify(
            await composition()
          )}`
        );
      }

      let attempts = 0;
      while (true) {
        attempts++;
        await openVisitsManagement();
        await saveVisits();

        const info = await composition();
        if (info.visitCount >= count) {
          return;
        }
        if (attempts >= 3) {
          throw new Error(
            `Визиты не сохранились после ${attempts} попыток: ${JSON.stringify(info)}`
          );
        }
        await openWorkByPkInternal(workPk);
      }
    },
  };
};

export type ResourcePlanningPage = ReturnType<typeof createResourcePlanningPage>;
