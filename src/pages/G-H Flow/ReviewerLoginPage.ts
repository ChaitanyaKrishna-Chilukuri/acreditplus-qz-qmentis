import { Page } from '@playwright/test';

export class ReviewerLoginPage {
  constructor(private page: Page) {}
  readonly usernameInput = this.page.getByRole('textbox', { name: 'Username' });
  readonly loginBtn = this.page.getByRole('button', { name: 'Login' });
  readonly signOutLink = this.page.getByRole('link', { name: 'Sign Out' });

  async login(email: string) {
    await this.usernameInput.fill(email);
    await this.loginBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
  async signOut() {
    await this.signOutLink.click();
    await this.page.waitForURL('**/Account/Login*', { 
        waitUntil: 'domcontentloaded', 
        timeout: 15000 
    });
  }
}