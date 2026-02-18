import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { expect } from '@/utils/pageFixture';

export class BreastUltrasoundCystAspirationPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async fillCystAspirationData(data: any) {
        // Selectors using the specific IDs provided
        const startDateInput = this.page.locator('#item1');
        const endDateInput = this.page.locator('#item850');

        // Handle Start Date
        await startDateInput.click();
        await startDateInput.clear();
        // pressSequentially triggers the 'hasDatepicker' internal scripts
        await startDateInput.pressSequentially(data.startDate, { delay: 100 });
        await startDateInput.press('Tab'); 
        await expect(startDateInput).toHaveValue(data.startDate);

        // Handle End Date
        await endDateInput.click();
        await endDateInput.clear();
        await endDateInput.pressSequentially(data.endDate, { delay: 100 });
        await endDateInput.press('Tab');
        await expect(endDateInput).toHaveValue(data.endDate);

        // Continue with other fields
        await this.page.getByRole('radio', { name: 'Single Frequency' }).check();
        
        const sizeTextbox = this.page.getByRole('textbox', { name: '00.0' });
        await sizeTextbox.fill(data.size);
        await expect(sizeTextbox).toHaveValue(data.size);

        // Click Next
        await this.page.getByRole('button', { name: /Next:/ }).nth(1).click();
    }
}
