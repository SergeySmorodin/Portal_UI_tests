import { expect, test } from '../../../fixtures/test-fixtures';

const categories = ['Медицинская комиссия', 'Психиатрическое освидетельствование'];

test.describe('Медицинская комиссия', () => {
  test('Выбор категории и отображение всех сотрудников', async ({ medicalCommissionPage }) => {
    await test.step('Открыть страницу медицинской комиссии', async () => {
      await medicalCommissionPage.open();
      await expect(medicalCommissionPage.locators.heading).toHaveText('Медицинская комиссия');
    });

    await test.step('Выбрать все категории', async () => {
      await medicalCommissionPage.selectAllCategories(categories);
    });

    await test.step('Включить переключатель «Все сотрудники»', async () => {
      await medicalCommissionPage.toggleShowAllEmployees();
    });

    await test.step('Нажать «Показать»', async () => {
      await medicalCommissionPage.clickShow();
    });

    await test.step('Проверить отображение таблицы результатов', async () => {
      await expect(medicalCommissionPage.isResultsVisible()).resolves.toBe(true);
      await expect(medicalCommissionPage.locators.resultsHeading).toBeVisible();
    });

    await test.step('Проверить отображение сотрудников', async () => {
      const employeeCount = await medicalCommissionPage.getEmployeeRowsCount();
      expect(employeeCount).toBeGreaterThan(0);
    });
  });

  test('Фильтр по ФИО отображает выбранного сотрудника', async ({ medicalCommissionPage }) => {
    await test.step('Открыть страницу медицинской комиссии', async () => {
      await medicalCommissionPage.open();
      await expect(medicalCommissionPage.locators.heading).toHaveText('Медицинская комиссия');
    });

    await test.step('Выбрать все категории', async () => {
      await medicalCommissionPage.selectAllCategories(categories);
    });

    const surname = await test.step('Выбрать случайную фамилию из выпадающего списка', async () => {
      return medicalCommissionPage.selectRandomSurname();
    });

    await test.step(`Проверить совпадение выбранной ФИО «${surname}»`, async () => {
      await expect(
        medicalCommissionPage.locators.filterColumn.getByText(surname, { exact: true })
      ).toBeVisible();
    });

    await test.step('Включить переключатель «Все сотрудники»', async () => {
      await medicalCommissionPage.toggleShowAllEmployees();
    });

    await test.step('Нажать «Показать»', async () => {
      await medicalCommissionPage.clickShow();
    });

    await test.step('Проверить отображение выбранного сотрудника в таблице', async () => {
      await expect(medicalCommissionPage.isResultsVisible()).resolves.toBe(true);
      await expect(medicalCommissionPage.locators.resultsHeading).toBeVisible();
      expect(await medicalCommissionPage.getEmployeeRowsCount()).toBeGreaterThan(0);
      await expect(
        medicalCommissionPage.locators.resultsTable.getByText(surname, { exact: true })
      ).toBeVisible();
    });
  });
});
