import { type Locator, type Page } from "@playwright/test";
import { expect, step } from "@base/gui/base";
import { BasePage } from "@base/gui/base.page";
import { RELATIVE_URL } from "@playwright.config";

export class TodosPage extends BasePage {
  readonly url: string = `${RELATIVE_URL}/todos`;

  readonly newTaskInputField: Locator;
  readonly addTaskBtn: Locator;
  readonly clearTasksBtn: Locator;
  readonly todoItems: Locator;
  readonly noTodosParagraph: Locator;

  constructor(page: Page) {
    super(page);

    this.newTaskInputField = page.getByRole("textbox");
    this.addTaskBtn = page.getByRole("button", { name: "ADD TASK" });
    this.clearTasksBtn = page.getByRole("button", { name: "CLEAR COMPLETED TASKS" });
    this.todoItems = page.getByTestId("todo-item");
    this.noTodosParagraph = page.getByRole("paragraph").filter({ hasText: "There are no TODOs!" });
  }

  @step("Add todo item")
  async addTask(taskName: string) {
    await this.newTaskInputField.fill(taskName);
    await this.addTaskBtn.click();
  }

  @step("Add todo items")
  async addTasks(tasks: string[]) {
    for (const task of tasks) {
      await this.addTask(task);
    }
  }

  todoItem(todoName: string) {
    return this.todoItems.filter({ hasText: todoName });
  }

  todoItemCheckbox(todoName: string) {
    return this.todoItem(todoName).getByRole("checkbox");
  }

  @step("Toggle todo item")
  async toggleTodoItem(todoName: string) {
    const todoItemCheckbox = this.todoItemCheckbox(todoName);
    if (await todoItemCheckbox.isChecked()) {
      await todoItemCheckbox.uncheck();
    } else {
      await todoItemCheckbox.check();
    }
  }

  @step("Clear completed todo items")
  async clearCompletedTasks() {
    await this.clearTasksBtn.click();
  }

  @step("Verify Todo item is not checked")
  async verifyTodoItemIsNotChecked(todoName: string) {
    await expect(this.todoItemCheckbox(todoName)).not.toBeChecked();
  }

  @step("Verify Todo item is checked")
  async verifyTodoItemIsChecked(todoName: string) {
    await expect(this.todoItemCheckbox(todoName)).toBeChecked();
  }

  @step("Verify todo item is visible")
  async verifyTodoItemIsVisible(todoName: string) {
    await expect(this.todoItemCheckbox(todoName)).toBeVisible();
  }

  @step("Verify todo item is not visible")
  async verifyTodoItemIsNotVisible(todoName: string) {
    await expect(this.todoItemCheckbox(todoName)).toBeHidden();
  }

  @step("Verify todo items are visible")
  async verifyTodoItemsAreVisible(todos: string[]) {
    for (const todo of todos) {
      await this.verifyTodoItemIsVisible(todo);
    }
  }

  @step("Verify todo items are not visible")
  async verifyTodoItemsAreNotVisible(todos: string[]) {
    for (const todo of todos) {
      await this.verifyTodoItemIsNotVisible(todo);
    }
  }

  @step("Verify there are no todo items")
  async verifyThereAreNoTodos() {
    await expect(this.noTodosParagraph).toBeVisible();
    await expect(this.todoItems).toBeHidden();
  }

  @step("Verify there are some todo items")
  async verifyThereAreTodos() {
    await expect(this.noTodosParagraph).toBeHidden();
    await expect(this.todoItems.first()).toBeVisible();
  }

  @step("Verify Todo list")
  async verifyTodoList(todos: string[]) {
    expect((await this.todoItems.count()) === todos.length).toBeTruthy();
    for (const todoText of await this.todoItems.allTextContents()) {
      expect(todos.includes(todoText)).toBeTruthy();
    }
  }
}
