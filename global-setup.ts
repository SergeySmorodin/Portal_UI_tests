// Загружаем .env раньше всего остального - до импорта config (т.к. модули кэшируются)
import 'dotenv/config';
import { Browser, FullConfig, chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { createLoginPage } from './src/pages/login/login-page';
import { config } from './src/config';

const AUTH_DIR = path.join(process.cwd(), 'playwright', '.auth');

/** Сессия администратора (LOGIN/PASSWORD из .env), используется основным проектом. */
export const STORAGE_STATE_PATH = path.join(AUTH_DIR, 'user1.json');

const BASE_URL = process.env.BASE_URL || 'https://example.com';

const checkServerAvailable = async (): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const url = new URL(BASE_URL);
    const client = url.protocol === 'https:' ? https : http;
    const request = client.request(
      url,
      {
        method: 'HEAD',
        timeout: 10_000,
        // Портал использует самоподписанный сертификат, как и в браузере (ignoreHTTPSErrors)
        ...(url.protocol === 'https:' ? { rejectUnauthorized: false } : {}),
      },
      (response) => {
        response.resume();
        resolve();
      }
    );
    request.on('timeout', () => request.destroy(new Error('timeout 10000ms')));
    request.on('error', reject);
    request.end();
  }).catch((error: Error) => {
    throw new Error(
      `Портал недоступен по адресу ${BASE_URL}. Проверьте VPN/сеть/доступность сервера. ` +
        `Исходная ошибка: ${error.message}`
    );
  });
};

const loginAdmin = async (browser: Browser): Promise<void> => {
  await checkServerAvailable();

  const context = await browser.newContext({
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  try {
    const loginPage = createLoginPage(page);
    await loginPage.open();
    await loginPage.login({ username: config.login, password: config.password });

    await page.waitForURL((url) => !url.pathname.includes('/login'), {
      timeout: config.timeouts.long,
    });
  } catch (error) {
    throw new Error(
      `Не удалось авторизоваться на портале ${BASE_URL}. ` +
        `Проверьте доступность сервера и корректность LOGIN/PASSWORD в .env. ` +
        `Исходная ошибка: ${(error as Error).message}`
    );
  }

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
