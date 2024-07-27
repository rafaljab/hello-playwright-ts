import { type Page, type Locator } from "@playwright/test";
import { BaseFragment } from "@base/gui/base.fragment";
import { type BasePage } from "@base/gui/base.page";
import { ShopPage } from "@pages/gui/shop.page";
import { TodosPage } from "@pages/gui/todos.page";
import { HomePage } from "@pages/gui/home.page";

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
    return new HomePage(this.page);
  }

  async clickShopLink() {
    await this.shopLink.click();
    return new ShopPage(this.page);
  }

  async clickTodosLink() {
    await this.todosLink.click();
    return new TodosPage(this.page);
  }
}
