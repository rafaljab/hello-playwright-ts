import { Page, test as base} from '@playwright/test';
import { LoginPage } from './pom/login';
import { LeftMenuFragment } from './pom/left-menu';
import { ShopPage } from './pom/shop';
import authenticatedStateJson from 'tests/test-data/authenticated-state.json';

type MyFixtures = {
  loginPage: LoginPage;
  login: Promise<void>;
  pageAuthenticated: Page;
  leftMenuFragment: LeftMenuFragment;
  shopPage: ShopPage;
  shopPageAuthenticated: ShopPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },
  login: async ({ loginPage }, use) => {
    await loginPage.login('admin@example.com', 'admin123');
    await use(null);
  },
  pageAuthenticated: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({ storageState: replaceOriginInState(authenticatedStateJson, baseURL) });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  leftMenuFragment: async ({ page, login }, use) => {
    const leftMenuFragment = new LeftMenuFragment(page);
    await use(leftMenuFragment);
  },
  shopPage: async ({ leftMenuFragment }, use) => {
    const shopPage = await leftMenuFragment.clickShopLink();
    await use(shopPage);
  },
  shopPageAuthenticated: async ({ pageAuthenticated }, use) => {
    const shopPageAuthenticated = new ShopPage(pageAuthenticated);
    await shopPageAuthenticated.navigate();
    await use(shopPageAuthenticated);
  }
});

function replaceOriginInState(data, baseUrl) {
  data.origins[0].origin = baseUrl
  return data
}

export { expect } from '@playwright/test';
