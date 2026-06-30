import { test as setup, expect } from "@base/gui/base";
import { RELATIVE_URL, authUserStorageStateFile } from "@playwright.config";

setup(
  "authenticate user",
  {
    tag: ["@setup", "@without_storage_state"],
  },
  async ({ loginPage, homePage }) => {
    const user_name = process.env.USER_NAME as string;
    const user_pass = process.env.USER_PASS as string;

    await loginPage.navigate();
    await loginPage.login(user_name, user_pass);

    await expect(homePage.page).toHaveURL(RELATIVE_URL);
    await expect(homePage.pageTitleHeader).toBeVisible();

    // Save storage state
    await homePage.page.context().storageState({ path: authUserStorageStateFile });
  },
);
