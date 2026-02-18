import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  // Locate the sidebar container to narrow down the search
  readonly sidebar = this.page.locator('.complementary, #sidebar-menu, .nav-sidebar'); 
  readonly startSrLinks = this.page.getByRole('link', { name: 'Start SR' });

  async searchModality(value: string, id: string) {
    // 1. Target the 'SR' link specifically within the navigation menu
    // Using exact: true prevents matching "Start SR"
    await this.page.getByRole('link', { name: 'SR', exact: true }).click();
    
    // 2. Fill search criteria
    await this.page.getByLabel('Modality', { exact: true }).selectOption(value);
    await this.page.getByRole('textbox', { name: 'Modality#' }).fill(id);
    
    // 3. Click Search and wait for the results table to load/update
    await this.page.getByRole('button', { name: 'Search' }).click();
    const resultRow = this.page.locator(`table >> text=${id}`).first();
    await resultRow.waitFor({ state: 'visible', timeout: 90000 });
  }

  async startSR() {
    const popupPromise = this.page.context().waitForEvent('page');
    
    // Always targets the first visible instance in the 'Action' column
    await this.startSrLinks.first().click();
    
    const popup = await popupPromise;
    await popup.waitForLoadState();
    return popup;
  }

  async ETstartSR(examType: string) {
    const startSrBtn = this.page
            .locator('tr')
            .filter({ hasText: examType })
            .getByRole('link', { name: 'Start SR' });

        // Uses the BasePage helper to return the new tab
        return await this.waitForPopup(() => startSrBtn.click());
  }
}