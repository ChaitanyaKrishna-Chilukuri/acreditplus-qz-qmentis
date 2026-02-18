import { Page } from '@playwright/test';

export class BasePage {
  constructor(public page: Page) {}

  async waitForPopup(action: () => Promise<void>): Promise<Page> {
    try {
        const [popup] = await Promise.all([
            this.page.context().waitForEvent('page', { timeout: 60000 }),
            action(),
        ]);
        await popup.waitForLoadState('domcontentloaded');
        return popup;
    } catch (error) {
        console.error("Popup did not open within 60s:", error);
        throw error;
    }
  }

  async signOut() {
    await this.page.getByRole('link', { name: 'Sign Out' }).click();
    await this.page.waitForTimeout(4*60*1000); //wait for reviewers to be assigned.
  }
}