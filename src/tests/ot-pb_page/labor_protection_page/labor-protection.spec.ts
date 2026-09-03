import { expect, test } from '../../../fixtures/test-fixtures';

test.describe('Охрана труда', () => {
  test('Выбор категории и отображение всех сотрудников', async ({ laborProtectionPage }) => {
    await test.step('Открыть страницу охраны труда', async () => {
      await laborProtectionPage.open();
      await expect(laborProtectionPage.locators.heading).toHaveText('Охрана труда');
    });

    for (const category of [
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
    ]) {
      await test.step(`Выбрать категорию «${category}»`, async () => {
        await laborProtectionPage.selectCategory(category);
      });
    }

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
});
