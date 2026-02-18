import { expect } from '@/utils/pageFixture';
import { Page } from '@playwright/test';

export class FinalReportsAndCertification {
  constructor(private page: Page) {}

  async finalize(value: string, modalityId: string) {
    // 1. Navigate to the page
    await this.page.getByRole('link', { name: 'Draft/Final Reports' }).click();

    // 2. STEP 1: Filter by CTAP Modality first
    await this.page.getByLabel('Modality', { exact: true }).selectOption(value);

    // Wait for the specific "Loading..." spinner seen in the video to finish
    const spinner = this.page.locator('text=Loading...');
    await spinner.waitFor({ state: 'hidden', timeout: 20000 });

    // Click Search to filter the table by CTAP records only
    await Promise.all([
        this.page.waitForLoadState('networkidle'),
        this.page.getByRole('button', { name: 'Search' }).click()
    ]);

    // 3. STEP 2: Search for the specific Modality ID within the CTAP results
    const idInput = this.page.getByRole('textbox', { name: 'Modality#' });
    
    // Ensure the field is ready and fill the specific ID
    await idInput.click();
    await idInput.clear();
    await idInput.fill(modalityId);
    
    // Verify the value is correctly entered
    await expect(idInput).toHaveValue(modalityId);

    // Click Search again to find the specific record
    await Promise.all([
        this.page.waitForResponse(resp => resp.url().includes('Search') && resp.status() === 200),
        this.page.getByRole('button', { name: 'Search' }).click()
    ]);

    // 4. Locate the specific row
     const targetRow = this.page.locator('tr', { hasText: modalityId }).first();

    // // Wait for the row to be visible
    // await targetRow.waitFor({ state: 'visible', timeout: 15000 });

    // Check if 'Confirm' link exists before clicking to avoid generic timeout
    const confirmLink = targetRow.getByRole('link', { name: 'Confirm', exact: true });

    if (await confirmLink.isVisible()) {
        await confirmLink.click();
    } else {
        await targetRow.locator('a').first().click(); 
    }

    // Handle the final confirmation button
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async downloadCert(value: string, modalityId: string) {
    await this.page.getByRole('link', { name: 'Certificate/Decals' }).click();
    await this.page.getByLabel('Modality', { exact: true }).selectOption(value);
    await this.page.getByRole('textbox', { name: 'Modality#' }).fill(modalityId);
    await this.page.getByRole('button', { name: 'Search' }).click();
    
    await this.page.waitForTimeout(10000);

    await this.page.getByRole('button', { name: 'Search' }).click();
    
    await this.page.locator('#IsCertificate').check();
    const dlPromise = this.page.waitForEvent('download');
    await this.page.locator('input[name="btnPrintBottomP1"]').click();
    return await dlPromise;
  }
}