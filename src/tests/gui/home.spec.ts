import { test, expect } from "@base/gui/base";

test("page header should be visible", async ({ homePage }) => {
  // When
  await homePage.navigate();

  // Then
  await expect(homePage.page).toHaveURL(homePage.url);
  await expect(homePage.pageTitleHeader).toBeVisible();
});
