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

    test('Фильтрация по должности', async ({
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
        await expect(page.isResultsVisible()).resolves.toBe(true);
      });

      const position = await test.step('Выбрать случайную должность из отображаемых сотрудников', async () => {
        const positions = await page.getResultColumnValues(2);
        const uniquePositions = [...new Set(positions.filter((value) => value !== ''))];
        expect(uniquePositions.length).toBeGreaterThan(0);
        const chosenPosition = uniquePositions[Math.floor(Math.random() * uniquePositions.length)];
        await page.selectFilterOption(page.locators.positionSearchInput, chosenPosition);
        return chosenPosition;
      });

      await test.step(`Проверить подсветку выбранной должности «${position}»`, async () => {
        await expect(page.isFilterOptionHighlighted(position)).resolves.toBe(true);
      });

      await test.step('Нажать «Показать» после фильтрации по должности', async () => {
        await page.clickShow();
      });

      await test.step('Проверить, что отображаются только сотрудники с выбранной должностью', async () => {
        await expect(page.isResultsVisible()).resolves.toBe(true);
        await expect(page.locators.resultsHeading).toBeVisible();
        await expect
          .poll(async () => {
            const displayedPositions = await page.getResultColumnValues(2);
            return (
              displayedPositions.length > 0 && displayedPositions.every((value) => value === position)
            );
          })
          .toBe(true);
      });
    });

    test('Фильтрация по отделу', async ({
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
        await expect(page.isResultsVisible()).resolves.toBe(true);
      });

      const department = await test.step('Выбрать случайный отдел из выпадающего списка', async () => {
        return page.selectRandomDepartment();
      });

      await test.step(`Проверить подсветку выбранного отдела «${department}»`, async () => {
        await expect(page.isFilterOptionHighlighted(department)).resolves.toBe(true);
      });

      await test.step('Нажать «Показать» после фильтрации по отделу', async () => {
        await page.clickShow();
      });

      await test.step('Проверить отображение результатов после фильтрации по отделу', async () => {
        await expect(page.isResultsVisible()).resolves.toBe(true);
        await expect(page.locators.resultsHeading).toBeVisible();
      });
    });

    test('Фильтрация по филиалу', async ({
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
        await expect(page.isResultsVisible()).resolves.toBe(true);
      });

      const branch = await test.step('Выбрать случайный филиал из выпадающего списка', async () => {
        return page.selectRandomBranch();
      });

      await test.step(`Проверить подсветку выбранного филиала «${branch}»`, async () => {
        await expect(page.isFilterOptionHighlighted(branch)).resolves.toBe(true);
      });

      await test.step('Нажать «Показать» после фильтрации по филиалу', async () => {
        await page.clickShow();
      });

      await test.step('Проверить отображение результатов после фильтрации по филиалу', async () => {
        await expect(page.isResultsVisible()).resolves.toBe(true);
        await expect(page.locators.resultsHeading).toBeVisible();
      });
    });

    test('Фильтрация по сроку действия', async ({
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

      const filters = [
        { name: 'отсутствует', button: page.locators.missingFilterButton },
        { name: 'просрочено', button: page.locators.expiredFilterButton },
        { name: 'до 30 дней', button: page.locators.lessThan30DaysFilterButton },
        { name: '> 30 дней', button: page.locators.moreThan30DaysFilterButton },
      ] as const;

      for (const filter of filters) {
        await test.step(`Включить фильтр «${filter.name}»`, async () => {
          await filter.button.click();
        });

        await test.step(`Проверить, что кнопка «${filter.name}» стала активной`, async () => {
          await expect(page.isButtonActive(filter.button)).resolves.toBe(true);
        });

        await test.step('Нажать «Показать»', async () => {
          await page.clickShow();
        });

        await test.step(`Проверить отображение результатов с фильтром «${filter.name}»`, async () => {
          await expect(page.isResultsVisible()).resolves.toBe(true);
          await expect(page.locators.resultsHeading).toBeVisible();
        });

        await test.step(`Выключить фильтр «${filter.name}»`, async () => {
          await filter.button.click();
          await expect(page.isButtonActive(filter.button)).resolves.toBe(false);
        });
      }
    });
  });
}
