import { Page, Locator, expect } from '@playwright/test';

export class ViewUploadFormsPage {
    readonly page: Page;
    private viewUploadFormsLink: Locator;
    private landingHeading: Locator;
    private viewSubmittedAppSummaryLink: Locator;

    constructor(page: Page) {
        this.page = page;
        // Use partial link text for robustness due to dynamic action required suffix
        this.viewUploadFormsLink = page.getByRole('link', { name: /View\/Upload Forms/ });
        // Assume heading is a visible h2/h3 or similar; fallback to content region if not
        this.landingHeading = page.locator('h2, h3, [data-testid="view-upload-forms-heading"], #AppViewUploadFormContent');
        // Use partial link text for the summary link
        this.viewSubmittedAppSummaryLink = page.getByRole('link', { name: /View Submitted Application Summary/ });
    }

    /**
     * Navigates to the View/Upload Forms landing page by clicking the link.
     * Waits for the landing heading to be visible.
     */
    async navigateToViewUploadForms(): Promise<void> {
        await this.viewUploadFormsLink.first().waitFor({ state: 'visible' });
        await this.viewUploadFormsLink.first().click();
        await this.landingHeading.first().waitFor({ state: 'visible' });
    }

    /**
     * Verifies the View/Upload Forms page is loaded by checking key elements.
     * Waits for heading and the View Submitted Application Summary link.
     */
    async verifyViewUploadFormsPage(): Promise<void> {
        await this.landingHeading.first().waitFor({ state: 'visible' });
        await expect(this.landingHeading.first()).toBeVisible();
        await this.viewSubmittedAppSummaryLink.first().waitFor({ state: 'visible' });
        await expect(this.viewSubmittedAppSummaryLink.first()).toBeVisible();
    }

    async openViewUploadForms() {
        // For backward compatibility, keep the original method
        await this.viewUploadFormsLink.first().click();
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
                this.page.click('input[acr="btn"][value="Upload new file for Survey Agreement"]'), // This triggers the file dialog
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
