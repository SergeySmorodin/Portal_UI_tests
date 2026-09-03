import { Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createDistributionRequestsLocators } from '../../../locators/distribution-requests.locators';
import { config } from '../../../config/config';

export interface RequestCommonFields {
  start: string;
  stop: string;
  living: string;
  taxi: string;
  money: string;
  pass: string;
}

export interface MassEditFields {
  date: string;
  transport: string;
}

export const createDistributionRequestsPage = (page: Page) => {
  const basePage = createBasePage(page);
  const PAGE_PATH = '/services/supervision/distribution-requests/select-project';

  const locators = createDistributionRequestsLocators(page);

  const addTicketToVisit = async (visitIndex: number): Promise<void> => {
    await locators
      .visitCardAddTicket(visitIndex)
      .waitFor({ state: 'visible', timeout: config.timeouts.normal });
    await locators.visitCardAddTicket(visitIndex).click();
  };

  const selectMassEditCity = async (label: string, city: string): Promise<void> => {
    await locators.massEditDropdown(label).click();
    await locators.citySearchInput.waitFor({ state: 'visible', timeout: config.timeouts.normal });
    await locators.citySearchInput.fill(city);
    await locators.cityOption(city).waitFor({ state: 'visible', timeout: config.timeouts.long });
    await locators.cityOption(city).click();
  };

  const addTicketsToAllVisits = async (count: number): Promise<void> => {
    for (let i = 0; i < count; i++) {
      await addTicketToVisit(i);
    }
  };

  return {
    ...basePage,
    locators,

    open: async (): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.searchInput);
    },

    findWork: async (name: string): Promise<void> => {
      await locators.searchInput.fill(name);
      await page.waitForLoadState('networkidle').catch(() => {});
      await locators.workButton(name).waitFor({ state: 'visible', timeout: config.timeouts.long });
      await locators.workButton(name).click();
      await page.waitForURL((url) => url.pathname.includes('/distribution-requests/create/'), {
        timeout: config.timeouts.long,
      });
    },

    getVisitsCount: async (): Promise<number> => {
      const text = (await locators.visitsTab.textContent())?.trim() || '';
      const match = text.match(/Визиты\((\d+)\)/);
      return match ? Number(match[1]) : 0;
    },

    getRequestsCount: async (): Promise<number> => {
      const text = (await locators.requestsTab.textContent())?.trim() || '';
      const match = text.match(/Заявки\((\d+)\)/);
      return match ? Number(match[1]) : 0;
    },

    createRequest: async (): Promise<void> => {
      await locators.createRequestButton.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await locators.createRequestButton.click();
    },

    fillRequestCommon: async (fields: RequestCommonFields): Promise<void> => {
      await locators.requestHeaderDate('Старт:').fill(fields.start);
      await locators.requestHeaderDate('Стоп:').fill(fields.stop);
      await locators.requestHeaderSelect('Проживание:').selectOption({ label: fields.living });
      await locators.requestHeaderSelect('Такси:').selectOption({ label: fields.taxi });
      await locators.requestHeaderInput('Денежные:').fill(fields.money);
      await locators.requestHeaderSelect('Пропуск:').selectOption({ label: fields.pass });
    },

    clickNext: async (): Promise<void> => {
      await locators.nextButton.click();
    },

    addTicketToVisit,

    selectMassEditCity,

    addTicketsToAllVisits,

    fillMassEdit: async (fields: MassEditFields): Promise<void> => {
      await locators.massEditDate('Дата:').fill(fields.date);
      await locators.massEditSelect('Транспорт:').selectOption({ label: fields.transport });
    },

    submitForApproval: async (): Promise<void> => {
      await locators.submitForApprovalButton.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await locators.submitForApprovalButton.click();
    },
  };
};

export type DistributionRequestsPage = ReturnType<typeof createDistributionRequestsPage>;
