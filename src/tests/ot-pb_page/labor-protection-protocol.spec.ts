import { test, expect } from '../../fixtures/test-fixtures';
import { formatDmy, addYears } from '../../utils/date';

test.describe('Охрана труда — добавление протокола', () => {
  test('Добавление нового протокола охраны труда выбранному сотруднику', async ({
    laborProtectionPage,
  }) => {
    const protocolNumber = `ТЕСТ-ПТ-${Date.now()}`;
    const protocolDate = formatDmy(new Date());
    const certificateNumber = String(Math.floor(100000 + Math.random() * 900000));
    const endDate = formatDmy(addYears(new Date(), 1));
    const filePath = 'src/test-data/test-protocol.pdf';

    await test.step('Открыть страницу охраны труда', async () => {
      await laborProtectionPage.open();
      await expect(laborProtectionPage.locators.heading).toHaveText('Охрана труда');
    });

    await test.step('Выбрать категорию «Охрана труда»', async () => {
      await laborProtectionPage.selectCategory('Охрана труда');
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
      await laborProtectionPage.fillProtocolForm(protocolNumber, protocolDate, filePath);
    });

    await test.step('Сохранить протокол', async () => {
      await laborProtectionPage.saveProtocol();
    });

    await test.step('Проверить сохранение протокола', async () => {
      await expect(laborProtectionPage.locators.saveProtocolButton).not.toBeVisible();
    });

    await test.step('Обновить страницу создания записей', async () => {
      await laborProtectionPage.refreshCreatePage();
    });

    await test.step(`Выбрать созданный протокол «${protocolNumber}» в таблице сотрудника`, async () => {
      await laborProtectionPage.selectEmployeeProtocol(employee, protocolNumber);
    });

    await test.step('Ввести номер удостоверения', async () => {
      await laborProtectionPage.fillEmployeeCertificate(employee, certificateNumber);
    });

    await test.step('Заполнить даты начала и окончания', async () => {
      await laborProtectionPage.fillEmployeeDates(employee, protocolDate, endDate);
    });

    await test.step('Сохранить запись', async () => {
      await laborProtectionPage.saveCreatePage();
    });

    await test.step('Проверить сохранение записи', async () => {
      await expect(laborProtectionPage.locators.createPageSaveButton).toBeVisible();
    });

    await test.step('Вернуться на главную страницу охраны труда', async () => {
      await laborProtectionPage.open();
    });

    await test.step('Выбрать категорию «Охрана труда»', async () => {
      await laborProtectionPage.selectCategory('Охрана труда');
    });

    await test.step('Нажать «Показать»', async () => {
      await laborProtectionPage.clickShow();
      await expect(laborProtectionPage.isResultsVisible()).resolves.toBe(true);
    });

    await test.step('Найти запись сотрудника с добавленным протоколом', async () => {
      await laborProtectionPage.verifyProtocolInResults(employee, protocolNumber);
    });

    await test.step('Проверить соответствие номера протокола', async () => {
      await expect(
        laborProtectionPage.locators.protocolLink(employee, protocolNumber)
      ).toHaveText(protocolNumber);
    });

    await test.step('Перейти по ссылке протокола', async () => {
      await laborProtectionPage.clickProtocolLink(employee, protocolNumber);
    });
  });
});
