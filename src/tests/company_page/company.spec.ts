import { test, expect } from '../../fixtures/test-fixtures';
import { config } from '../../config/config';
import { companyFactory } from '../../data/test-data';
import { CompanyData } from '../../types';

test.describe('Создание компании', () => {
  test('Заполнение формы, сохранение и проверка в списке', async ({
    page,
    companyPage,
    companiesListPage,
  }) => {
    const company: CompanyData = companyFactory.llc();

    await test.step('Открыть страницу создания компании', async () => {
      await companyPage.open();
      await expect(companyPage.locators.heading).toHaveText('Создание компании');
    });

    await test.step('Заполнить основные поля', async () => {
      await companyPage.fillBasicFields(company);
      await expect(companyPage.locators.nameInput).toHaveValue(company.name);
      await expect(companyPage.locators.structureSelect).toHaveValue(company.structure);
    });

    await test.step('Сохранить компанию', async () => {
      const responsePromise = page.waitForResponse(
        (resp) => resp.url().includes('/api/company/') && resp.request().method() === 'POST',
        { timeout: config.timeouts.long }
      );
      await companyPage.save();
      const response = await responsePromise;
      expect(response.status()).toBe(201);
    });

    await test.step('Найти компанию в списке через поиск', async () => {
      await companiesListPage.open();

      await companiesListPage.searchByName(company.name);

      const companyRow = companiesListPage.locators.companyRow(company.name);
      await expect(companyRow).toBeVisible({ timeout: config.timeouts.normal });
    });
  });
});
