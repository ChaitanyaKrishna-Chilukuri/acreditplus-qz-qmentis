import { Page, expect } from '@playwright/test';

export class ViewUploadFormsPage {
    readonly page: Page;
    private viewUploadFormsLink;
    private sendToAcrButton;
    private confirmButton;
    private appViewUploadFormContent;
    private uploadSurveyFileButton;
    private filesNotReviewedMessage;

    constructor(page: Page) {
        this.page = page;
        // Use robust selectors for all key elements
        this.viewUploadFormsLink = page.getByRole('link', { name: /View\/Upload FormsAction/i });
        this.sendToAcrButton = page.getByRole('button', { name: /Send to ACR/i });
        this.confirmButton = page.getByRole('button', { name: /Confirm/i });
        this.appViewUploadFormContent = page.locator('#AppViewUploadFormContent');
        this.uploadSurveyFileButton = page.locator('input[acr="btn"][value="Upload new file for Survey Agreement"]');
        this.filesNotReviewedMessage = page.getByText('The files related to this');
    }

    async openViewUploadForms() {
        // Wait for the link to be visible and click
        await this.viewUploadFormsLink.first().waitFor({ state: 'visible' });
        await this.viewUploadFormsLink.first().click();
        // Wait for the View/Upload Forms content to load
        await this.appViewUploadFormContent.waitFor({ state: 'visible' });
    }

    async getFacilityID(modalityName: string): Promise<string> {
        // Target only the element that contains the CTAP# text
        const locator = this.page.locator('td[rowspan="2"] span', { hasText: `${modalityName}#` });
        await locator.first().waitFor({ state: 'visible' });
        const fullText = await locator.first().innerText();   // e.g., "CTAP# 60551"
        const facilityId = fullText.match(/\d+/)?.[0] ?? '';
        return facilityId; // returns "60551"
    }

    async uploadSurveyFile(filePath: string) {
        try {
            // Wait for the file chooser when clicking the upload button
            await this.uploadSurveyFileButton.waitFor({ state: 'visible' });
            const [fileChooser] = await Promise.all([
                this.page.waitForEvent('filechooser'),
                this.uploadSurveyFileButton.click(), // This triggers the file dialog
            ]);
            await fileChooser.setFiles(filePath);
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    }

    async sendToACR() {
        await this.sendToAcrButton.waitFor({ state: 'visible' });
        await this.sendToAcrButton.click();
        await this.confirmButton.waitFor({ state: 'visible' });
        await this.confirmButton.click();
        await expect(this.appViewUploadFormContent).toContainText('Submitted');
    }

    async verifyFilesNotReviewedMessage() {
        await this.filesNotReviewedMessage.waitFor({ state: 'visible' });
        await this.filesNotReviewedMessage.click();
        await expect(this.appViewUploadFormContent)
            .toContainText('The files related to this document have not been reviewed by ACR yet.');
    }
}
