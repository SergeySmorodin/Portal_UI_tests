import { Page, Locator, expect } from '@playwright/test';

export const testHelpers = {
  waitForElement: async (locator: Locator, timeout: number = 10000): Promise<void> => {
    await locator.waitFor({ state: 'visible', timeout });
  },

  getText: async (locator: Locator): Promise<string> => {
    if (await locator.isVisible()) {
      return (await locator.textContent())?.trim() || '';
    }
    return '';
  },

  isElementPresent: async (locator: Locator): Promise<boolean> => {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  },

  createScreenshot: async (page: Page, name: string): Promise<string> => {
    const path = `screenshots/${name}-${Date.now()}.png`;
    await page.screenshot({ path, fullPage: true });
    return path;
  },

  clickWhenVisible: async (locator: Locator, timeout: number = 10000): Promise<void> => {
    await expect(locator).toBeVisible({ timeout });
    await locator.click();
  },

  fillField: async (locator: Locator, text: string, timeout: number = 10000): Promise<void> => {
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(text);
  },

  waitForNavigation: async (page: Page, pathname: string, timeout: number = 15000): Promise<void> => {
    await page.waitForURL((url) => !url.pathname.includes(pathname), { timeout });
  },

  waitForUrlContains: async (page: Page, pathname: string, timeout: number = 10000): Promise<void> => {
    await page.waitForURL((url) => url.pathname.includes(pathname), { timeout });
  },

  openPage: async (page: Page, baseUrl: string, path: string): Promise<void> => {
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
  },

  selectRandomOption: async (locator: Locator): Promise<string> => {
    const options = locator.locator('option');
    const count = await options.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      const val = await options.nth(i).getAttribute('value');
      if (val) values.push(val);
    }
    const randomIndex = Math.floor(Math.random() * values.length);
    const selected = values[randomIndex];
    await locator.selectOption(selected);
    return selected;
  },

  selectRandomFromList: async (container: Locator, itemSelector: string = 'button'): Promise<string> => {
    await container.waitFor({ state: 'visible', timeout: 10000 });
    const items = container.locator(itemSelector);
    const count = await items.count();
    const randomIndex = Math.floor(Math.random() * count);
    const selectedText = (await items.nth(randomIndex).textContent())?.trim() || '';
    await items.nth(randomIndex).click();
    return selectedText;
  },
};
