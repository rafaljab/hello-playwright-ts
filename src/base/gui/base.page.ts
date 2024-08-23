import { type Page } from "@playwright/test";
import { step } from "@base/gui/base";
import { RELATIVE_URL } from "@playwright.config";

export abstract class BasePage {
  readonly page: Page;
  readonly url: string = RELATIVE_URL;

  protected constructor(page: Page) {
    this.page = page;
  }

  @step("Go to page")
  async navigate() {
    await this.page.goto(this.url);
  }

  async delay(time: number): Promise<void> {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
}
