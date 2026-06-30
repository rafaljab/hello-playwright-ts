import { type Locator, type Page } from "@playwright/test";
import { step } from "@base/gui/base";
import { BasePage } from "@base/gui/base.page";
import { RELATIVE_URL } from "@playwright.config";

export class LoginPage extends BasePage {
  readonly url: string = `${RELATIVE_URL}/login`;

  readonly usernameField: Locator;
  readonly passField: Locator;
  readonly loginBtn: Locator;
  readonly alertNotification: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameField = page.getByRole("textbox", { name: "Username" });
    this.passField = page.getByRole("textbox", { name: "Password" });
    this.loginBtn = page.getByRole("button", { name: "LOG IN" });
    this.alertNotification = page.getByRole("alert");
  }

  @step("Login", { hideArgs: true })
  async login(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passField.fill(password);
    await this.loginBtn.click();
  }
}
