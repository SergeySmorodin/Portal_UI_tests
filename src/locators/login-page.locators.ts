import { Page } from '@playwright/test';

export const createLoginPageLocators = (page: Page) => ({
  usernameInput: page.locator('#username'),
  passwordInput: page.locator('#pass'),
  loginButton: page.getByRole('button', { name: 'Вход' }),
  lkLink: page.locator('a[href="/lk"]'),
  errorMessage: page
    .locator('.error-message, .alert-danger, .alert-error, [class*="error"]')
    .first(),
});

export type LoginPageLocators = ReturnType<typeof createLoginPageLocators>;
