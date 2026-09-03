import { expect, test } from '../../../fixtures/test-fixtures';

const categories = [
  'Охрана труда',
  'Электробезопасность',
  'Работа на высоте',
  'Первая помощь',
  'Газоопасные работы',
  'Применение СИЗ',
  'Сизод',
  'Работа в люльке',
  'Журнал проведения противопожарного инструктажа (ППИ/ПТМ)',
  'Ограниченное Замкнутое Пространство',
  'Стропальщик',
];

test.describe('Охрана труда', () => {
  test('Выбор категории и отображение всех сотрудников', async ({ laborProtectionPage }) => {
    await test.step('Открыть страницу охраны труда', async () => {
      await laborProtectionPage.open();
      await expect(laborProtectionPage.locators.heading).toHaveText('Охрана труда');
    });

    await test.step('Выбрать все категории', async () => {
      await laborProtectionPage.selectAllCategories(categories);
    });

    await test.step('Включить переключатель «Все сотрудники»', async () => {
      await laborProtectionPage.toggleShowAllEmployees();
    });

    await test.step('Нажать «Показать»', async () => {
      await laborProtectionPage.clickShow();
    });

    await test.step('Проверить отображение таблицы результатов', async () => {
      await expect(laborProtectionPage.isResultsVisible()).resolves.toBe(true);
      await expect(laborProtectionPage.locators.resultsHeading).toBeVisible();
    });

    await test.step('Проверить отображение сотрудников', async () => {
      const employeeCount = await laborProtectionPage.getEmployeeRowsCount();
      expect(employeeCount).toBeGreaterThan(0);
    });
  });

  test('Фильтр по ФИО отображает выбранного сотрудника', async ({ laborProtectionPage }) => {
    await test.step('Открыть страницу охраны труда', async () => {
      await laborProtectionPage.open();
      await expect(laborProtectionPage.locators.heading).toHaveText('Охрана труда');
    });

    await test.step('Выбрать все категории', async () => {
      await laborProtectionPage.selectAllCategories(categories);
    });

    const surname = await test.step('Выбрать случайную фамилию из выпадающего списка', async () => {
      return laborProtectionPage.selectRandomSurname();
    });

    await test.step(`Проверить совпадение выбранной ФИО «${surname}»`, async () => {
      await expect(
        laborProtectionPage.locators.filterColumn.getByText(surname, { exact: true })
      ).toBeVisible();
    });

    await test.step('Включить переключатель «Все сотрудники»', async () => {
      await laborProtectionPage.toggleShowAllEmployees();
    });

    await test.step('Нажать «Показать»', async () => {
      await laborProtectionPage.clickShow();
    });

    await test.step('Проверить отображение выбранного сотрудника в таблице', async () => {
      await expect(laborProtectionPage.isResultsVisible()).resolves.toBe(true);
      await expect(laborProtectionPage.locators.resultsHeading).toBeVisible();
      expect(await laborProtectionPage.getEmployeeRowsCount()).toBeGreaterThan(0);
      await expect(
        laborProtectionPage.locators.resultsTable.getByText(surname, { exact: true })
      ).toBeVisible();
    });
  });
});
