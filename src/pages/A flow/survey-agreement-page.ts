import { Page, Locator } from '@playwright/test';
//commited us1,us2,us3
export class SurveyAgreementPage {
  private page: Page;
  private printTitleDropdown: Locator;
  private nextModalityButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.printTitleDropdown = page.getByLabel('Print Title of Practice Site');
    this.nextModalityButton = page
      .getByRole('button', { name: 'Next: Modality Selection' })
      .nth(1);
  }

  /**
   * Select Print Title of Practice Site and proceed to Modality Selection
   */
  async selectPrintTitleAndGoNext(value: string): Promise<void> {
    await this.page.waitForTimeout(5000);
    await this.printTitleDropdown.waitFor({ state: 'visible' });
    await this.printTitleDropdown.selectOption(value);

    await this.nextModalityButton.waitFor({ state: 'visible' });
    await this.nextModalityButton.click();
  }
}
