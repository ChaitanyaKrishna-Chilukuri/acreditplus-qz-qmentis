import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class BreastUltrasoundSolidMassPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async fillSolidMassData(data: any, examType: string) {
        const header = this.page.locator('#aplusPageHeader');
        await expect(header).toContainText('BUAP Forms: Breast Ultrasound Solid Mass Exam Data Form', { timeout: 15000 });
        await this.page.getByPlaceholder('mm/dd/yyyy').nth(0).fill(data.startDate);
        await this.page.getByPlaceholder('mm/dd/yyyy').nth(1).fill(data.endDate);
        await this.page.getByRole('radio', { name: 'Single Frequency' }).check();
        await this.page.getByRole('textbox', { name: '00.0' }).click();
        await this.page.getByRole('textbox', { name: '00.0' }).fill(data.size);
        if(examType === 'Biopsy') {
            await this.page.getByRole('button', { name: 'Next: CNB Exam Data Form' }).nth(1).click();
        }else if (examType === 'FNAC') {
            await this.page.getByRole('button', { name: 'Next: FNAC Exam Data Form' }).nth(1).click();
        }
    }
}
