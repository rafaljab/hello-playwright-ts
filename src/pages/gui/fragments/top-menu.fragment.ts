import { type Page, type Locator } from "@playwright/test";
import { BaseFragment } from "@base/gui/base.fragment";
import { type BasePage } from "@base/gui/base.page";

export class TopMenuFragment extends BaseFragment {
  readonly hamburgerBtn: Locator;

  constructor(page: Page, parentPage?: BasePage) {
    super(page, parentPage);

    this.hamburgerBtn = page.getByRole("button").first();
  }

  async openMenu() {
    await this.hamburgerBtn.click();
  }
}
