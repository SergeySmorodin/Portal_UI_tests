import { test, expect } from '../../fixtures/test-fixtures';
import { config } from '../../config/config';
import { projectFactory } from '../../data/test-data';

test.describe('Создание проекта', () => {
  test('Заполнение формы, сохранение и проверка в списке', async ({
    page,
    projectPage,
    projectsListPage,
  }) => {
    const project = projectFactory.draft();

    await test.step('Открыть страницу создания проекта', async () => {
      await projectPage.open();
      await expect(projectPage.locators.heading).toHaveText('Создание проекта');
    });

    await test.step('Заполнить основные поля', async () => {
      await projectPage.fillBasicFields(project);
      await expect(projectPage.locators.codeInput).toHaveValue(project.code);
    });

    await test.step('Выбрать рандомный статус', async () => {
      const status = await projectPage.selectRandomStatus();
      expect(status).toBeTruthy();
    });

    await test.step('Выбрать рандомную группу проектов', async () => {
      const group = await projectPage.selectRandomGroupProject();
      expect(group).toBeTruthy();
    });

    await test.step('Выбрать рандомный тип проекта', async () => {
      const type = await projectPage.selectRandomTypeProject();
      expect(type).toBeTruthy();
    });

    await test.step('Выбрать рандомное подразделение', async () => {
      const department = await projectPage.selectRandomDepartment();
      expect(department).toBeTruthy();
    });

    await test.step('Выбрать рандомный вид проекта', async () => {
      const kind = await projectPage.selectRandomKindProject();
      expect(kind).toBeTruthy();
    });

    await test.step('Сохранить проект', async () => {
      await projectPage.save();
      await page.waitForURL((url) => url.pathname.includes('/TDO/Project/edit/'), {
        timeout: config.timeouts.long,
      });
      await expect(projectPage.locators.heading).toHaveText('Редактирование проекта');
    });

    await test.step('Найти проект в списке через поиск', async () => {
      await projectsListPage.open();

      await projectsListPage.searchByCode(project.code);

      const projectRow = projectsListPage.locators.projectCodeCell(project.code);
      await expect(projectRow).toBeVisible({ timeout: config.timeouts.normal });
    });
  });
});
