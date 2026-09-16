import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Dump OT/PB table HTML', () => {
  test('Dump LP table', async ({ laborProtectionPage }) => {
    await laborProtectionPage.open();
    await laborProtectionPage.selectCategories(['Охрана труда']);
    await laborProtectionPage.clickShow();
    await expect(laborProtectionPage.isResultsVisible()).resolves.toBe(true);
    const thead = await laborProtectionPage.locators.resultsTable.locator('thead').evaluate((el) => el.outerHTML);
    console.log('LP THEAD:', thead);
    const rows = await laborProtectionPage.locators.resultsTable.locator('tbody tr').evaluateAll((els) =>
      els.slice(0, 5).map((el) => el.outerHTML)
    );
    rows.forEach((r, i) => console.log('LP ROW' + i + ':', r.slice(0, 1200)));
  });

  test('Dump MC table', async ({ medicalCommissionPage }) => {
    await medicalCommissionPage.open();
    await medicalCommissionPage.selectCategories(['Медицинская комиссия']);
    await medicalCommissionPage.clickShow();
    await expect(medicalCommissionPage.isResultsVisible()).resolves.toBe(true);
    const thead = await medicalCommissionPage.locators.resultsTable.locator('thead').evaluate((el) => el.outerHTML);
    console.log('MC THEAD:', thead);
    const rows = await medicalCommissionPage.locators.resultsTable.locator('tbody tr').evaluateAll((els) =>
      els.slice(0, 5).map((el) => el.outerHTML)
    );
    rows.forEach((r, i) => console.log('MC ROW' + i + ':', r.slice(0, 1200)));
  });
});