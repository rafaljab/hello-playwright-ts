import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "@base/gui/base.page";
import { RELATIVE_URL } from "@playwright.config";

export class LoginPage extends BasePage {
  readonly url = RELATIVE_URL + "/login";
  readonly emailField: Locator;
  readonly passField: Locator;
  readonly loginBtn: Locator;
  readonly alertNotification: Locator;

  constructor(page: Page) {
    super(page);

    this.emailField = page.locator("#email");
    this.passField = page.locator("#password");
    this.loginBtn = page.locator('button[type="submit"]');
    this.alertNotification = page.locator('div[role="alert"]');
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passField.fill(password);
    await this.loginBtn.click();
  }
}
