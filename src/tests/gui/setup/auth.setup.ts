import { test as setup, expect } from "@base/gui/base";
import { RELATIVE_URL, authUserStorageStateFile } from "@playwright.config";

setup(
  "authenticate user",
  {
    tag: ["@setup", "@without_storage_state"],
  },
  async ({ loginPage, login }) => {
    // When
    login();

    // Then
    await expect(loginPage.page).toHaveURL(RELATIVE_URL);
    await expect(loginPage.alertNotification).toBeHidden();

    // Then - Save storage state
    await loginPage.page.context().storageState({ path: authUserStorageStateFile });
  },
);
