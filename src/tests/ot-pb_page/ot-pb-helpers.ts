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

interface OtPbPageMeta {
  startColumn: number;
  stopColumn: number;
  protocolColumn?: number;
  certificateColumn?: number;
}

const pageMeta: Record<OtPbPageKey, OtPbPageMeta> = {
  industrialSafety: { startColumn: 4, stopColumn: 5, protocolColumn: 3 },
  laborProtection: { startColumn: 5, stopColumn: 6, certificateColumn: 4 },
  medicalCommission: { startColumn: 4, stopColumn: 5, certificateColumn: 3 },
};

const isRuDate = (value: string): boolean => /^\d{2}\.\d{2}\.\d{4}$/.test(value);

const ruDateToNumber = (value: string): number => {
  const [day, month, year] = value.split('.').map(Number);
  return year * 10000 + month * 100 + day;
};

const toFilterDate = (value: string): string => value.replace(/\./g, '-');

const pickRandom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

type OtPbDataKey = 'user_OT' | 'user_PB' | 'user_MC';

const dataKeyByPage: Record<OtPbPageKey, OtPbDataKey> = {
  industrialSafety: 'user_PB',
  laborProtection: 'user_OT',
  medicalCommission: 'user_MC',
};

const fetchValuesWithRecords = async (
  apiRequest: TestFixtures['apiRequest'],
  field: 'department' | 'filial',
  dataKey: OtPbDataKey
): Promise<string[]> => {
  const values = new Set<string>();
  let page = 1;

  while (page > 0) {
    const response = await apiRequest.get(
      `/api/users/safety_all/?page=${page}&page_size=500`
    );
    const data = await response.json();
    const users = (data.results ?? []) as Array<{
      position_user?: Array<{
        position?: Record<string, unknown>;
        user_OT?: unknown[];
        user_PB?: unknown[];
        user_MC?: unknown[];
      }>;
    }>;

    for (const user of users) {
      for (const position of user.position_user ?? []) {
        const records = (position[dataKey] ?? []) as unknown[];
        const value = String(position.position?.[field] ?? '');
        if (value && records.length > 0) {
          values.add(value);
        }
      }
    }

    page = data.next ? page + 1 : 0;
  }

  return [...values];
};

