import { test as base } from '@playwright/test';
import { LoginPage } from './pom/login';
import { LeftMenuFragment } from './pom/left-menu';
import { ShopPage } from './pom/shop';

type MyFixtures = {
  loginPage: LoginPage;
  login: Promise<void>;
  leftMenuFragment: LeftMenuFragment;
  shopPage: ShopPage;
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
  leftMenuFragment: async ({ page, login }, use) => {
    const leftMenuFragment = new LeftMenuFragment(page);
    await use(leftMenuFragment);
  },
  shopPage: async ({ leftMenuFragment }, use) => {
    const shopPage = await leftMenuFragment.clickShopLink();
    await use(shopPage);
  }
});

export { expect } from '@playwright/test';
