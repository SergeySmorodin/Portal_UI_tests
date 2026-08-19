import { test, expect } from '../fixtures/test-fixtures';
import { testData, negativeTestData } from '../data/test-data';

test.describe('Авторизация', () => {
  
  test.describe('Позитивные сценарии', () => {
    
    test('Отображение формы логина', async ({ loginPage }) => {
      await loginPage.open();
      
      await expect(loginPage.locators.usernameInput).toBeVisible();
      await expect(loginPage.locators.passwordInput).toBeVisible();
      await expect(loginPage.locators.loginButton).toBeVisible();
    });
    
    test('Успешная авторизация', async ({ loginPage, page }) => {
      await loginPage.open();
      await loginPage.login();
      
      expect(await loginPage.isLoginSuccessful()).toBeTruthy();
      expect(await loginPage.hasLkLink()).toBeTruthy();
      expect(page.url()).not.toContain('login');
    });
    
  });
  
  test.describe('Негативные сценарии', () => {
    
    test('Вход с неверным паролем', async ({ loginPage, page }) => {
      await loginPage.open();
      
      await loginPage.locators.usernameInput.fill(testData.users.admin.username);
      await loginPage.locators.passwordInput.fill(negativeTestData.wrongPasswords[0]);
      await loginPage.locators.loginButton.click();
      
      await page.waitForLoadState('networkidle');
      
      const errorText = await loginPage.getErrorMessage();
      
      if (errorText) {
        console.log(`Сообщение об ошибке: ${errorText}`);
        await test.info().attach('error-message', {
          body: errorText,
          contentType: 'text/plain',
        });
      } else {
        expect(await loginPage.isLoginSuccessful()).toBeFalsy();
      }
    });
    
    test('Вход с пустыми полями', async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.locators.loginButton.click();
      
      expect(await loginPage.isLoginSuccessful()).toBeFalsy();
    });
    
  });
  
});
