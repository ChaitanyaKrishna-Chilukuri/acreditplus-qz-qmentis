import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto(url:string) 
  {
    await this.page.waitForTimeout(2000);
    // await this.page.waitForLoadState('domcontentloaded')
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(2000);
  }

  async login(username: string) {
    // Wait for username field to be visible
    await this.usernameInput.waitFor({ state: 'visible' });

    // Clear and fill username
    await this.usernameInput.click({ modifiers: ['ControlOrMeta'] });
    await this.usernameInput.fill(username);

    // Wait for login button and click
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded')
  }
}