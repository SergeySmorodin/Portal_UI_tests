import { APIRequestContext, Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createResourcePlanningLocators } from '../../../locators/resource-planning.locators';
import { config } from '../../../config';
import {
  getWorkCompositionInfo,
  WorkCompositionInfo,
} from '../../../test-data/api/project-api';

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

  const addAvailableWorkersInternal = async (count: number): Promise<string[]> => {
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

    addAvailableWorkers: addAvailableWorkersInternal,

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
     * открывает «Управление визитами», сохраняет и проверяет наличие заявленного
     * персонала и визитов через API, повторяя попытку при сбое.
     *
     * Важно: добавление доступных работников меняет только состояние UI, на сервере
     * персонал появляется лишь после сохранения, поэтому дожидаться его до `saveVisits`
     * нельзя.
     */
    saveVisitsPersisted: async (
      request: APIRequestContext,
      workPk: string,
      count: number
    ): Promise<void> => {
      const composition = (): Promise<WorkCompositionInfo> =>
        getWorkCompositionInfo(request, workPk);

      const savedOnServer = async (): Promise<boolean> => {
        const info = await composition();
        return info.personCount >= count && info.visitCount >= count;
      };

      let attempts = 0;
      while (true) {
        attempts++;
        await openVisitsManagement();
        await saveVisits();

        if (await waitForCondition(savedOnServer, config.timeouts.long)) {
          return;
        }
        if (attempts >= 3) {
          throw new Error(
            `Заявленный персонал и визиты не зафиксированы после ${attempts} попыток: ${JSON.stringify(
              await composition()
            )}`
          );
        }

        // Перезагрузка сбрасывает локально добавленных работников —
        // добавляем недостающих заново и пробуем сохранить ещё раз.
        await openWorkByPkInternal(workPk);
        const missing = count - (await composition()).personCount;
        if (missing > 0) {
          await addAvailableWorkersInternal(missing);
        }
      }
    },
  };
};

export type ResourcePlanningPage = ReturnType<typeof createResourcePlanningPage>;
