import { test, expect } from "../base";

test("add todos", async ({ todosPageAuthenticated }) => {
  // Given
  const todosPage = todosPageAuthenticated;

  const tasks = ["Buy milk", "Go for a walk", "Wash the dishes"];

  await expect(todosPage.noTodosParagraph).toBeVisible();
  await expect(todosPage.todoItems).toBeHidden();

  // When
  for (const task of tasks) {
    await todosPage.addTask(task);
  }

  // Then
  await expect((await todosPage.todoItems.count()) === tasks.length).toBeTruthy();
  for (const todoText of await todosPage.todoItems.allTextContents()) {
    expect(tasks.includes(todoText)).toBeTruthy();
  }
});

test("load todos from states", async ({ todosPageWithState }) => {
  // Given
  const todosPage = todosPageWithState;

  const tasks = ["Buy milk", "Go for a walk", "Wash the dishes"];

  await expect(todosPage.todoItems.first()).toBeVisible();

  // When

  // Then
  await expect((await todosPage.todoItems.count()) === tasks.length).toBeTruthy();
  for (const todoText of await todosPage.todoItems.allTextContents()) {
    expect(tasks.includes(todoText)).toBeTruthy();
  }
});

test("toggle todos", async ({ todosPageWithState }) => {
  // Given
  const todosPage = todosPageWithState;

  const tasks = ["Buy milk", "Go for a walk", "Wash the dishes"];

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

test("clear todos", async ({ todosPageWithState }) => {
  // Given
  const todosPage = todosPageWithState;

  const tasks = ["Buy milk", "Go for a walk", "Wash the dishes"];

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

test("todos @e2e", async ({ todosPage }) => {
  // Given
  const tasks = ["Buy milk", "Go for a walk", "Wash the dishes"];

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
