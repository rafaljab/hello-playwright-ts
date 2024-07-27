import { test as baseTest } from "@playwright/test";
import { LoginPage } from "@pages/gui/login.page";
import { TopMenuFragment } from "@pages/gui/fragments/top-menu.fragment";
import { LeftMenuFragment } from "@pages/gui/fragments/left-menu.fragment";
import { HomePage } from "@pages/gui/home.page";
import { ShopPage } from "@pages/gui/shop.page";
import { TodosPage } from "@pages/gui/todos.page";

type Fixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  shopPage: ShopPage;
  todosPage: TodosPage;

  topMenuFragment: TopMenuFragment;
  leftMenuFragment: LeftMenuFragment;

  login: () => void;
};

export const test = baseTest.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  todosPage: async ({ page }, use) => {
    await use(new TodosPage(page));
  },

  topMenuFragment: async ({ page }, use) => {
    await use(new TopMenuFragment(page));
  },
  leftMenuFragment: async ({ page }, use) => {
    await use(new LeftMenuFragment(page));
  },

  login: async ({ loginPage }, use) => {
    const login = async () => {
      await loginPage.navigate();
      await loginPage.login("admin@example.com", "admin123");
    };
    await use(login);
  },
});

export { expect } from "@playwright/test";
