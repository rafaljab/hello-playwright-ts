import { type Page, type Locator } from "@playwright/test";
import { BaseFragment } from "@base/gui/base.fragment";
import { type BasePage } from "@base/gui/base.page";

export class LeftMenuFragment extends BaseFragment {
  readonly homeLink: Locator;
  readonly shopLink: Locator;
  readonly todosLink: Locator;

  constructor(page: Page, parentPage?: BasePage) {
    super(page, parentPage);

    this.homeLink = page.getByRole("link", { name: "Home" });
    this.shopLink = page.getByRole("link", { name: "Shop" });
    this.todosLink = page.getByRole("link", { name: "TODOs" });
  }

  async clickHomeLink() {
    await this.homeLink.click();
  }

  async clickShopLink() {
    await this.shopLink.click();
  }

  async clickTodosLink() {
    await this.todosLink.click();
  }
}
