import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { expect } from '@/utils/pageFixture';

export class CNBExamDataFormPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async fillCNBExamData(data: any) {
        const header = this.page.locator('#aplusPageHeader');
        await expect(header).toContainText('BUAP Forms: CNB Exam Data Form', { timeout: 15000 });
        await this.page.getByPlaceholder('mm/dd/yyyy').nth(0).fill(data.startDate);
        await this.page.getByPlaceholder('mm/dd/yyyy').nth(1).fill(data.endDate);
        
        await this.page.locator('#child37').click();
        await this.page.locator('#child37').fill(data.child37);
        await this.page.locator('#child491').click();
        await this.page.locator('#child491').fill(data.child491);
        await this.page.getByRole('radio', { name: 'Vacuum' }).check();
        await this.page.locator('#child40').click();
        await this.page.locator('#child40').fill(data.size);
        await this.page.getByRole('radio', { name: 'cm' }).check();
        await this.page.locator('#child41').click();
        await this.page.locator('#child41').fill(data.frequency);
        await this.page.getByRole('radio', { name: 'Single Frequency' }).check();
        await this.page.getByRole('textbox', { name: '00.0', exact: true }).click();
        await this.page.getByRole('textbox', { name: '00.0', exact: true }).fill(data.size);
        await this.page.getByRole('button', { name: 'Next: Upload Documents' }).nth(1).click();
    }
}