export function runOtPbTests(pageKey: OtPbPageKey, cfg: OtPbTestConfig): void {
  test.describe(cfg.name, () => {
    test('Выбор категорий и отображение всех сотрудников', async ({
      industrialSafetyPage,
      laborProtectionPage,
      medicalCommissionPage,
    }) => {
      const page = getPage[pageKey]({
        industrialSafetyPage,
        laborProtectionPage,
        medicalCommissionPage,
      });

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
      const page = getPage[pageKey]({
        industrialSafetyPage,
        laborProtectionPage,
        medicalCommissionPage,
      });

      await test.step(cfg.openStep, async () => {
        await page.open();
        await expect(page.locators.heading).toHaveText(cfg.headingText);
      });

      await test.step('Выбрать все категории', async () => {
        await page.selectCategories(cfg.categories);
      });

      const surname =
        await test.step('Выбрать случайную фамилию из выпадающего списка', async () => {
          return page.selectRandomSurname();
        });

      await test.step(`Проверить совпадение выбранной ФИО «${surname}»`, async () => {
        await expect(page.locators.filterColumn.getByText(surname, { exact: true })).toBeVisible();
      });

      await test.step('Нажать «Показать»', async () => {
        await page.clickShow();
      });

      await test.step('Проверить отображение выбранного сотрудника в таблице', async () => {
        await expect(page.isResultsVisible()).resolves.toBe(true);
        await expect(page.locators.resultsHeading).toBeVisible();
        expect(await page.getEmployeeRowsCount()).toBeGreaterThan(0);
        await expect(
          page.locators.resultsTable.getByText(surname, { exact: true }).first()
        ).toBeVisible();
      });
    });

    test('Фильтр «Только с данными» исключает пустых сотрудников', async ({
      industrialSafetyPage,
      laborProtectionPage,
      medicalCommissionPage,
    }) => {
      const page = getPage[pageKey]({
        industrialSafetyPage,
        laborProtectionPage,
        medicalCommissionPage,
      });

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
      const page = getPage[pageKey]({
        industrialSafetyPage,
        laborProtectionPage,
        medicalCommissionPage,
      });

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

      const position =
        await test.step('Выбрать случайную должность из отображаемых сотрудников', async () => {
          const positions = await page.getResultColumnValues(2);
          const uniquePositions = [...new Set(positions.filter((value) => value !== ''))];
          expect(uniquePositions.length).toBeGreaterThan(0);
          const chosenPosition =
            uniquePositions[Math.floor(Math.random() * uniquePositions.length)];
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
              displayedPositions.length > 0 &&
              displayedPositions.every((value) => value === position)
            );
          })
          .toBe(true);
      });
    });

    test('Фильтрация по отделу', async ({
      industrialSafetyPage,
      laborProtectionPage,
      medicalCommissionPage,
      apiRequest,
    }) => {
      const page = getPage[pageKey]({
        industrialSafetyPage,
        laborProtectionPage,
        medicalCommissionPage,
      });

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

      const department =
        await test.step('Выбрать отдел, у которого есть записи', async () => {
          const departments = await fetchValuesWithRecords(
            apiRequest,
            'department',
            dataKeyByPage[pageKey]
          );
          expect(departments.length).toBeGreaterThan(0);
          const chosen = pickRandom(departments);
          await page.selectFilterOption(page.locators.departmentSearchInput, chosen);
          return chosen;
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
      apiRequest,
    }) => {
      const page = getPage[pageKey]({
        industrialSafetyPage,
        laborProtectionPage,
        medicalCommissionPage,
      });

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

      const branch = await test.step('Выбрать филиал, у которого есть записи', async () => {
        const branches = await fetchValuesWithRecords(
          apiRequest,
          'filial',
          dataKeyByPage[pageKey]
        );
        expect(branches.length).toBeGreaterThan(0);
        const chosen = pickRandom(branches);
        await page.selectFilterOption(page.locators.branchSearchInput, chosen);
        return chosen;
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
      const page = getPage[pageKey]({
        industrialSafetyPage,
        laborProtectionPage,
        medicalCommissionPage,
      });

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

    test('Фильтрация по периоду', async ({
      industrialSafetyPage,
      laborProtectionPage,
      medicalCommissionPage,
    }) => {
      const page = getPage[pageKey]({
        industrialSafetyPage,
        laborProtectionPage,
        medicalCommissionPage,
      });
      const meta = pageMeta[pageKey];

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

      const period =
        await test.step('Выбрать период по отображаемой записи', async () => {
          const starts = await page.getResultColumnValues(meta.startColumn);
          const stops = await page.getResultColumnValues(meta.stopColumn);
          const candidates = starts
            .map((start, index) => ({ start, stop: stops[index] }))
            .filter((row) => isRuDate(row.start) && isRuDate(row.stop));
          expect(candidates.length).toBeGreaterThan(0);
          const chosen = pickRandom(candidates);
          await page.setPeriod(toFilterDate(chosen.start), toFilterDate(chosen.stop));
          return chosen;
        });

      await test.step('Нажать «Показать» после фильтрации по периоду', async () => {
        await page.clickShow();
      });

      await test.step(
        `Проверить, что отображаются записи с периодом ${period.start} — ${period.stop}`,
        async () => {
          await expect(page.isResultsVisible()).resolves.toBe(true);
          await expect(page.locators.resultsHeading).toBeVisible();
          await expect
            .poll(async () => {
              const starts = await page.getResultColumnValues(meta.startColumn);
              const stops = await page.getResultColumnValues(meta.stopColumn);
              const dated = starts
                .map((start, index) => ({ start, stop: stops[index] }))
                .filter((row) => isRuDate(row.start) && isRuDate(row.stop));

              if (dated.length === 0) {
                return false;
              }

              const from = ruDateToNumber(period.start);
              const to = ruDateToNumber(period.stop);
              const allInRange = dated.every(
                (row) => ruDateToNumber(row.start) >= from && ruDateToNumber(row.stop) <= to
              );
              const chosenVisible = dated.some(
                (row) => row.start === period.start && row.stop === period.stop
              );
              return allInRange && chosenVisible;
            })
            .toBe(true);
        }
      );
    });

    test('Фильтрация по протоколу', async ({
      industrialSafetyPage,
      laborProtectionPage,
      medicalCommissionPage,
    }) => {
      const protocolColumn = pageMeta[pageKey].protocolColumn;
      test.skip(
        protocolColumn === undefined,
        'Фильтр по протоколу поддерживается только на странице «Промышленная безопасность»'
      );
      if (protocolColumn === undefined) {
        return;
      }

      const page = getPage[pageKey]({
        industrialSafetyPage,
        laborProtectionPage,
        medicalCommissionPage,
      });

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

      const protocol =
        await test.step('Выбрать протокол из отображаемых записей', async () => {
          const values = await page.getResultColumnValues(protocolColumn);
          const unique = [...new Set(values.filter((value) => value !== ''))];
          expect(unique.length).toBeGreaterThan(0);
          const chosen = pickRandom(unique);
          await page.fillProtocolSearch(chosen);
          return chosen;
        });

      await test.step('Нажать «Показать» после фильтрации по протоколу', async () => {
        await page.clickShow();
      });

      await test.step(`Проверить, что отображаются записи с протоколом «${protocol}»`, async () => {
        await expect(page.isResultsVisible()).resolves.toBe(true);
        await expect(page.locators.resultsHeading).toBeVisible();
        await expect
          .poll(async () => {
            const values = await page.getResultColumnValues(protocolColumn);
            return (
              values.length > 0 &&
              values.every((value) => value.toLowerCase().includes(protocol.toLowerCase()))
            );
          })
          .toBe(true);
      });
    });

    test('Фильтрация по удостоверению', async ({
      industrialSafetyPage,
      laborProtectionPage,
      medicalCommissionPage,
    }) => {
      const certificateColumn = pageMeta[pageKey].certificateColumn;
      test.skip(
        certificateColumn === undefined,
        'Фильтр по удостоверению поддерживается только на страницах «Охрана труда» и «Медицинская комиссия»'
      );
      if (certificateColumn === undefined) {
        return;
      }

      const page = getPage[pageKey]({
        industrialSafetyPage,
        laborProtectionPage,
        medicalCommissionPage,
      });

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

      const certificate =
        await test.step('Выбрать удостоверение из отображаемых записей', async () => {
          const values = await page.getResultColumnValues(certificateColumn);
          const unique = [...new Set(values.filter((value) => value !== ''))];
          expect(unique.length).toBeGreaterThan(0);
          const chosen = pickRandom(unique);
          await page.fillCertificateSearch(chosen);
          return chosen;
        });

      await test.step('Нажать «Показать» после фильтрации по удостоверению', async () => {
        await page.clickShow();
      });

      await test.step(
        `Проверить, что отображаются записи с удостоверением «${certificate}»`,
        async () => {
          await expect(page.isResultsVisible()).resolves.toBe(true);
          await expect(page.locators.resultsHeading).toBeVisible();
          await expect
            .poll(async () => {
              const values = await page.getResultColumnValues(certificateColumn);
              return (
                values.length > 0 &&
                values.every((value) => value.toLowerCase().includes(certificate.toLowerCase()))
              );
            })
            .toBe(true);
        }
      );
    });
  });
}
