import { test, expect } from "@base/gui/base";

test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach("go to login page", async ({ loginPage }) => {
  await loginPage.navigate();
});

test(
  "login with incorrect username",
  {
    tag: ["@without_storage_state"],
  },
  async ({ loginPage }) => {
    // Given
    const username = "incorrect_" + process.env.USER_NAME;
    const password = process.env.USER_PASS as string;

    // When
    await loginPage.login(username, password);

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
    const username = process.env.USER_NAME as string;
    const password = "incorrect_" + process.env.USER_PASS;

    // When
    await loginPage.login(username, password);

    // Then
    await expect(loginPage.page).toHaveURL(loginPage.url);
    await expect(loginPage.alertNotification).toBeVisible();
  },
);
