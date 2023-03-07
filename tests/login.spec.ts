import { test, expect } from '@playwright/test';

test('get started link', async ({ page }) => {
  await page.goto('https://rafaljab.github.io/gui-automation-playground');

  await page.locator('#email').fill('admin@example.com')
  await page.locator('#password').fill('admin123')
  await page.locator('button[type="submit"]').click()

  await expect(page).toHaveURL('https://rafaljab.github.io/gui-automation-playground');
  await expect(page.locator('div[role="alert"]')).toBeHidden();
});
