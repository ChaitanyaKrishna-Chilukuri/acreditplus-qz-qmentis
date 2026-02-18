import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class UploadPage extends BasePage {
    async uploadDocuments(filePath: string) {
        const rows = this.page.locator('tr').filter({ hasText: '+ Upload Documents' });

        for (let i = 0; i < 4; i++) {
            const currentRow = rows.nth(i);
            const uploadButton = currentRow.locator('a', { hasText: '+ Upload Documents' });

            const [fileChooser] = await Promise.all([
                this.page.waitForEvent('filechooser'),
                uploadButton.click()
            ]);
            await fileChooser.setFiles(filePath);
            
            // Hard wait to allow upload initiation
            await this.page.waitForTimeout(2000);
        }

        // Wait for all 4 uploads to show 'delete' and hide 'No files uploaded'
        for (let i = 0; i < 4; i++) {
            const currentRow = rows.nth(i);
            await expect(currentRow.getByText('delete')).toBeVisible({ timeout: 60000 });
            await expect(currentRow.getByText('No files uploaded')).not.toBeVisible();
        }

        // Hard wait before interacting with the button
        await this.page.waitForTimeout(5000);

        // Targeting the button by role and name, then selecting the second instance (nth(1))
        const nextButton = this.page.getByRole('button', { name: 'Next: Upload Images' }).nth(1);

        await nextButton.scrollIntoViewIfNeeded();

        // Ensure the button is enabled before clicking (Playwright usually waits, but good for stability)
        await expect(nextButton).toBeEnabled({ timeout: 10000 });

        await nextButton.click();
    }

    async skipImages() {
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: 'Next: Summary' }).nth(1).click();
    }
}