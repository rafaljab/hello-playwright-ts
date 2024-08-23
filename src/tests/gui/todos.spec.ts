import { test, expect } from "@base/gui/base";
import { RELATIVE_URL, STORAGE_STATE_PATH } from "@playwright.config";
import tasks from "@test-data/todos/tasks.json";

const todosStorageStateFile = STORAGE_STATE_PATH + "/todos.json";

test.describe("basic tests", async () => {
  test.beforeEach("go to todos page", async ({ todosPage }) => {
    await todosPage.navigate();
  });

  // Execute tests one by one - firstly, save storage state to use it in the next tests
  test.describe.configure({ mode: "serial" });

  test(
    "add todos",
    {
      tag: ["@setup", "@without_storage_state"],
    },
    async ({ todosPage }) => {
      // Given an empty todos list
      await todosPage.verifyThereAreNoTodos();

      // When I add tasks
      await todosPage.addTasks(tasks);

      // Then those tasks are visible
      await todosPage.verifyTodoList(tasks);

      // Save storage state
      await todosPage.page.context().storageState({ path: todosStorageStateFile });
    },
  );

  test.describe("with predefined state", async () => {
    test.use({ storageState: todosStorageStateFile });

    test("load todos from states", async ({ todosPage }) => {
      // Given
      await expect(todosPage.todoItems.first()).toBeVisible();

      // Then
      await todosPage.verifyTodoList(tasks);
    });

    test("toggle todos", async ({ todosPage }) => {
      // Given
      await todosPage.verifyTodoItemIsNotChecked(tasks[0]);

      // When
      await todosPage.toggleTodoItem(tasks[0]);

      // Then
      await todosPage.verifyTodoItemIsChecked(tasks[0]);

      // When
      await todosPage.toggleTodoItem(tasks[0]);

      // Then
      await todosPage.verifyTodoItemIsNotChecked(tasks[0]);
    });

    test("clear todos", async ({ todosPage }) => {
      // Given
      await todosPage.verifyTodoItemsAreVisible(tasks);

      // When
      await todosPage.toggleTodoItem(tasks[0]);
      await todosPage.clearCompletedTasks();

      // Then
      await todosPage.verifyTodoItemIsNotVisible(tasks[0]);
      await todosPage.verifyTodoItemsAreVisible([tasks[1], tasks[2]]);

      // When
      await todosPage.toggleTodoItem(tasks[1]);
      await todosPage.clearCompletedTasks();

      // Then
      await todosPage.verifyTodoItemsAreNotVisible([tasks[0], tasks[1]]);
      await todosPage.verifyTodoItemIsVisible(tasks[2]);
    });
  });
});

test.describe("e2e tests", { tag: ["@without_storage_state", "@e2e"] }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("todos", async ({ login, homePage, topMenuFragment, leftMenuFragment, todosPage }) => {
    // Given
    await test.step("Login and go to todos page", async () => {
      login();
      await expect(homePage.page).toHaveURL(RELATIVE_URL);
      await topMenuFragment.openMenu();
      await leftMenuFragment.clickTodosLink();
    });

    await todosPage.verifyThereAreNoTodos();

    // When
    await todosPage.addTasks([tasks[0], tasks[1]]);

    // Then
    await todosPage.verifyTodoItemsAreVisible([tasks[0], tasks[1]]);
    await todosPage.verifyThereAreTodos();

    // When
    await todosPage.toggleTodoItem(tasks[1]);
    await todosPage.clearCompletedTasks();

    // Then
    await todosPage.verifyTodoItemIsVisible(tasks[0]);
    await todosPage.verifyTodoItemIsNotVisible(tasks[1]);
    await todosPage.verifyThereAreTodos();

    // When
    await todosPage.addTask(tasks[2]);

    // Then
    await todosPage.verifyTodoItemsAreVisible([tasks[0], tasks[2]]);
    await todosPage.verifyTodoItemIsNotVisible(tasks[1]);
    await todosPage.verifyThereAreTodos();

    // When
    await todosPage.toggleTodoItem(tasks[0]);
    await todosPage.toggleTodoItem(tasks[2]);
    await todosPage.clearCompletedTasks();

    // Then
    await todosPage.verifyTodoItemsAreNotVisible([tasks[0], tasks[1], tasks[2]]);
    await todosPage.verifyThereAreNoTodos();
  });
});
