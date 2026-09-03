import { expect, test } from '../../../fixtures/test-fixtures';

test.describe('Промышленная безопасность', () => {
  test('Выбор категорий и отображение всех сотрудников', async ({ industrialSafetyPage }) => {
    await test.step('Открыть страницу промышленной безопасности', async () => {
      await industrialSafetyPage.open();
      await expect(industrialSafetyPage.locators.heading).toHaveText('Промышленная безопасность');
    });

    await test.step('Выбрать всё', async () => {
      await industrialSafetyPage.selectAll();
    });

    await test.step('Включить переключатель «Все сотрудники»', async () => {
      await industrialSafetyPage.toggleShowAllEmployees();
    });

    await test.step('Нажать «Показать»', async () => {
      await industrialSafetyPage.clickShow();
    });

    await test.step('Проверить отображение таблицы результатов', async () => {
      await expect(industrialSafetyPage.isResultsVisible()).resolves.toBe(true);
      await expect(industrialSafetyPage.locators.resultsHeading).toBeVisible();
    });

    await test.step('Проверить отображение сотрудников', async () => {
      const employeeCount = await industrialSafetyPage.getEmployeeRowsCount();
      expect(employeeCount).toBeGreaterThan(0);
    });
  });

  test('Фильтр по ФИО отображает выбранного сотрудника', async ({ industrialSafetyPage }) => {
    await test.step('Открыть страницу промышленной безопасности', async () => {
      await industrialSafetyPage.open();
      await expect(industrialSafetyPage.locators.heading).toHaveText('Промышленная безопасность');
    });

    await test.step('Выбрать всё', async () => {
      await industrialSafetyPage.selectAll();
    });

    const surname = await test.step('Выбрать случайную фамилию из выпадающего списка', async () => {
      return industrialSafetyPage.selectRandomSurname();
    });

    await test.step(`Проверить совпадение выбранной ФИО «${surname}»`, async () => {
      await expect(
        industrialSafetyPage.locators.filterColumn.getByText(surname, { exact: true })
      ).toBeVisible();
    });

    await test.step('Включить переключатель «Все сотрудники»', async () => {
      await industrialSafetyPage.toggleShowAllEmployees();
    });

    await test.step('Нажать «Показать»', async () => {
      await industrialSafetyPage.clickShow();
    });

    await test.step('Проверить отображение выбранного сотрудника в таблице', async () => {
      await expect(industrialSafetyPage.isResultsVisible()).resolves.toBe(true);
      await expect(industrialSafetyPage.locators.resultsHeading).toBeVisible();
      expect(await industrialSafetyPage.getEmployeeRowsCount()).toBeGreaterThan(0);
      await expect(
        industrialSafetyPage.locators.resultsTable.getByText(surname, { exact: true })
      ).toBeVisible();
    });
  });
});
