import { Locator, Page } from "@playwright/test";
import { ShopPage } from "./shop";
import { TodosPage } from "./todos";

export class LeftMenuFragment {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly shopLink: Locator;
  readonly todosLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByRole("link", { name: "Home" });
    this.shopLink = page.getByRole("link", { name: "Shop" });
    this.todosLink = page.getByRole("link", { name: "TODOs" });
  }

  async clickHomeLink() {
    await this.homeLink.click();
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
