import { expect, Page } from '@playwright/test';
import { createBasePage } from '../../base-page';
import { createDistributionRequestsLocators } from '../../../locators/distribution-requests.locators';
import { config } from '../../../config';

export interface CommonFields {
  living: string;
  taxi: string;
  money: string;
  pass: string;
}

export interface RequestCommonFields extends CommonFields {
  start: string;
  stop: string;
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

    openRequestsTab: async (): Promise<void> => {
      await locators.requestsTab.waitFor({ state: 'visible', timeout: config.timeouts.long });
      await locators.requestsTab.click();
    },

    /**
     * На вкладке «Заявки» открывает модал «Просмотр заявки» по кнопке `fa-eye`
     * и возвращает его текст (состав, перемещения, история согласования).
     */
    openRequestView: async (): Promise<string> => {
      await locators.requestsTable.waitFor({ state: 'visible', timeout: config.timeouts.long });
      await locators.viewRequestButton.first().click();
      await locators.requestViewModal.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await expect(locators.requestViewModal)
        .not.toContainText('Загрузка данных', { timeout: config.timeouts.long })
        .catch(() => {});
      return ((await locators.requestViewModal.innerText()) ?? '').replace(/\s+/g, ' ').trim();
    },

    closeRequestView: async (): Promise<void> => {
      await page.getByRole('button', { name: 'Закрыть' }).last().click();
      await locators.requestViewModal
        .waitFor({ state: 'hidden', timeout: config.timeouts.long })
        .catch(() => {});
    },

    getRequestsRowsCount: async (): Promise<number> => {
      await locators.requestsTable.waitFor({ state: 'visible', timeout: config.timeouts.long });
      return locators.requestsTable
        .locator('tbody tr')
        .filter({ hasNotText: 'Нет поданных заявок' })
        .count();
    },

    markVisitsAsLocalTrip: async (): Promise<void> => {
      const boxes = locators.visitLocalTripCheckboxes;
      const count = await boxes.count();
      for (let i = 0; i < count; i++) {
        if (!(await boxes.nth(i).isChecked())) {
          await boxes.nth(i).check();
        }
      }
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

    /**
     * Шаг «Перемещение»: добавляет каждому сотруднику строку маршрута кнопкой
     * «+ Добавить всем». Если кнопка недоступна (уже есть билеты), добавляет
     * билеты по одной карточке визита — как делает `addTicketsToAllVisits`.
     */
    addRoutesToAll: async (count: number): Promise<void> => {
      const addAll = locators.addTicketToAllButton;
      if ((await addAll.count()) > 0 && (await addAll.first().isVisible())) {
        await addAll.first().click();
        return;
      }
      await addTicketsToAllVisits(count);
    },

    /** Добавляет дополнительный билет первому сотруднику («сложный» маршрут). */
    addExtraTicketToFirst: async (): Promise<void> => {
      await addTicketToVisit(0);
    },

    fillMassEdit: async (fields: MassEditFields): Promise<void> => {
      await locators.massEditDate('Дата:').fill(fields.date);
      await locators.massEditSelect('Транспорт:').selectOption({ label: fields.transport });
    },

    openDemobilization: async (): Promise<void> => {
      await locators.demobilizationButton.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await locators.demobilizationButton.click();
      await locators.nextButton.waitFor({ state: 'visible', timeout: config.timeouts.long });
      await locators.backButton.waitFor({ state: 'visible', timeout: config.timeouts.long });
    },

    backToCompositionStep: async (): Promise<void> => {
      await locators.backButton.click();
      await locators.requestHeaderSelect('Денежные:').waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
    },

    fillDemobilizationCommon: async (fields: RequestCommonFields): Promise<void> => {
      await locators.requestHeaderSelect('Проживание:').selectOption({ label: fields.living });
      await locators.requestHeaderSelect('Такси:').selectOption({ label: fields.taxi });
      await locators.requestHeaderInput('Денежные:').fill(fields.money);
      await locators.requestHeaderSelect('Пропуск:').selectOption({ label: fields.pass });
    },

    fillVisitMoney: async (value: string): Promise<void> => {
      const inputs = locators.visitMoneyInputs;
      await inputs.first().waitFor({ state: 'visible', timeout: config.timeouts.long });

      // Отбираем инпуты, у которых value содержит маркер несогласованной заявки
      const handles = await inputs.evaluateAll((els) =>
        els
          .map((el, index) => ({ index, value: (el as HTMLInputElement).value }))
          .filter(({ value }) => /не согласована|Последняя поданная заявка/.test(value))
          .map(({ index }) => index)
      );

      for (const index of handles) {
        await inputs.nth(index).fill(value);
      }
    },

    submitForApproval: async (): Promise<void> => {
      await locators.submitForApprovalButton.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await locators.submitForApprovalButton.click();
    },

    // Полный прогон подачи заявки на командировку (местные командировки без билетов)
    // — единая точка для основного вызова и повторной попытки при сбое.
    submitRequestForLocalTrip: async (workName: string): Promise<void> => {
      await basePage.openRelative(PAGE_PATH);
      await basePage.expectVisible(locators.searchInput);
      await locators.searchInput.fill(workName);
      await page.waitForLoadState('networkidle').catch(() => {});
      await locators.workButton(workName).waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await locators.workButton(workName).click();
      await page.waitForURL((url) => url.pathname.includes('/distribution-requests/create/'), {
        timeout: config.timeouts.long,
      });

      await locators.createRequestButton.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await locators.createRequestButton.click();

      const boxes = locators.visitLocalTripCheckboxes;
      const count = await boxes.count();
      for (let i = 0; i < count; i++) {
        if (!(await boxes.nth(i).isChecked())) {
          await boxes.nth(i).check();
        }
      }

      await locators.nextButton.click();
      await locators.submitForApprovalButton.waitFor({
        state: 'visible',
        timeout: config.timeouts.long,
      });
      await locators.submitForApprovalButton.click();
    },
  };
};

export type DistributionRequestsPage = ReturnType<typeof createDistributionRequestsPage>;
