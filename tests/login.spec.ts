import { test, expect } from "../base";
import { RELATIVE_URL } from "../playwright.config";

test("login with correct data", async ({ loginPage, page }) => {
  // Given
  const email = "admin@example.com";
  const password = "admin123";

  // When
  await loginPage.login(email, password);

  // Then
  await expect(page).toHaveURL(RELATIVE_URL);
  await expect(loginPage.alertNotification).toBeHidden();
});

test("login with incorrect email", async ({ loginPage, page }) => {
  // Given
  const email = "test@example.com";
  const password = "admin123";

  // When
  await loginPage.login(email, password);

  // Then
  await expect(page).toHaveURL(loginPage.url);
  await expect(loginPage.alertNotification).toBeVisible();
});

test("login with incorrect password", async ({ loginPage, page }) => {
  // Given
  const email = "admin@example.com";
  const password = "test";

  // When
  await loginPage.login(email, password);

  // Then
  await expect(page).toHaveURL(loginPage.url);
  await expect(loginPage.alertNotification).toBeVisible();
});
