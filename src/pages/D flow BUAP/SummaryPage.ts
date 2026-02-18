import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SummaryPage extends BasePage {
    async submit() {
        // 1. Check agreement and click Submit
        await this.page.getByRole('checkbox', { name: /By checking this box/ }).check();
        await this.page.getByRole('button', { name: 'Submit' }).click();

        // 2. Wait for the Confirm button and click it
        const confirmBtn = this.page.getByRole('button', { name: 'Confirm' });
        await confirmBtn.waitFor({ state: 'visible' });
        
        // Use Promise.all to handle the navigation triggered by the click
        await Promise.all([
            this.page.waitForLoadState('domcontentloaded'),
            confirmBtn.click(),
        ]);

        // 3. Assert success message on the new page
        const successMsg = this.page.getByRole('heading', { name: 'Testing Package Submitted Successfully' });
        await expect(successMsg).toBeVisible();

        // 4. Perform sign out
        const signOutLink = this.page.getByRole('link', { name: 'Sign Out' });
        await signOutLink.click();
    }
}
