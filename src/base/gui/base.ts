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
    const callback = async () => {
      const user_email = process.env.USER_EMAIL as string;
      const user_pass = process.env.USER_PASS as string;

      await loginPage.navigate();
      await loginPage.login(user_email, user_pass);
    };
    await use(callback);
  },
});

export { expect } from "@playwright/test";

export function step<This, Args extends never[], Return>(stepName?: string, options?: { hideArgs?: boolean }) {
  /**
   * `step` decorator can be used to create test step with given name (it will include values of function's parameters).
   *
   * **Usage**
   *
   * ```js
   * @step("Verify item is not checked")
   * async verifyItemIsChecked(itemName: string) {
   *   await expect(this.itemCheckbox(itemName)).toBeChecked();
   * }
   * ```
   * If you don't want to print parameter values, use `hideArgs` option which is by default set to `false`:
   *
   * ```js
   * @step("Login", { hideArgs: true })
   * async login(email: string, password: string) {
   *   await this.emailField.fill(email);
   *   await this.passField.fill(password);
   *   await this.loginBtn.click();
   * }
   * ```
   * @param stepName A string containing base step name.
   *
   */
  return function decorator(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext,
  ) {
    return function replacementMethod(this: This, ...args: Args): Promise<Return> {
      const hideArgs = options?.hideArgs || false;
      const argsValues = !hideArgs && args.length > 0 ? `[${args.map(a => JSON.stringify(a)).join(", ")}]` : "";
      // @ts-expect-error error
      const name = `${this.constructor.name}: ${stepName || (context.name as string)} ${argsValues}`;
      return test.step(name, async () => {
        return await target.call(this, ...args);
      });
    };
  };
}
