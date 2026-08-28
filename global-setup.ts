// Загружаем .env ПЕРВЫМ импортом — до вычисления config (т.к. импорты хойстятся)
import 'dotenv/config';
import { Browser, FullConfig, chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { createLoginPage } from './src/pages/login/login-page';
import { config } from './src/config/config';

export interface AuthUser {
  id: string;
  login: string;
  password: string;
  storageStatePath: string;
}

const AUTH_DIR = path.join(process.cwd(), 'playwright', '.auth');

const userFor = (suffix: string, index?: number): AuthUser => ({
  id: suffix || 'user1',
  login: index ? process.env[`LOGIN_${index}`] || '' : (config.login || ''),
  password: index ? process.env[`PASSWORD_${index}`] || '' : (config.password || ''),
  storageStatePath: path.join(AUTH_DIR, `${suffix || 'user1'}.json`),
});

export const authUsers: AuthUser[] = [
  userFor('user1'),
  ...(process.env.LOGIN_2 ? [userFor('user2', 2)] : []),
  ...(process.env.LOGIN_3 ? [userFor('user3', 3)] : []),
];

export const STORAGE_STATE_PATH = authUsers[0].storageStatePath;

const BASE_URL = process.env.BASE_URL || 'https://example.com';

const loginUser = async (browser: Browser, user: AuthUser): Promise<void> => {
  const context = await browser.newContext({
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  const loginPage = createLoginPage(page);
  await loginPage.open();
  await loginPage.login({ username: user.login, password: user.password });

  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: config.timeouts.long,
  });

  fs.mkdirSync(path.dirname(user.storageStatePath), { recursive: true });
  await context.storageState({ path: user.storageStatePath });
  await context.close();
};

async function globalSetup(_config: FullConfig): Promise<void> {
  const browser = await chromium.launch({ headless: true });

  for (const user of authUsers) {
    await loginUser(browser, user);
  }

  await browser.close();
}

export default globalSetup;
