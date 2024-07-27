import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "@base/gui/base.page";

export class HomePage extends BasePage {
  readonly pageTitleHeader: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitleHeader = page.getByRole("heading", { name: "Home" });
  }
}
