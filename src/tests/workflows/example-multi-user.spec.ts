import { test, expect } from '../../fixtures/test-fixtures';

// Демонстрация multi-user сценария.
// Этот спека запускается в проекте chromium-user2 (основная учётка — LOGIN_2/PASSWORD_2).
// Внутри теста можно открыть дополнительный контекст под другим пользователем
// (user1 — основная учётка, user3 — третья, если задана LOGIN_3/PASSWORD_3).
//
// Пример сценария «создаёт один, обрабатывает второй, согласовывает третий»:
//   - основной пользователь проекта (user2) обрабатывает заявку;
//   - createUserPage('user1') — страница создателя;
//   - createUserPage('user3') — страница согласующего.

// test.describe('Multi-user workflow', () => {
//   test('второй пользователь видит контекст, созданные страницы других ролей доступны', async ({
//     page,
//     authenticatedPage,
//     createUserPage,
//   }) => {
//     await test.step('основной пользователь проекта (user2) авторизован', async () => {
//       expect(authenticatedPage).toBe(page);
//       await page.waitForLoadState('domcontentloaded');
//     });

//     await test.step('открыть страницу под первым пользователем (создатель)', async () => {
//       const { page: creatorPage, context } = await createUserPage('user1');
//       expect(creatorPage).toBeTruthy();

//       // После использования контекст обязательно закрываем
//       await context.close();
//     });

//     await test.step('открыть страницу под третьим пользователем (согласующий), если настроен', async () => {
//       try {
//         const { page: approverPage, context } = await createUserPage('user3');
//         expect(approverPage).toBeTruthy();
//         await context.close();
//       } catch (error) {
//         // LOGIN_3 не задан — сценарий опциональный
//         test.info().annotations.push({
//           type: 'note',
//           description: `Третья учётка не настроена: ${(error as Error).message}`,
//         });
//       }
//     });
//   });
// });
