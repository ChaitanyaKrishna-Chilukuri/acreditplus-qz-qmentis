import { BasePage } from './BasePage';

export class InstructionsPage extends BasePage {
    async acceptInstructions() {
        await this.page.getByRole('checkbox', { name: 'I have read the Computed' }).check();
        await this.clickNext('CT Clinical Adult Head');
    }
}