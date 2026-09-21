// Загружаем .env раньше всего остального - до импорта config (т.к. модули кэшируются)
import 'dotenv/config';
import { Browser, FullConfig, chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { createLoginPage } from './src/pages/login/login-page';
import { config } from './src/config';

const AUTH_DIR = path.join(process.cwd(), 'playwright', '.auth');

/** Сессия администратора (LOGIN/PASSWORD из .env), используется основным проектом. */
export const STORAGE_STATE_PATH = path.join(AUTH_DIR, 'user1.json');

const BASE_URL = process.env.BASE_URL || 'https://example.com';

const loginAdmin = async (browser: Browser): Promise<void> => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  const loginPage = createLoginPage(page);
  await loginPage.open();
  await loginPage.login({ username: config.login, password: config.password });

  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: config.timeouts.long,
  });

  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });
  await context.storageState({ path: STORAGE_STATE_PATH });
  await context.close();
};

async function globalSetup(_config: FullConfig): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  await loginAdmin(browser);
  await browser.close();
}

export default globalSetup;
