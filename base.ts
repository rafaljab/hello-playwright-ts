import { Page, test as base, BrowserContextOptions } from '@playwright/test';
import { LoginPage } from './pom/login';
import { LeftMenuFragment } from './pom/left-menu';
import { ShopPage } from './pom/shop';
import { TodosPage } from './pom/todos';
import authenticatedStateJson from 'tests/test-data/authenticated-state.json';
import todosStateJson from 'tests/test-data/todos_state.json';

type MyFixtures = {
  loginPage: LoginPage;
  login: void;
  pageAuthenticated: Page;
  leftMenuFragment: LeftMenuFragment;
  shopPage: ShopPage;
  shopPageAuthenticated: ShopPage;
  todosPage: TodosPage;
  todosPageAuthenticated: TodosPage;
  todosPageWithState: TodosPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },
  login: async ({ loginPage }, use) => {
    await loginPage.login('admin@example.com', 'admin123');
    await use();
  },
  pageAuthenticated: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext(
      { storageState: replaceOriginInState(authenticatedStateJson, baseURL as string) }
    );
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  leftMenuFragment: async ({ page }, use) => {
    const leftMenuFragment = new LeftMenuFragment(page);
    await use(leftMenuFragment);
  },
  shopPage: async ({ leftMenuFragment, login }, use) => {
    await login;
    const shopPage = await leftMenuFragment.clickShopLink();
    await use(shopPage);
  },
  shopPageAuthenticated: async ({ pageAuthenticated }, use) => {
    const shopPageAuthenticated = new ShopPage(pageAuthenticated);
    await shopPageAuthenticated.navigate();
    await use(shopPageAuthenticated);
  },
  todosPage: async ({ leftMenuFragment, login }, use) => {
    await login;
    const todosPage = await leftMenuFragment.clickTodosLink();
    await use(todosPage);
  },
  todosPageAuthenticated: async ({ pageAuthenticated }, use) => {
    const todosPageAuthenticated = new TodosPage(pageAuthenticated);
    await todosPageAuthenticated.navigate();
    await use(todosPageAuthenticated);
  },
  todosPageWithState: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext(
      { storageState: replaceOriginInState(todosStateJson, baseURL as string) }
    );
    const page = await context.newPage();
    const todosPage = new TodosPage(page);
    await todosPage.navigate();
    await use(todosPage);
    await context.close();
  }
});

function replaceOriginInState(data: BrowserContextOptions['storageState'], baseUrl: string) {
  if (data != null && typeof data !== 'string' && baseUrl != null) {
    data.origins[0].origin = baseUrl;
  }
  return data;
}

export { expect } from '@playwright/test';
