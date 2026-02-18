import { expect } from '@/utils/pageFixture';
import { BasePage } from './BasePage';

export class AssignReviewersPage extends BasePage {
  readonly grid = this.page.locator('#gridList_EligibleReviewerList');

  async checkDraftBox() {
    const draftBoxHeader = this.page.locator('span.PageSubHeader', { hasText: 'Draft Box' });
    if (await draftBoxHeader.isVisible()) {
      const popupPromise = this.page.context().waitForEvent('page', { timeout: 60000 });
      await this.page.getByRole('button', { name: 'Continue searching' }).click();
      const popup = await popupPromise;
      await popup.waitForLoadState('domcontentloaded');
      return popup;
    }
    return null;
  }

  async selectFirstAvailableReviewerEmail(btnId: string): Promise<string> {
    // Open the reviewer selection modal/grid
    await this.page.locator(btnId).click();
    await this.grid.waitFor({ state: 'visible' });
    
    // Locate the first row containing a "Select" link
    const firstRow = this.grid.locator('tr').filter({ 
      has: this.page.getByRole('link', { name: 'Select' }) 
    }).first();

    // Capture the email from the cell containing "@"
    const email = await firstRow.locator('td:has-text("@")').innerText();
    
    // Click the Select link in that specific row
    await firstRow.getByRole('link', { name: 'Select' }).click();
    
    return email.trim();
 }


  async completeAssignment() {
    await this.page.getByRole('button', { name: 'Assign Reviewers' }).click();
    await this.page.getByRole('button', { name: 'Yes' }).click();
    await this.page.getByRole('button', { name: 'Close Box' }).click();
    await expect(this.page.locator('//div[@class="BaseCircle Circle-val-Soild"]'))
    .toHaveCount(3, { timeout: 180000 });
  }
}