import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Главная страница', () => {
  test('Отображение элементов главной страницы', async ({ mainPage }) => {
    await test.step('Открыть главную страницу', async () => {
      await mainPage.open();
    });

    await test.step('Проверить ссылку на профиль сотрудника', async () => {
      await expect(mainPage.locators.userProfileLink).toBeVisible();
    });
  });

  test('Переход в профиль сотрудника с главной страницы', async ({ mainPage, page }) => {
    await test.step('Открыть главную страницу', async () => {
      await mainPage.open();
    });

    await test.step('Кликнуть "Профиль сотрудника"', async () => {
      await mainPage.navigateToProfile();
    });

    await test.step('Проверить переход на страницу профиля', async () => {
      expect(page.url()).toContain('/lk');
    });
  });

  test('Схема разделов отображается на главной странице', async ({ mainPage }) => {
    await test.step('Открыть главную страницу', async () => {
      await mainPage.open();
    });

    for (const section of mainPage.mainSections) {
      await test.step(`Проверить раздел "${section}"`, async () => {
        await expect(mainPage.page.getByText(section, { exact: true }).first()).toBeVisible();
      });
    }
  });
});
