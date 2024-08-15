import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "@base/gui/base.page";
import { RELATIVE_URL } from "@playwright.config";

export class HomePage extends BasePage {
  readonly url: string = `${RELATIVE_URL}/`;

  readonly pageTitleHeader: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitleHeader = page.getByRole("heading", { name: "Home" });
  }
}
