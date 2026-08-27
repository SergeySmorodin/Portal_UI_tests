import { test, expect } from '../../fixtures/test-fixtures';
import { config } from '../../config/config';
import { curatorFactory } from '../../data/curator-factory';
import { CuratorData } from '../../types';

test.describe('Создание куратора', () => {
  test('Заполнение формы, сохранение и проверка в списке', async ({
    page,
    curatorPage,
    curatorsListPage,
  }) => {
    const curator: CuratorData = curatorFactory.default();

    await test.step('Открыть страницу создания куратора', async () => {
      await curatorPage.open();
      await expect(curatorPage.locators.heading).toHaveText('Создание куратора');
    });

    await test.step('Заполнить основные поля', async () => {
      await curatorPage.fillBasicFields(curator);
      await expect(curatorPage.locators.lastNameInput).toHaveValue(curator.lastName);
      await expect(curatorPage.locators.firstNameInput).toHaveValue(curator.firstName);
    });

    await test.step('Выбрать рандомную компанию', async () => {
      const company = await curatorPage.selectRandomCompany();
      expect(company.length).toBeGreaterThan(0);
    });

    await test.step('Сохранить куратора', async () => {
      const responsePromise = page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/company_physical_person/') &&
          resp.request().method() === 'POST',
        { timeout: config.timeouts.long }
      );
      await curatorPage.save();
      const response = await responsePromise;
      expect(response.status()).toBe(201);
    });

    await test.step('Найти куратора в списке через поиск', async () => {
      await curatorsListPage.open();

      const fullName = `${curator.lastName} ${curator.firstName} ${curator.patronymic}`;
      await curatorsListPage.searchByFullName(fullName);

      const curatorRow = curatorsListPage.locators.curatorRow(fullName);
      await expect(curatorRow).toBeVisible({ timeout: config.timeouts.normal });
    });
  });
});
