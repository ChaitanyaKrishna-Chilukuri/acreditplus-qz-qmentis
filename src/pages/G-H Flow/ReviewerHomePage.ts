import { Page, expect } from '@playwright/test';

export class ReviewerHomePage {
  constructor(private page: Page) {}

  readonly modalityDrop = this.page.locator('#SelectedModalityTypeId');
  readonly accreditInput = this.page.locator('#ModalityAccreditationNumber');
  readonly searchBtn = this.page.getByRole('button', { name: 'Search' });
  readonly modifyLink = this.page.getByRole('link', { name: 'Modify' });

  async searchAndModify(val: string, id: string) {
    await this.modalityDrop.selectOption(val);
    await this.accreditInput.fill(id);
    await this.searchBtn.click();
    await this.modifyLink.waitFor({ state: 'visible', timeout: 30000 });

    // 1. Start the listener for the first popup (usually the Wizard or PDF)
    const popupPromise = this.page.context().waitForEvent('page', { timeout: 120000 });
    
    // 2. Click to trigger both the Wizard and the PDF
    await this.modifyLink.click();
    await popupPromise;

    // 3. Wait for the second tab to appear in the context
    // On slow environments, the second tab might take 2-5 seconds to register
    await this.page.waitForTimeout(7000); 

    // 4. Get all open tabs
    const allPages = this.page.context().pages();
    
    // 5. Identify the PDF and the Wizard
    const pdfTab = allPages.find(p => p.url().includes('PDFViewer'));
    const wizardPage = allPages.find(p => p.url().includes('Wizard/RsLoad'));

    // 6. Close the PDF tab immediately if found
    if (pdfTab) {
        await pdfTab.close().catch(() => {});
    }

    // 7. Ensure we have the Wizard and return it
    if (!wizardPage) {
        throw new Error('Wizard page not found in context. Check if the popup was blocked or failed to load.');
    }

    await wizardPage.bringToFront();
    // Wait for the Wizard content to be interactive
    await wizardPage.waitForLoadState('domcontentloaded');
    
    return wizardPage;
  }
}