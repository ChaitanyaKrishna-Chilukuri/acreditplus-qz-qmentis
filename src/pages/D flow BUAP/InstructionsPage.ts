import { BasePage } from './BasePage';

export class InstructionsPage extends BasePage {
    async acceptInstructions() {
        const checkbox = this.page.getByRole('checkbox', { name: 'I have read the Breast' });

        if (!(await checkbox.isChecked())) {
            await checkbox.check();
        }
        await this.page.getByRole('button', { name: 'Next: Patient Outcome Data' }).nth(1).click();
    }
}
