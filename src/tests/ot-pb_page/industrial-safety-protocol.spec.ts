import { test, expect } from '../../fixtures/test-fixtures';
import { formatDmy, addYears } from '../../utils/date';

test.describe('Охрана труда — добавление записи промышленной безопасности', () => {
  test('Добавление нового протокола промышленной безопасности выбранному сотруднику', async ({
    industrialSafetyPage,
  }) => {
    const protocolNumber = `ТЕСТ-ПБ-${Date.now()}`;
    const startDate = formatDmy(new Date());
    const endDate = formatDmy(addYears(new Date(), 1));

    await test.step('Открыть страницу промышленной безопасности', async () => {
      await industrialSafetyPage.open();
      await expect(industrialSafetyPage.locators.heading).toHaveText('Промышленная безопасность');
    });

    await test.step('Выбрать категорию «Выбрать всё»', async () => {
      await industrialSafetyPage.selectCategories();
    });

    await test.step('Нажать «Показать»', async () => {
      await industrialSafetyPage.clickShow();
      await expect(industrialSafetyPage.isResultsVisible()).resolves.toBe(true);
    });

    const employee = await test.step('Выбрать случайного сотрудника из таблицы', async () => {
      const employee = await industrialSafetyPage.selectRandomEmployee();
      expect(employee).not.toBe('');
      return employee;
    });

    await test.step('Создать запись', async () => {
      await industrialSafetyPage.clickCreateRecord();
      await expect(industrialSafetyPage.locators.createPageHeading).toBeVisible();
      await expect(industrialSafetyPage.locators.createTableRow(employee)).toBeVisible();
    });

    await test.step('Заполнить протокол, даты и область', async () => {
      await industrialSafetyPage.fillEmployeeRecord(
        employee,
        protocolNumber,
        startDate,
        endDate,
        'А.1'
      );
    });

    await test.step('Сохранить запись', async () => {
      await industrialSafetyPage.saveCreatePage();
    });

    await test.step('Проверить сохранение записи', async () => {
      await expect(industrialSafetyPage.locators.createPageSaveButton).toBeVisible();
    });

    await test.step('Вернуться на главную страницу промышленной безопасности', async () => {
      await industrialSafetyPage.open();
    });

    await test.step('Выбрать категорию «Выбрать всё»', async () => {
      await industrialSafetyPage.selectCategories();
    });

    await test.step('Нажать «Показать»', async () => {
      await industrialSafetyPage.clickShow();
      await expect(industrialSafetyPage.isResultsVisible()).resolves.toBe(true);
    });

    await test.step('Найти запись сотрудника с добавленным протоколом', async () => {
      await industrialSafetyPage.fillProtocolSearch(protocolNumber);
      await industrialSafetyPage.clickShow();
      await industrialSafetyPage.verifyRecordInResults(employee, protocolNumber);
    });

    await test.step('Проверить соответствие номера протокола', async () => {
      const row = industrialSafetyPage.locators.recordRow(employee, protocolNumber);
      await expect(row).toContainText(protocolNumber);
    });
  });
});
