import { Locator, Page } from '@playwright/test';

export class TopMenuFragment {
  readonly page: Page;
  readonly hamburgerBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hamburgerBtn = page.getByRole('button').first();
  }

  async openMenu() {
    await this.hamburgerBtn.click();
  }
}
