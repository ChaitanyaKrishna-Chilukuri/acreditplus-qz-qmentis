import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class BUAPReviewSheetPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async performCystReviewStep(data: any) {
        // Add locators and methods for CYST review
        await this.page.locator('#sec16').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#sec17').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#sec18').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#item5088').selectOption('1162');
        await this.page.getByRole('button', { name: 'Calculate' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
        await this.page.getByRole('button', { name: 'Next: SOLID' }).click();
    }

    async performSolidReviewStep(data: any, examType: string) {
        // Add locators and methods for SOLID review
        await this.page.locator('#sec20').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#sec21').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#sec22').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#item5085').selectOption('1151');
        await this.page.getByRole('button', { name: 'Calculate' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
        if(examType === 'Biopsy') {
            await this.page.getByRole('button', { name: 'Next: CNB' }).click();
        }else if(examType === 'FNAC') {
            await this.page.getByRole('button', { name: 'Next: FNAC' }).click();
        }
    }

    async performCNBReviewStep(data: any) {
        // Add locators and methods for CNB review
        await this.page.locator('#sec24').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#sec25').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#sec27').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#item5089').selectOption('1164');
        await this.page.getByRole('button', { name: 'Calculate' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
        await this.page.getByRole('button', { name: 'Next: Submit' }).click();
    }

    async performFNACReviewStep(data: any) {
        await this.page.locator('#sec29').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#sec30').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#sec31').getByRole('combobox').selectOption('PASS');
        await this.page.locator('#item5082').selectOption('1149');
        await this.page.getByRole('button', { name: 'Calculate' }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
        await this.page.getByRole('button', { name: 'Next: Submit' }).click();
    }

    async submitReview() {
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }
}
