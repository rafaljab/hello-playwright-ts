import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/login';

test('login with correct data', async ({ page }) => {
  // Given
  const email = 'admin@example.com';
  const password = 'admin123';
  const loginPage = new LoginPage(page);

  // When
  await loginPage.navigate();
  await loginPage.login(email, password);

  // Then
  await expect(page).toHaveURL('https://rafaljab.github.io/gui-automation-playground');
  await expect(loginPage.alertNotification).toBeHidden();
});

test('login with incorrect email', async ({ page }) => {
  // Given
  const email = 'test@example.com';
  const password = 'admin123';
  const loginPage = new LoginPage(page);

  // When
  await loginPage.navigate();
  await loginPage.login(email, password);

  // Then
  await expect(page).toHaveURL(loginPage.url);
  await expect(loginPage.alertNotification).toBeVisible();
});

test('login with incorrect password', async ({ page }) => {
  // Given
  const email = 'admin@example.com';
  const password = 'test';
  const loginPage = new LoginPage(page);

  // When
  await loginPage.navigate();
  await loginPage.login(email, password);

  // Then
  await expect(page).toHaveURL(loginPage.url);
  await expect(loginPage.alertNotification).toBeVisible();
});
