import { Page, expect } from '@playwright/test';

export class AdminApplicationReviewPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToApplicationCompleted() {
        await this.page.getByRole('link', { name: 'Application Completed' }).click();
    }

    // async filterByModality(modalityValue: string) {
    //     await this.page.getByLabel('Modality', { exact: true }).selectOption(modalityValue);
    // }
    async filterByModality(modalityName: string) {
        await this.page.getByLabel('Modality', { exact: true }).selectOption({ label: modalityName });
    }

    async enterModalityNumber(modalityNumber: string) {
        //await this.page.getByRole('textbox', { name: 'Modality#' }).fill(modalityNumber);
        const modalityInput = this.page.getByRole('textbox', { name: 'Modality#' });

        // Fill the textbox
        await modalityInput.fill(modalityNumber);

        // Explicitly wait until the textbox's value matches the expected input
        await expect(modalityInput).toHaveValue(modalityNumber, { timeout: 5000 });
    }

    async searchApplications() {
        await this.page.getByRole('button', { name: 'Search', exact: true }).click();
    }

    // async openViewItemsPopup(){
    //     const popupPromise = this.page.waitForEvent('popup');
    //     await this.page.waitForLoadState('networkidle');
    //     await this.page.getByRole('link', { name: 'View Items' }).waitFor({ state: 'visible', timeout: 10000 });
    //     await this.page.getByRole('link', { name: 'View Items' }).click();
    //     return await popupPromise;
    // }
    async openViewItemsPopup() {
        await this.page.waitForLoadState('networkidle'); // optional but improves stability

        // 2. Wait until "View Items" link is visible
        const viewItemsLink = this.page.getByRole('link', { name: 'View Items' });
        await viewItemsLink.waitFor({ state: 'visible', timeout: 15000 });

        // 3. Handle popup using Promise.all
        const [popup] = await Promise.all([
            this.page.waitForEvent('popup'),
            viewItemsLink.click()
        ]);

        // 4. Ensure popup page finishes loading
        await popup.waitForLoadState('domcontentloaded');

        return popup;
    }


    async markDocumentCompleted(documentPage: Page) {
        // document completion drop-down
        await documentPage.locator('#FacilityDocumentItem-1').selectOption('2');
    }

    async openViewDocumentsPopup(documentPage: Page) {
        const pdfPopup = documentPage.waitForEvent('popup');
        await documentPage.getByRole('link', { name: 'View Document(s)' }).click();
        return await pdfPopup;
    }

    async confirmPaymentAndApplication(documentPage: Page) {
        await documentPage.getByRole('checkbox', { name: 'Payment is received' }).check();
        await documentPage.getByRole('button', { name: 'Confirm Application' }).click();
        await documentPage.getByRole('button', { name: 'Yes' }).click();
        // await expect(documentPage.locator('#processMessage'))
        //     .toContainText('Confirming application. Please wait...');
    }

    async finalizeAndSignOut() {
        await this.page.goto('https://acreditplus-cloud-dev-two.acr.org/ACReditPlus/Admin/AppAcceptance?rs=true');
        await this.page.getByRole('link', { name: 'Sign Out' }).click();
    }

    // FULL ADMIN WORKFLOW WRAPPER
    async performAdminReview(modality: string, modalityNumber: string) {
        await this.navigateToApplicationCompleted();
        await this.filterByModality(modality);
        await this.enterModalityNumber(modalityNumber);
        await this.searchApplications();

        const documentPage = await this.openViewItemsPopup();
        await this.markDocumentCompleted(documentPage);

        await this.openViewDocumentsPopup(documentPage);

        await this.confirmPaymentAndApplication(documentPage);
        await this.finalizeAndSignOut();
    }
}
