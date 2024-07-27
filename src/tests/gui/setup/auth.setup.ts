import { test as setup, expect } from "@base/gui/base";
import { RELATIVE_URL, authUserStorageStateFile } from "@playwright.config";

setup("authenticate user with correct data", async ({ loginPage, login }) => {
  // When
  login;

  // Then
  await expect(loginPage.page).toHaveURL(RELATIVE_URL);
  await expect(loginPage.alertNotification).toBeHidden();

  // Save storage state
  await loginPage.page.context().storageState({ path: authUserStorageStateFile });
});
