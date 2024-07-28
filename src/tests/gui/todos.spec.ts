import { test, expect } from "@base/gui/base";
import { RELATIVE_URL, STORAGE_STATE_PATH } from "@playwright.config";
import tasks from "@test-data/todos/tasks.json";

const todosStorageStateFile = STORAGE_STATE_PATH + "/todos.json";

test.describe("single functionality tests", async () => {
  test.beforeEach("go to todos page", async ({ todosPage }) => {
    await todosPage.navigate();
  });

  test.describe.configure({ mode: "serial" });

  test("add todos", async ({ todosPage }) => {
    // Given
    await expect(todosPage.noTodosParagraph).toBeVisible();
    await expect(todosPage.todoItems).toBeHidden();

    // When
    for (const task of tasks) {
      await todosPage.addTask(task);
    }

    // Then
    expect((await todosPage.todoItems.count()) === tasks.length).toBeTruthy();
    for (const todoText of await todosPage.todoItems.allTextContents()) {
      expect(tasks.includes(todoText)).toBeTruthy();
    }

    await todosPage.page.context().storageState({ path: todosStorageStateFile });
  });

  test.describe("with predefined state", async () => {
    test.use({ storageState: todosStorageStateFile });

    test("load todos from states", async ({ todosPage }) => {
      // Given
      await expect(todosPage.todoItems.first()).toBeVisible();

      // When

      // Then
      expect((await todosPage.todoItems.count()) === tasks.length).toBeTruthy();
      for (const todoText of await todosPage.todoItems.allTextContents()) {
        expect(tasks.includes(todoText)).toBeTruthy();
      }
    });

    test("toggle todos", async ({ todosPage }) => {
      // Given
      await expect(todosPage.todoItemCheckbox(tasks[0])).not.toBeChecked();

      // When
      await todosPage.toggleTodoItem(tasks[0]);

      // Then
      await expect(todosPage.todoItemCheckbox(tasks[0])).toBeChecked();

      // When
      await todosPage.toggleTodoItem(tasks[0]);

      // Then
      await expect(todosPage.todoItemCheckbox(tasks[0])).not.toBeChecked();
    });

    test("clear todos", async ({ todosPage }) => {
      // Given
      await expect(todosPage.todoItemCheckbox(tasks[0])).toBeVisible();
      await expect(todosPage.todoItemCheckbox(tasks[1])).toBeVisible();
      await expect(todosPage.todoItemCheckbox(tasks[2])).toBeVisible();

      // When
      await todosPage.toggleTodoItem(tasks[0]);
      await todosPage.clearCompletedTasks();

      // Then
      await expect(todosPage.todoItemCheckbox(tasks[0])).toBeHidden();
      await expect(todosPage.todoItemCheckbox(tasks[1])).toBeVisible();
      await expect(todosPage.todoItemCheckbox(tasks[2])).toBeVisible();

      // When
      await todosPage.toggleTodoItem(tasks[1]);
      await todosPage.clearCompletedTasks();

      // Then
      await expect(todosPage.todoItemCheckbox(tasks[0])).toBeHidden();
      await expect(todosPage.todoItemCheckbox(tasks[1])).toBeHidden();
      await expect(todosPage.todoItemCheckbox(tasks[2])).toBeVisible();
    });
  });
});

test.describe("e2e tests", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("todos @e2e", async ({ login, loginPage, topMenuFragment, leftMenuFragment, todosPage }) => {
    // Given
    await test.step("login and go to todos page", async () => {
      login();
      await expect(loginPage.page).toHaveURL(RELATIVE_URL);
      await topMenuFragment.openMenu();
      await leftMenuFragment.clickTodosLink();
    });

    await expect(todosPage.noTodosParagraph).toBeVisible();

    // When
    await todosPage.addTask(tasks[0]);
    await todosPage.addTask(tasks[1]);

    // Then
    await expect(todosPage.todoItem(tasks[0])).toBeVisible();
    await expect(todosPage.todoItem(tasks[1])).toBeVisible();
    await expect(todosPage.noTodosParagraph).toBeHidden();

    // When
    await todosPage.toggleTodoItem(tasks[1]);
    await todosPage.clearCompletedTasks();

    // Then
    await expect(todosPage.todoItem(tasks[0])).toBeVisible();
    await expect(todosPage.todoItem(tasks[1])).toBeHidden();
    await expect(todosPage.noTodosParagraph).toBeHidden();

    // When
    await todosPage.addTask(tasks[2]);

    // Then
    await expect(todosPage.todoItem(tasks[0])).toBeVisible();
    await expect(todosPage.todoItem(tasks[1])).toBeHidden();
    await expect(todosPage.todoItem(tasks[2])).toBeVisible();
    await expect(todosPage.noTodosParagraph).toBeHidden();

    // When
    await todosPage.toggleTodoItem(tasks[0]);
    await todosPage.toggleTodoItem(tasks[2]);
    await todosPage.clearCompletedTasks();

    // Then
    await expect(todosPage.todoItem(tasks[0])).toBeHidden();
    await expect(todosPage.todoItem(tasks[1])).toBeHidden();
    await expect(todosPage.todoItem(tasks[2])).toBeHidden();
    await expect(todosPage.noTodosParagraph).toBeVisible();
  });
});
