import { expect, Page } from "@playwright/test";

const baseUrl = "http://localhost:4201/";

export class CmsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(baseUrl + path);
  }

  getDialog() {
    return this.page.locator('cdk-dialog-container');
  }

  async login() {
    await this.goto('login');
    await this.page.locator('#username').fill('testuser');
    await this.page.locator('#password').fill('Test12345678');
    await this.page.locator('#login').click();
    await expect(this.page.getByTestId('sidebar-username')).toHaveText('testuser');
  }

  async waitForToast(message: string) {
    await expect(this.page.locator('#toast-container')).toContainText(message);
  }
}
