import { Locator, Page } from "@playwright/test";
import { RELATIVE_URL } from "../playwright.config";

export class LoginPage {
  url = RELATIVE_URL + "/login";
  readonly page: Page;
  readonly emailField: Locator;
  readonly passField: Locator;
  readonly loginBtn: Locator;
  readonly alertNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.locator("#email");
    this.passField = page.locator("#password");
    this.loginBtn = page.locator('button[type="submit"]');
    this.alertNotification = page.locator('div[role="alert"]');
  }

  async navigate() {
    await this.page.goto(this.url);
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passField.fill(password);
    await this.loginBtn.click();
  }
}
