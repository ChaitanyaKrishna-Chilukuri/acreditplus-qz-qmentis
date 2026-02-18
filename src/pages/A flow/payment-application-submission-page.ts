import { Page, Locator, expect } from '@playwright/test';

export class PaymentSubmissionPage {
  private page: Page;

  // ---------------- Locators ----------------
  private paymentMethodRadio: Locator;
  private nextApplicationSummaryButton: Locator;

  private nextVerifyApplicationButton: Locator;
  private goToApplicationSubmissionButton: Locator;

  private surveyAgreementCheckbox: Locator;
  private applicationFeeCheckbox: Locator;
  private invoiceCopyCheckbox: Locator;
  private submitApplicationButton: Locator;

  private confirmationHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Payment
    this.paymentMethodRadio = page.getByRole('radio', { name: 'Please select payment method' });
    this.nextApplicationSummaryButton = page.getByRole('button', { name: 'Next: Application Summary' }).nth(1);

    // Summary & Verification
    this.nextVerifyApplicationButton = page.getByRole('button', { name: 'Next: Verify Application Data' }).nth(1);
    this.goToApplicationSubmissionButton = page.getByRole('button', { name: 'Go to Application Submission' });

    // Application Submission
    this.surveyAgreementCheckbox = page.getByRole('checkbox', { name: 'Survey Agreement' });
    this.applicationFeeCheckbox = page.getByRole('checkbox', { name: 'Application Fee' });
    this.invoiceCopyCheckbox = page.getByRole('checkbox', { name: 'Copy of Application Invoice' });
    this.submitApplicationButton = page.getByRole('button', { name: 'Submit Application' }).nth(1);

    // Confirmation
    this.confirmationHeader = page.locator('h1');
  }

  /* ---------------- Payment ---------------- */
  async selectPaymentMethodAndProceed(): Promise<void> {
    await this.paymentMethodRadio.check();
    await this.nextApplicationSummaryButton.click();
  }

  /* ---------------- Summary & Verification ---------------- */
  async proceedThroughSummaryAndVerification(): Promise<void> {
    await this.nextVerifyApplicationButton.click();
    await this.goToApplicationSubmissionButton.click();
  }

  /* ---------------- Application Submission ---------------- */
  async submitApplication(): Promise<void> {
    await this.surveyAgreementCheckbox.check();
    await this.applicationFeeCheckbox.check();
    await this.invoiceCopyCheckbox.check();
    await this.submitApplicationButton.click();
  }

  /* ---------------- Confirmation ---------------- */
  async verifySubmissionConfirmation(expectedText: string = 'Application Submitted Successfully'): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.page.waitForTimeout(3000);
    await expect(this.confirmationHeader).toContainText(expectedText);
  }

  /* ---------------- My Applications (Optional) ---------------- */
  async navigateToMyApplicationsAndValidate(): Promise<void> {
    await this.page.getByRole('link', { name: 'Here' }).click();
    await this.page.getByRole('link', { name: 'My Applications' }).click();
    await this.page.getByLabel('Created On: Ascending sort').getByText('Created On').click();
  }
}