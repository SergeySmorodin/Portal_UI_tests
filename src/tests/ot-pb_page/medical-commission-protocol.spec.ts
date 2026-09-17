import { test, expect } from '../../fixtures/test-fixtures';
import { formatDmy, addYears } from '../../utils/date';

const toDisplayDate = (dmy: string): string => dmy.replaceAll('-', '.');

test.describe('Охрана труда — добавление записи медицинской комиссии', () => {
  test('Добавление нового заключения медицинской комиссии выбранному сотруднику', async ({
    medicalCommissionPage,
  }) => {
    const issueDate = formatDmy(new Date());
    const nextDate = formatDmy(addYears(new Date(), 1));
    const issueDateDisplay = toDisplayDate(issueDate);
    const nextDateDisplay = toDisplayDate(nextDate);

    await test.step('Открыть страницу медицинской комиссии', async () => {
      await medicalCommissionPage.open();
      await expect(medicalCommissionPage.locators.heading).toHaveText('Медицинская комиссия');
    });

    await test.step('Выбрать категорию «Медицинская комиссия»', async () => {
      await medicalCommissionPage.selectCategory('Медицинская комиссия');
    });

    await test.step('Нажать «Показать»', async () => {
      await medicalCommissionPage.clickShow();
      await expect(medicalCommissionPage.isResultsVisible()).resolves.toBe(true);
    });

    const employee = await test.step('Выбрать случайного сотрудника из таблицы', async () => {
      const employee = await medicalCommissionPage.selectRandomEmployee();
      expect(employee).not.toBe('');
      return employee;
    });

    await test.step('Создать запись', async () => {
      await medicalCommissionPage.clickCreateRecord();
      await expect(medicalCommissionPage.locators.createPageHeading).toBeVisible();
      await expect(medicalCommissionPage.locators.createTableRow(employee)).toBeVisible();
    });

    await test.step('Заполнить даты выдачи заключения и следующей медкомиссии', async () => {
      await medicalCommissionPage.fillEmployeeDates(employee, issueDate, nextDate);
    });

    await test.step('Сохранить запись', async () => {
      await medicalCommissionPage.saveCreatePage();
    });

    await test.step('Проверить сохранение записи', async () => {
      await expect(medicalCommissionPage.locators.createPageSaveButton).toBeVisible();
    });

    await test.step('Вернуться на главную страницу медицинской комиссии', async () => {
      await medicalCommissionPage.open();
    });

    await test.step('Выбрать категорию «Медицинская комиссия»', async () => {
      await medicalCommissionPage.selectCategory('Медицинская комиссия');
    });

    await test.step('Нажать «Показать»', async () => {
      await medicalCommissionPage.clickShow();
      await expect(medicalCommissionPage.isResultsVisible()).resolves.toBe(true);
    });

    await test.step('Найти запись сотрудника с добавленным заключением', async () => {
      await medicalCommissionPage.selectFilterOption(
        medicalCommissionPage.locators.surnameSearchInput,
        employee
      );
      await medicalCommissionPage.clickShow();
      await medicalCommissionPage.verifyRecordInResults(employee, issueDateDisplay);
    });

    await test.step('Проверить даты заключения в таблице результатов', async () => {
      const row = medicalCommissionPage.locators.recordRow(employee, issueDateDisplay).first();
      await expect(row).toContainText(nextDateDisplay);
    });
  });
});
