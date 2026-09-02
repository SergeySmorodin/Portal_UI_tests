import { test, expect } from '../../fixtures/test-fixtures';
import { config } from '../../config/config';
import { projectFactory } from '../../data/project-factory';
import { workFactory } from '../../data/work-factory';
import { api } from '../../data/api/api';
import { createProjectViaApi } from '../../data/api/project-api';

test.describe('Работы', () => {
  test(
    'Создать мегапроект через API и добавить в него работу',
    { tag: '@smoke' },
    async ({ page, projectsListPage, workPage, worksListPage, allWorksListPage, apiRequest }) => {
      const project = projectFactory.active();
      const work = workFactory.standard({
        startDate: project.startDate,
        stopDate: project.stopDate,
      });

      await test.step('Создать мегапроект через API', async () => {
        await createProjectViaApi(apiRequest, project);
      });

      await test.step('Найти мегапроект в списке и перейти по ссылке Работы', async () => {
        await projectsListPage.open();
        await projectsListPage.searchByCode(project.code);
        const projectRow = projectsListPage.locators.projectCodeCell(project.code);
        await expect(projectRow).toBeVisible({ timeout: config.timeouts.normal });

        await projectsListPage.openWorks(project.code);
      });

      await test.step('Создать новую работу через кнопку "+" в панели навигации', async () => {
        await worksListPage.addWork();
        await expect(workPage.locators.heading).toHaveText('Создание работы');
      });

      await test.step('Заполнить форму работы', async () => {
        await workPage.fillBasicFields(work);
        await expect(workPage.locators.nameInput).toHaveValue(work.name);
      });

      await test.step('Выбрать рандомный договор', async () => {
        const contract = await workPage.selectContract();
        expect(contract.length).toBeGreaterThan(0);
      });

      await test.step('Сохранить работу', async () => {
        await workPage.runAndCheckResponse(api.work, () => workPage.save());
        await page.waitForURL((url) => url.pathname.includes('/TDO/Work/edit/'), {
          timeout: config.timeouts.long,
        });
        await expect(workPage.locators.heading).toHaveText('Редактирование работы');
      });

      await test.step('Найти созданную работу в списке всех работ', async () => {
        await allWorksListPage.open();

        await allWorksListPage.searchByName(work.name);

        const workRow = allWorksListPage.locators.workNameCell(work.name);
        await expect(workRow).toBeVisible({ timeout: config.timeouts.normal });
      });
    }
  );
});
