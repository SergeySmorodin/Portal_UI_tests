import { createLoginPage } from '../../pages/login/login-page';
import { expect, test } from '../../fixtures/test-fixtures';

// FIXME баг бэкенда: POST /api/auth/users/ для любого нового логина стабильно отвечает
// 400 «Невозможно создать учетную запись.». Диагностика (проверено напрямую через API):
//   - валидация полей работает: без password -> {"password":["Обязательное поле."]},
//     существующий username -> {"username":["Пользователь с таким username уже существует."]};
//   - дополнительные поля (snils, email, full_name, first/last_name) игнорируются —
//     т.е. «обязательных» полей вроде СНИЛС у сериализатора НЕТ;
//   - для нового логина + валидного пароля падает уже внутри serializer.create()/
//     perform_create (djoser: IntegrityError -> fail("cannot_create_user")), подробности замаскированы.
// Вывод: создание произвольных учёток через API не поддерживается (учётки заводятся из AD/1C-синка,
// UI создания пользователей в приложении нет). Поэтому фикстуры createdUser/createUserPage
// не могут создать пользователя
test.describe('Создание пользователя через API', () => {
  test.fixme(
    'Созданный через API пользователь может авторизоваться',
    { tag: '@smoke' },
    async ({ browser, createdUser }) => {
      test.info().annotations.push({
        type: 'skip reason',
        description:
          'Бэкенд маскирует ошибку в create() (400 "Невозможно создать учетную запись.") ' +
          'для любого нового логина; валидация полей ок, доп. полей не требует',
      });

      await test.step('Проверить, что пользователь создан через API /api/auth/users/', async () => {
        expect(createdUser.uuid).toBeTruthy();
        expect(createdUser.username).toBeTruthy();
      });

      await test.step('Войти под созданным пользователем в новом контексте', async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loginPage = createLoginPage(page);

        await loginPage.open();
        await loginPage.login({ username: createdUser.username, password: createdUser.password });
        await loginPage.verifySuccessfulLogin();

        await context.close();
      });
    }
  );
});
