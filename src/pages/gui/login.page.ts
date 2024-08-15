import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "@base/gui/base.page";
import { RELATIVE_URL } from "@playwright.config";

export class LoginPage extends BasePage {
  readonly url: string = `${RELATIVE_URL}/login`;

  readonly emailField: Locator;
  readonly passField: Locator;
  readonly loginBtn: Locator;
  readonly alertNotification: Locator;

  constructor(page: Page) {
    super(page);

    this.emailField = page.getByRole("textbox", { name: "Email Address" });
    this.passField = page.getByRole("textbox", { name: "Password" });
    this.loginBtn = page.getByRole("button", { name: "LOG IN" });
    this.alertNotification = page.getByRole("alert");
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passField.fill(password);
    await this.loginBtn.click();
  }
}
