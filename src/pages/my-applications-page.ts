import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class MyApplicationsPage extends BasePage {
  readonly page: Page;

  // ---------------- Locators ----------------
  private heading: Locator;
  private applicationsLink: Locator;
  private createdOnSortLabel: Locator;
  private printLegalFormsLink: Locator;
  private applicationGrid: Locator;
  private signOutLink: Locator;
  private printLegalForms: Locator;
  private viewSubmittedApplication: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.heading = page.locator('[data-testid="my-applications-heading"]');
    this.applicationsLink = page.getByRole('link', { name: 'My Applications' });
    this.createdOnSortLabel = page.getByLabel('Created On: Ascending sort').getByText('Created On');
    this.printLegalFormsLink = page.getByRole('link', { name: 'Print legal forms for Submission' });
    this.applicationGrid = page.locator('#gridList_AccrAppList');
    this.signOutLink = page.getByRole('link', { name: 'Sign Out' });
    this.printLegalForms = page.getByRole('link', { name: 'Print legal forms for Submission' }); // Updated for accuracy
    this.viewSubmittedApplication = this.page.getByRole('link', { name: 'View Submitted Application' }).first();
  }

  /* ---------------- Page Load ---------------- */
  async waitForLoad(): Promise<void> {
    await this.heading.waitFor({ state: 'visible' });
  }

  async expectOnMyApplicationsPage(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  /* ---------------- Navigation ---------------- */
  async clickOnMyApplicationsLink(): Promise<void> {
    await expect(this.applicationsLink).toBeVisible({ timeout: 50000 });
    await this.applicationsLink.click();
  }

  async sortCreatedOnAscending(): Promise<void> {
    await this.createdOnSortLabel.click();
  }

  /* ---------------- Application Selection ---------------- */
  async selectApplicationById(applicationId: string): Promise<void> {
    await this.page.click(`[data-testid="application-row-${applicationId}"]`);
  }

  async waitForApplicationDetailsLoad(): Promise<void> {
    await this.page.waitForSelector('[data-testid="application-details-section"]', { state: 'visible' });
  }

  async validateApplicationExists(appNumber: string, facilityName: string): Promise<void> {
    await expect(this.applicationGrid).toContainText(appNumber);
    await expect(this.applicationGrid).toContainText(facilityName);
  }

  /* ---------------- Print Legal Forms ---------------- */
  /**
   * Returns true if the 'Print legal forms for Submission' link is visible for the submitted application.
   * Uses a stable selector and explicit visibility check.
   */
  async isPrintLegalFormsLinkVisible(): Promise<boolean> {
    await this.waitForApplicationDetailsLoad();
    return await this.printLegalFormsLink.isVisible();
  }

  /**
   * Waits for the 'Print legal forms for Submission' link to be visible and asserts its presence.
   * Use this for explicit assertion in tests.
   */
  async expectPrintLegalFormsLinkVisible(): Promise<void> {
    await expect(this.printLegalFormsLink).toBeVisible({ timeout: 10000 });
  }

  /**
   * Clicks on the 'Print legal forms for Submission' link and returns the popup page.
   * Waits for the link to be visible before clicking, and handles the popup window.
   */
  async clickOnPrintLegalForms(): Promise<Page> {
    await expect(this.printLegalForms).toBeVisible({ timeout: 10000 });
    const popupPromise = this.page.waitForEvent('popup');
    await this.printLegalForms.click();
    return await popupPromise;
  }

  /**
   * (Deprecated) Waits and asserts visibility of the print legal forms link. Use expectPrintLegalFormsLinkVisible instead.
   */
  async verifyPrintLegalFormsLink1(): Promise<void> {
    await this.page.waitForTimeout(5000);
    await expect(this.printLegalFormsLink).toBeVisible();
  }

  /**
   * (Deprecated) Clicks the print legal forms link using XPath. Use clickOnPrintLegalForms instead.
   */
  async verifyPrintLegalFormsLink(page1: Page) {
    await this.page.waitForTimeout(3000);
    await this.page.locator("xpath=//a[text()='Print legal forms for Submission']").click();
  }

  async clickOnViewSubmittedApplicationSummary(): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup');
    await this.viewSubmittedApplication.click();
    return await popupPromise;
  }

  /* ---------------- Sign Out ---------------- */
  async signOut(): Promise<void> {
    await this.signOutLink.click();
  }
}
