import { test, expect } from '../../fixtures/test-fixtures';
import type { IndustrialSafetyPage } from '../../pages/ot-pb/industrial-safety-page';
import type { LaborProtectionPage } from '../../pages/ot-pb/labor-protection-page';
import type { MedicalCommissionPage } from '../../pages/ot-pb/medical-commission-page';
import type { OtPbPageApi } from '../../pages/ot-pb/ot-pb-base';

interface OtPbTestConfig {
  name: string;
  headingText: string;
  openStep: string;
  categories: string[];
}

interface OtPbFix {
  industrialSafetyPage: IndustrialSafetyPage;
  laborProtectionPage: LaborProtectionPage;
  medicalCommissionPage: MedicalCommissionPage;
}

const getPage: Record<string, (f: OtPbFix) => OtPbPageApi> = {
  industrialSafety: (f) => f.industrialSafetyPage,
  laborProtection: (f) => f.laborProtectionPage,
  medicalCommission: (f) => f.medicalCommissionPage,
};

export function runOtPbTests(
  pageKey: keyof typeof getPage,
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
