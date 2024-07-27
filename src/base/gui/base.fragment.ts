import { type Page } from "@playwright/test";
import { type BasePage } from "@base/gui/base.page";

export abstract class BaseFragment {
  readonly page: Page;
  parentPage: BasePage | undefined;

  protected constructor(page: Page, parentPage?: BasePage) {
    this.page = page;
    this.parentPage = parentPage;
  }
}
