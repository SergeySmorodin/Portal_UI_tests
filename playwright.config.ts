import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { STORAGE_STATE_PATH, authUsers } from './global-setup';

// Загружаем .env ПЕРЕД созданием конфигурации
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const BASE_URL = process.env.BASE_URL || 'https://example.com';

const chromeDevice = {
  ...devices['Desktop Chrome'],
  headless: process.env.HEADLESS === 'true',
};

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,

  globalSetup: './global-setup.ts',

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list'],
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
  },

  projects: [
    {
      name: 'chromium',
      testIgnore: ['**/login-page.spec.ts', '**/workflows/**'],
      use: {
        ...chromeDevice,
        storageState: STORAGE_STATE_PATH,
      },
    },
    {
      name: 'chromium-login',
      testMatch: '**/login-page.spec.ts',
      use: { ...chromeDevice },
    },
    // Multi-user сценарии: появляются автоматически, если в .env заданы LOGIN_2/LOGIN_3
    ...authUsers.slice(1).map((user, i) => ({
      name: `chromium-user${i + 2}`,
      testMatch: '**/workflows/**',
      use: {
        ...chromeDevice,
        storageState: user.storageStatePath,
      },
    })),
  ],
});
