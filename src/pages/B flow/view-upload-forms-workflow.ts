import { Page, expect } from '@playwright/test';

export class ViewUploadFormsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openViewUploadForms() {
        await this.page.getByRole('link', { name: 'View/Upload FormsAction' }).first().click();
    }

    async getFacilityID(modalityName: string): Promise<string> {
    // Target only the element that contains the CTAP# text
        const locator = this.page.locator('td[rowspan="2"] span', { hasText: `${modalityName}#` });

        await locator.first().waitFor({ state: 'visible' });

        const fullText = await locator.first().innerText();   // e.g., "CTAP# 60551"
        const facilityId = fullText.match(/\d+/)?.[0] ?? '';

        return facilityId; // returns "60551"
    }

    async uploadSurveyFile(filePath: string){
        try{
            // Wait for the file chooser when clicking the upload button
            const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser'),
            this.page.click('input[acr="btn"][value="Upload new file for Survey Agreement"]'), // This triggers the file dialog
            ]);
            await fileChooser.setFiles(filePath);
        } catch (error) {
            
            console.error('Error during file upload:', error);
        }
    }
    
    async sendToACR() {
        await this.page.getByRole('button', { name: 'Send to ACR' }).click();
        await this.page.getByRole('button', { name: 'Confirm' }).click();
        await expect(this.page.locator('#AppViewUploadFormContent')).toContainText('Submitted');
    }

    async verifyFilesNotReviewedMessage() {
        await this.page.getByText('The files related to this').click();
        await expect(this.page.locator('#AppViewUploadFormContent'))
            .toContainText('The files related to this document have not been reviewed by ACR yet.');
    }

}
