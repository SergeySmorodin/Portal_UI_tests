import { test, expect, type TestFixtures } from '../../fixtures/test-fixtures';
import type { OtPbPageApi } from '../../pages/ot-pb/ot-pb-base';

interface OtPbTestConfig {
  name: string;
  headingText: string;
  openStep: string;
  categories: string[];
}

type OtPbFix = Pick<
  TestFixtures,
  'industrialSafetyPage' | 'laborProtectionPage' | 'medicalCommissionPage'
>;

type OtPbPageKey = 'industrialSafety' | 'laborProtection' | 'medicalCommission';

const getPage: Record<OtPbPageKey, (f: OtPbFix) => OtPbPageApi> = {
  industrialSafety: (f) => f.industrialSafetyPage,
  laborProtection: (f) => f.laborProtectionPage,
  medicalCommission: (f) => f.medicalCommissionPage,
};

export function runOtPbTests(
  pageKey: OtPbPageKey,
  cfg: OtPbTestConfig
): void {
  test.describe(cfg.name, () => {
    test('Выбор категорий и отображение всех сотрудников', async ({
      industrialSafetyPage,
      laborProtectionPage,
      medicalCommissionPage,
    }) => {
      const page = getPage[pageKey]({ industrialSafetyPage, laborProtectionPage, medicalCommissionPage });

      await test.step(cfg.openStep, async () => {
        await page.open();
        await expect(page.locators.heading).toHaveText(cfg.headingText);
      });

      await test.step('Выбрать все категории', async () => {
        await page.selectCategories(cfg.categories);
      });

      await test.step('Нажать «Показать»', async () => {
        await page.clickShow();
      });

      await test.step('Проверить отображение таблицы результатов', async () => {
        await expect(page.isResultsVisible()).resolves.toBe(true);
        await expect(page.locators.resultsHeading).toBeVisible();
      });

      await test.step('Проверить отображение сотрудников', async () => {
        const employeeCount = await page.getEmployeeRowsCount();
        expect(employeeCount).toBeGreaterThan(0);
      });
    });

    test('Фильтр по ФИО отображает выбранного сотрудника', async ({
      industrialSafetyPage,
      laborProtectionPage,
      medicalCommissionPage,
    }) => {
      const page = getPage[pageKey]({ industrialSafetyPage, laborProtectionPage, medicalCommissionPage });

      await test.step(cfg.openStep, async () => {
        await page.open();
        await expect(page.locators.heading).toHaveText(cfg.headingText);
      });

      await test.step('Выбрать все категории', async () => {
        await page.selectCategories(cfg.categories);
      });

      const surname = await test.step('Выбрать случайную фамилию из выпадающего списка', async () => {
        return page.selectRandomSurname();
      });

      await test.step(`Проверить совпадение выбранной ФИО «${surname}»`, async () => {
        await expect(
          page.locators.filterColumn.getByText(surname, { exact: true })
        ).toBeVisible();
      });

      await test.step('Нажать «Показать»', async () => {
        await page.clickShow();
      });

      await test.step('Проверить отображение выбранного сотрудника в таблице', async () => {
        await expect(page.isResultsVisible()).resolves.toBe(true);
        await expect(page.locators.resultsHeading).toBeVisible();
        expect(await page.getEmployeeRowsCount()).toBeGreaterThan(0);
        await expect(
          page.locators.resultsTable.getByText(surname, { exact: true })
        ).toBeVisible();
      });
    });

    test('Фильтр «Только с данными» исключает пустых сотрудников', async ({
      industrialSafetyPage,
      laborProtectionPage,
      medicalCommissionPage,
    }) => {
      const page = getPage[pageKey]({ industrialSafetyPage, laborProtectionPage, medicalCommissionPage });

      await test.step(cfg.openStep, async () => {
        await page.open();
        await expect(page.locators.heading).toHaveText(cfg.headingText);
      });

      await test.step('Выбрать все категории', async () => {
        await page.selectCategories(cfg.categories);
      });

      await test.step('Включить переключатель «Только с данными»', async () => {
        await page.toggleShowData();
      });

      await test.step('Нажать «Показать»', async () => {
        await page.clickShow();
      });

      await test.step('Проверить отображение результатов', async () => {
        await expect(page.isResultsVisible()).resolves.toBe(true);
        await expect(page.locators.resultsHeading).toBeVisible();
      });

      await test.step('Проверить, что отображаются только сотрудники с данными', async () => {
        const employeeCount = await page.getEmployeeRowsCount();
        expect(employeeCount).toBeGreaterThan(0);
        const emptyCount = await page.getEmptyEmployeeRowsCount();
        expect(emptyCount).toBe(0);
      });
    });
  });
}

interface ProtocolTestConfig {
  openStep: string;
  protocolDate: string;
  filePath: string;
}

export function runLaborProtectionProtocolTests(cfg: ProtocolTestConfig): void {
  test.describe('Охрана труда — добавление протокола', () => {
    test('Добавление нового протокола охраны труда выбранному сотруднику', async ({
      laborProtectionPage,
    }) => {
      const protocolNumber = `ТЕСТ-ПТ-${Date.now()}`;

      await test.step(cfg.openStep, async () => {
        await laborProtectionPage.open();
        await expect(laborProtectionPage.locators.heading).toHaveText('Охрана труда');
      });

      await test.step('Выбрать категорию «Охрана труда»', async () => {
        await laborProtectionPage.selectCategories(['Охрана труда']);
      });

      await test.step('Нажать «Показать»', async () => {
        await laborProtectionPage.clickShow();
        await expect(laborProtectionPage.isResultsVisible()).resolves.toBe(true);
      });

      const employee = await test.step('Выбрать случайного сотрудника из таблицы', async () => {
        const employee = await laborProtectionPage.selectRandomEmployee();
        expect(employee).not.toBe('');
        return employee;
      });

      await test.step('Создать запись', async () => {
        await laborProtectionPage.clickCreateRecord();
        await expect(laborProtectionPage.locators.createPageHeading).toBeVisible();
        await expect(
          laborProtectionPage.locators.employeeRows.getByText(employee, { exact: false })
        ).toBeVisible();
      });

      await test.step('Добавить новый протокол', async () => {
        await laborProtectionPage.addProtocol();
      });

      await test.step('Заполнить форму протокола и прикрепить скан-копию', async () => {
        await laborProtectionPage.fillProtocolForm(
          protocolNumber,
          cfg.protocolDate,
          cfg.filePath
        );
      });

      await test.step('Сохранить протокол', async () => {
        await laborProtectionPage.saveProtocol();
      });

      await test.step('Проверить сохранение протокола', async () => {
        await expect(
          laborProtectionPage.locators.saveProtocolButton
        ).not.toBeVisible();
      });
    });
  });
}
