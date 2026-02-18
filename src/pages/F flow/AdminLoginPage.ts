import { BasePage } from './BasePage';

export class AdminLoginPage extends BasePage {
  async navigate(url: string) {
    // await this.page.goto(url);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async login(user: string) {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(user);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}