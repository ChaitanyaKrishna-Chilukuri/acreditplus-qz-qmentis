import { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async waitForPageLoad(timeout = 30000): Promise<void> {
    await this.page.waitForFunction(() => document.readyState === 'complete', { timeout });
  }
}