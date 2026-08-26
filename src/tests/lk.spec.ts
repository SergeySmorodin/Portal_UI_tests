import { test, expect } from '../fixtures/test-fixtures';

test.describe('Профиль сотрудника (ЛК)', () => {
  test('Отображение вкладок профиля', async ({ lkPage }) => {
    await test.step('Открыть профиль сотрудника', async () => {
      await lkPage.open();
    });

    for (const tab of lkPage.tabNames) {
      await test.step(`Проверить вкладку "${tab}"`, async () => {
        await expect(lkPage.page.getByRole('button', { name: tab })).toBeVisible();
      });
    }
  });

  test('Вкладка "Общая информация" содержит основные данные сотрудника', async ({ lkPage }) => {
    await test.step('Открыть профиль сотрудника', async () => {
      await lkPage.open();
    });

    await test.step('Проверить заголовок с ФИО пользователя', async () => {
      const userName = await lkPage.getUserNameHeading();
      expect(userName.length).toBeGreaterThan(0);
    });

    await test.step('Проверить отображение основных полей', async () => {
      await expect(lkPage.locators.generalInfoLabels.fullName).toBeVisible();
      await expect(lkPage.locators.generalInfoLabels.position).toBeVisible();
      await expect(lkPage.locators.generalInfoLabels.email).toBeVisible();
    });
  });

  test('Вкладка "История проектов" показывает пустое состояние', async ({ lkPage }) => {
    await test.step('Открыть вкладку "История проектов"', async () => {
      await lkPage.open();
      await lkPage.openTab('История проектов');
    });

    await test.step('Проверить сообщение об отсутствии проектов', async () => {
      await expect(lkPage.locators.emptyProjectHistory).toBeVisible();
    });
  });

  test('Переключение между вкладками профиля', async ({ lkPage }) => {
    await test.step('Открыть профиль сотрудника', async () => {
      await lkPage.open();
    });

    await test.step('Открыть вкладку "Аттестация" и проверить заголовок раздела', async () => {
      await lkPage.openTab('Аттестация');
      await expect(lkPage.page.getByText('Аттестации', { exact: true })).toBeVisible();
    });

    await test.step('Открыть вкладку "Доп. образование" и проверить заголовок раздела', async () => {
      await lkPage.openTab('Доп. образование');
      await expect(
        lkPage.page.getByText('Дополнительное образование', { exact: true })
      ).toBeVisible();
    });

    await test.step('Вернуться на вкладку "Общая информация"', async () => {
      await lkPage.openTab('Общая информация');
      await expect(lkPage.locators.generalInfoLabels.fullName).toBeVisible();
    });
  });

  test('Боковое меню содержит основные разделы портала', async ({ lkPage }) => {
    await test.step('Открыть профиль сотрудника', async () => {
      await lkPage.open();
    });

    await test.step('Открыть боковое меню', async () => {
      await lkPage.openSidebar();
    });

    for (const item of lkPage.sidebarMenuItems) {
      await test.step(`Проверить пункт меню "${item}"`, async () => {
        await expect(lkPage.locators.sidebar.getByText(item, { exact: true })).toBeVisible();
      });
    }
  });

  test('Вкладка "Настройки" содержит форму изменения пароля', async ({ lkPage }) => {
    await test.step('Открыть вкладку "Настройки"', async () => {
      await lkPage.open();
      await lkPage.openTab('Настройки');
    });

    await test.step('Проверить элементы управления настройками', async () => {
      await expect(lkPage.locators.settingsSection.changePhotoButton).toBeVisible();
      await expect(lkPage.locators.settingsSection.changePasswordButton).toBeVisible();
    });
  });
});
