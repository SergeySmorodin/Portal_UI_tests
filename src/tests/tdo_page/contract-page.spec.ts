import { test, expect } from '../../fixtures/test-fixtures';
import { config } from '../../config/config';
import { contractFactory } from '../../data/contract-factory';
import { api } from '../../data/api/api';

test.describe('Создание договора', () => {
  test('Заполнение формы, сохранение и проверка в списке', async ({
    page,
    contractPage,
    contractsListPage,
  }) => {
    const contract = contractFactory.signed();

    await test.step('Открыть страницу создания договора', async () => {
      await contractPage.open();
      await expect(contractPage.locators.heading).toHaveText('Создание договора');
    });

    await test.step('Заполнить основные поля', async () => {
      await contractPage.fillBasicFields(contract);
      await expect(contractPage.locators.contractInput).toHaveValue(contract.contractNumber);
    });

    await test.step('Выбрать рандомный статус', async () => {
      const status = await contractPage.selectRandomStatus();
      expect(status).toBeTruthy();
    });

    await test.step('Выбрать рандомную компанию', async () => {
      const company = await contractPage.selectRandomCompany();
      expect(company.length).toBeGreaterThan(0);
    });

    await test.step('Добавить рандомного менеджера', async () => {
      await contractPage.selectRandomManager();
    });

    await test.step('Добавить рандомный вид работ', async () => {
      await contractPage.selectRandomWorkType();
    });

    await test.step('Загрузить файл договора', async () => {
      await contractPage.locators.fileInput.setInputFiles({
        name: 'test-contract.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('Test contract file'),
      });
      await expect(contractPage.locators.saveButton).toBeEnabled({
        timeout: config.timeouts.short,
      });
    });

    await test.step('Сохранить договор', async () => {
      await contractPage.runAndCheckResponse(
        api.contract,
        () => contractPage.save(),
        (status) => expect(status).toBeLessThan(400)
      );
    });

    await test.step('Проверить редирект после успешного сохранения', async () => {
      await page.waitForURL((url) => !url.pathname.includes('/TDO/Contract/new'), {
        timeout: config.timeouts.long,
      });
    });

    await test.step('Найти договор в списке через поиск', async () => {
      await contractsListPage.open();

      await contractsListPage.searchByContractNumber(contract.contractNumber);

      const contractRow = contractsListPage.locators.contractNumberCell(contract.contractNumber);
      await expect(contractRow).toBeVisible({ timeout: config.timeouts.normal });
    });
  });
});
