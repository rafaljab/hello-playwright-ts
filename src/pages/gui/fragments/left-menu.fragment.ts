import { type Page, type Locator } from "@playwright/test";
import { step } from "@base/gui/base";
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

  @step("Click Home link")
  async clickHomeLink() {
    await this.homeLink.click();
  }

  @step("Click Shop link")
  async clickShopLink() {
    await this.shopLink.click();
  }

  @step("Click Todos link")
  async clickTodosLink() {
    await this.todosLink.click();
  }
}
