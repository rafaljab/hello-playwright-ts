import { test, expect } from "@base/gui/base";

test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach("go to login page", async ({ loginPage }) => {
  await loginPage.navigate();
});

test(
  "login with incorrect email",
  {
    tag: ["@without_storage_state"],
  },
  async ({ loginPage }) => {
    // Given
    const email = "incorrect_" + process.env.USER_EMAIL;
    const password = process.env.USER_PASS as string;

    // When
    await loginPage.login(email, password);

    // Then
    await expect(loginPage.page).toHaveURL(loginPage.url);
    await expect(loginPage.alertNotification).toBeVisible();
  },
);

test(
  "login with incorrect password",
  {
    tag: ["@without_storage_state"],
  },
  async ({ loginPage }) => {
    // Given
    const email = process.env.USER_EMAIL as string;
    const password = "incorrect_" + process.env.USER_PASS;

    // When
    await loginPage.login(email, password);

    // Then
    await expect(loginPage.page).toHaveURL(loginPage.url);
    await expect(loginPage.alertNotification).toBeVisible();
  },
);
