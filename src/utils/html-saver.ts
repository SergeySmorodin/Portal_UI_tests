import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import type { Page } from '@playwright/test';

const SAVE_DIR = join(process.cwd(), 'html-snapshots');

/**
 * Сохраняет HTML-разметку страницы (или её части) в файл.
 *
 * @param page     — объект страницы Playwright
 * @param selector — CSS-селектор элемента, начиная с которого сохранять разметку.
 *                   Если не указан — сохраняется вся страница.
 * @param fileName — имя файла без расширения (по умолчанию timestamp)
 * @returns полный путь к сохранённому файлу
 */
export const savePageHtml = async (
  page: Page,
  selector?: string,
  fileName?: string
): Promise<string> => {
  mkdirSync(SAVE_DIR, { recursive: true });

  const name = fileName ?? `page-${Date.now()}`;
  const filePath = join(SAVE_DIR, `${name}.html`);

  await page.waitForLoadState('networkidle').catch(() => {});

  const html = selector
    ? await page
        .locator(selector)
        .first()
        .innerHTML()
        .catch(() => page.content())
    : await page.content();

  writeFileSync(filePath, html, 'utf-8');

  try {
    execSync(`npx prettier --write --parser html --print-width 120 "${filePath}"`, {
      stdio: 'ignore',
    });
  } catch {}

  return filePath;
};
