import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly url = 'https://acreditplus-cloud-dev-two.acr.org/ACReditPlusAuthService/Account/Login';

    async login(username: string) {
        await this.page.goto(this.url);
        await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }
}
