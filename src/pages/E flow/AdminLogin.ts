import { BasePageE } from './BasePageE';

export class AdminLogin extends BasePageE {
    private readonly usernameField = this.page.getByRole('textbox', { name: 'Username' });
    private readonly loginButton = this.page.getByRole('button', { name: 'Login' });

    async login(username: string) {
        await this.usernameField.fill(username);
        await this.loginButton.click();
    }
}