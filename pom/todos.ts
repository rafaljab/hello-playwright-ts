import { Locator, Page } from "@playwright/test";
import { RELATIVE_URL } from "../playwright.config";

export class TodosPage {
  url = RELATIVE_URL + "/todos";
  readonly page: Page;
  readonly newTaskInputField: Locator;
  readonly addTaskBtn: Locator;
  readonly clearTasksBtn: Locator;
  readonly todoItems: Locator;
  readonly noTodosParagraph: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTaskInputField = page.getByRole("textbox");
    this.addTaskBtn = page.getByRole("button", { name: "ADD TASK" });
    this.clearTasksBtn = page.getByRole("button", { name: "CLEAR COMPLETED TASKS" });
    this.todoItems = page.getByTestId("todo-item");
    this.noTodosParagraph = page.getByRole("paragraph").filter({ hasText: "There are no TODOs!" });
  }

  async navigate() {
    await this.page.goto(this.url);
  }

  async addTask(taskName: string) {
    await this.newTaskInputField.type(taskName);
    await this.addTaskBtn.click();
  }

  todoItem(todoName: string) {
    return this.todoItems.filter({ hasText: todoName });
  }

  todoItemCheckbox(todoName: string) {
    return this.todoItem(todoName).getByRole("checkbox");
  }

  async toggleTodoItem(todoName: string) {
    const todoItemCheckbox = this.todoItemCheckbox(todoName);
    if (await todoItemCheckbox.isChecked()) {
      await todoItemCheckbox.uncheck();
    } else {
      await todoItemCheckbox.check();
    }
  }

  async clearCompletedTasks() {
    await this.clearTasksBtn.click();
  }
}
