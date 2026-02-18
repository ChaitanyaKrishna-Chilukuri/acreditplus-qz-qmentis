import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { expect } from '@/utils/pageFixture';

export class FNACExamDataFormPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async fillFNACExamData(data: any) {
        const header = this.page.locator('#aplusPageHeader');
        await expect(header).toContainText('BUAP Forms: FNAC Exam Data Form', { timeout: 15000 });
        await this.page.getByPlaceholder('mm/dd/yyyy').nth(0).fill(data.startDate);
        await this.page.getByPlaceholder('mm/dd/yyyy').nth(1).fill(data.endDate);
        
        await this.page.getByPlaceholder('000.000', { exact: true }).click();
        await this.page.getByPlaceholder('000.000', { exact: true }).fill(data.gauge);
        await this.page.getByRole('radio', { name: 'Single Frequency' }).check();
        await this.page.getByPlaceholder('00.0', { exact: true }).click();
        await this.page.getByPlaceholder('00.0', { exact: true }).fill(data.frequency);
        await this.page.getByRole('button', { name: 'Next: Upload Documents' }).nth(1).click();
    }
}
