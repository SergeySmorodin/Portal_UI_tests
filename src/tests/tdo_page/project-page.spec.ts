import { test, expect } from '../../fixtures/test-fixtures';
import { config } from '../../config/config';
import { projectFactory } from '../../data/project-factory';
import { workFactory } from '../../data/work-factory';
import { api } from '../../data/api';

test.describe('Создание мегапроекта', () => {
  test('Заполнение формы, сохранение и проверка в списке', async ({
    page,
    projectPage,
    projectsListPage,
  }) => {
    const project = projectFactory.draft();

    await test.step('Открыть страницу создания мегапроекта', async () => {
      await projectPage.open();
      await expect(projectPage.locators.heading).toHaveText('Создание проекта');
    });

    await test.step('Заполнить основные поля', async () => {
      await projectPage.fillBasicFields(project);
      await expect(projectPage.locators.codeInput).toHaveValue(project.code);
    });

    await test.step('Выбрать статус Действующий', async () => {
      const status = await projectPage.selectStatus('Действующий');
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

    await test.step('Сохранить мегапроект', async () => {
      await projectPage.runAndCheckResponse(api.project, () => projectPage.save());
      await page.waitForURL((url) => url.pathname.includes('/TDO/Project/edit/'), {
        timeout: config.timeouts.long,
      });
      await expect(projectPage.locators.heading).toHaveText('Редактирование проекта');
    });

    await test.step('Найти мегапроект в списке через поиск', async () => {
      await projectsListPage.open();

      await projectsListPage.searchByCode(project.code);

      const projectRow = projectsListPage.locators.projectCodeCell(project.code);
      await expect(projectRow).toBeVisible({ timeout: config.timeouts.normal });
    });
  });

  test('Создать мегапроект и добавить в него работу', async ({
    page,
    projectPage,
    projectsListPage,
    workPage,
    worksListPage,
    allWorksListPage,
  }) => {
    const project = projectFactory.active();
    const work = workFactory.standard({
      startDate: project.startDate,
      stopDate: project.stopDate,
    });

    await test.step('Открыть страницу создания мегапроекта', async () => {
      await projectPage.open();
      await expect(projectPage.locators.heading).toHaveText('Создание проекта');
    });

    await test.step('Заполнить основные поля', async () => {
      await projectPage.fillBasicFields(project);
      await expect(projectPage.locators.codeInput).toHaveValue(project.code);
    });

    await test.step('Выбрать статус Действующий', async () => {
      const status = await projectPage.selectStatus('Действующий');
      expect(status).toBeTruthy();
    });

    await test.step('Выбрать рандомную группу, тип, подразделение, вид проекта', async () => {
      expect(await projectPage.selectRandomGroupProject()).toBeTruthy();
      expect(await projectPage.selectRandomTypeProject()).toBeTruthy();
      expect(await projectPage.selectRandomDepartment()).toBeTruthy();
      expect(await projectPage.selectRandomKindProject()).toBeTruthy();
    });

    await test.step('Сохранить мегапроект', async () => {
      await projectPage.runAndCheckResponse(api.project, () => projectPage.save());
      await page.waitForURL((url) => url.pathname.includes('/TDO/Project/edit/'), {
        timeout: config.timeouts.long,
      });
      await expect(projectPage.locators.heading).toHaveText('Редактирование проекта');
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
  });
});
