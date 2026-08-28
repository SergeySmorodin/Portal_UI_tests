import { Page, Locator, expect } from '@playwright/test';
import { config } from '../config/config';

export const createBasePage = (page: Page) => {
  const timeout = config.timeouts.normal;

  const api = {
    page,

    navigate: async (url: string): Promise<void> => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
    },

    openRelative: async (path: string): Promise<void> => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
    },

    click: async (locator: Locator): Promise<void> => {
      await expect(locator).toBeVisible({ timeout });
      await locator.click();
    },

    fill: async (locator: Locator, text: string): Promise<void> => {
      await expect(locator).toBeVisible({ timeout });
      await locator.fill(text);
    },

    expectVisible: async (locator: Locator): Promise<void> => {
      await locator.waitFor({ state: 'visible', timeout });
    },

    waitForElement: async (locator: Locator, t: number = timeout): Promise<void> => {
      await locator.waitFor({ state: 'visible', timeout: t });
    },

    isElementPresent: async (locator: Locator): Promise<boolean> => {
      try {
        return await locator.isVisible();
      } catch {
        return false;
      }
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

    selectRandomFromList: async (
      container: Locator,
      itemSelector: string = 'button'
    ): Promise<string> => {
      await container.waitFor({ state: 'visible', timeout });
      const items = container.locator(itemSelector);
      const count = await items.count();
      const randomIndex = Math.floor(Math.random() * count);
      const selectedText = (await items.nth(randomIndex).textContent())?.trim() || '';
      await items.nth(randomIndex).click();
      return selectedText;
    },

    openSearchableDropdown: async (
      trigger: Locator,
      match: 'first' | 'last' = 'first'
    ): Promise<{ container: Locator; opened: boolean }> => {
      await trigger.waitFor({ state: 'visible', timeout: config.timeouts.short });
      await trigger.click();
      const idx = match === 'last' ? -1 : 0;
      const searchInput = page.locator('input[placeholder="Поиск..."]').nth(idx);
      const container = page.locator('.max-h-60').nth(idx);
      try {
        await searchInput.waitFor({ state: 'visible', timeout: config.timeouts.short });
        await searchInput.fill('');
      } catch {}
      let opened = false;
      try {
        await container.waitFor({ state: 'visible', timeout: config.timeouts.short });
        opened = true;
      } catch {}
      return { container, opened };
    },

    selectRandomFromSearchable: async (trigger: Locator): Promise<string> => {
      const { container, opened } = await api.openSearchableDropdown(trigger);
      if (!opened) return '';
      return api.selectRandomFromList(container);
    },

    addRowAndSelectFromSearchable: async (
      addButton: Locator,
      rowButton: Locator
    ): Promise<string> => {
      await api.waitForElement(addButton);
      await addButton.click();
      const rowName = (await rowButton.textContent())?.trim() || '';
      await rowButton.waitFor({ state: 'visible' });
      const { container, opened } = await api.openSearchableDropdown(rowButton, 'last');
      if (opened) {
        return api.selectRandomFromList(container);
      }
      return rowName;
    },

    addRowAndSelectRandomOption: async (
      addButton: Locator,
      rowSelect: Locator
    ): Promise<string> => {
      await api.waitForElement(addButton);
      await addButton.click();
      await rowSelect.waitFor({ state: 'visible' });
      return api.selectRandomOption(rowSelect);
    },

    getErrorMessage: async (): Promise<string> => {
      const errorLocator = page.locator('.error-message, .alert-danger').first();
      if (await errorLocator.isVisible()) {
        return (await errorLocator.textContent())?.trim() || '';
      }
      return '';
    },

    runAndCheckResponse: async (
      urlPart: string,
      action: () => Promise<void>,
      assertStatus: (status: number) => void = (status) => expect(status).toBe(201)
    ): Promise<void> => {
      const responsePromise = page.waitForResponse(
        (resp) => resp.url().includes(urlPart) && resp.request().method() === 'POST',
        { timeout: config.timeouts.long }
      );
      await action();
      const response = await responsePromise;
      assertStatus(response.status());
    },

    takeScreenshot: async (name: string): Promise<string> => {
      const path = `screenshots/${name}-${Date.now()}.png`;
      await page.screenshot({ path, fullPage: true });
      return path;
    },
  };

  return api;
};

export type BasePage = ReturnType<typeof createBasePage>;
