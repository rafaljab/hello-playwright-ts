import { test, expect } from "@base/gui/base";

test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach("go to login page", async ({ loginPage }) => {
  await loginPage.navigate();
});

test("login with incorrect email", async ({ loginPage }) => {
  // Given
  const email = "test@example.com";
  const password = "admin123";

  // When
  await loginPage.login(email, password);

  // Then
  await expect(loginPage.page).toHaveURL(loginPage.url);
  await expect(loginPage.alertNotification).toBeVisible();
});

test("login with incorrect password", async ({ loginPage }) => {
  // Given
  const email = "admin@example.com";
  const password = "test";

  // When
  await loginPage.login(email, password);

  // Then
  await expect(loginPage.page).toHaveURL(loginPage.url);
  await expect(loginPage.alertNotification).toBeVisible();
});
