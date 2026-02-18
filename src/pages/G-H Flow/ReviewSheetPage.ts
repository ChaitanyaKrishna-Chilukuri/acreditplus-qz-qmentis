import { expect, Page } from '@playwright/test';

export class ReviewSheetPage {
  constructor(private page: Page) {}

  readonly pageHeader = this.page.locator('#aplusPageHeader');
  readonly calculateBtn = this.page.getByRole('button', { name: 'Calculate' });
  readonly okBtn = this.page.getByRole('button', { name: 'OK' });
  readonly resultBtn = this.page.locator('#item22301');
  readonly viewSupportFilesBtn = this.page.locator('#btnSupportFiles');

  columnHeaderLabels(label: string,column: number) {
    return this.page.locator(`//label[contains(text(), '${label}')]/parent::div/parent::td/following-sibling::td[${column}]`);
  }
  columnHeaderTextBox(label: string, column: number, type: string) {
    return this.page.locator(`//label[contains(text(), '${label}')]/parent::div/parent::td/following-sibling::td[${column}]//${type}`);
  }

  async isPhantomReview() {
    const headerText = await this.pageHeader.textContent();
    return headerText?.includes('Phantom');
  }

  async handleViewSupportFiles() {
    // Step 4: Click "View Support Files", wait for the new PDF tab, then close it
    await this.viewSupportFilesBtn.click();
    await this.page.bringToFront();
  }

  async fillCTDIvolCorrection(ctData: any) {
    await this.page.locator('#item5122').check();
    await this.page.locator('#item5132').check();
    await this.page.locator('#item5221').check();
    await this.page.locator('#item5231').check();
    await this.columnHeaderTextBox('Correction factor', 1, 'input').fill(ctData.val1);
    await this.columnHeaderTextBox('Correction factor', 2, 'input').fill(ctData.val2);
    await this.columnHeaderTextBox('Reason for correction factor', 1, 'textarea').fill(ctData.reason);
    await this.columnHeaderTextBox('Reason for correction factor', 2, 'textarea').fill(ctData.reason);
  }

  async verifyAllPassStatuses() {
    const CTNumberResult1 = this.columnHeaderLabels('CT Number Result', 1);
    const CTNumberResult2 = this.columnHeaderLabels('CT Number Result', 2);
    await expect(CTNumberResult1).toHaveText('Pass');
    await expect(CTNumberResult2).toHaveText('Pass');

    const LowContrastResult1 = this.columnHeaderLabels('Low contrast result', 1);
    const LowContrastResult2 = this.columnHeaderLabels('Low contrast result', 2);
    await expect(LowContrastResult1).toHaveText('Pass');
    await expect(LowContrastResult2).toHaveText('Pass');

    const UniformityResult = this.columnHeaderLabels('Uniformity result', 2);
    await expect(UniformityResult).toHaveText('Pass');
  }

  async performPhantomStep(data: any) {
    // Execute Step 4 before filling data
    await this.handleViewSupportFiles();

    await this.page.locator('#item5175').selectOption(data.itemValue);

    // HU Values
    const waterRow = this.page.getByRole('row', { name: /Water HU/ });
    await waterRow.locator('input').nth(0).fill(data.hu.water[0]);
    await waterRow.locator('input').nth(1).fill(data.hu.water[1]);
    await this.page.getByRole('row', { name: /Polyethylene HU/ }).getByPlaceholder('-+000.00').fill(data.hu.poly);
    await this.page.getByRole('row', { name: /Acrylic HU/ }).getByPlaceholder('-+000.00').fill(data.hu.acrylic);
    await this.page.getByRole('row', { name: /Bone HU/ }).getByPlaceholder('-+0000.00').fill(data.hu.bone);
    await this.page.getByRole('row', { name: /Air HU/ }).getByPlaceholder('-+0000.00').fill(data.hu.air);

    // Signal/SD Values
    const signalRows = [
      { name: 'Signal inside 25 mm rod (HU)', vals: data.signals.in },
      { name: 'Signal outside 25 mm rod (HU)', vals: data.signals.out },
      { name: 'SD outside 25 mm rod (HU)', vals: data.signals.sd }
    ];

    for (const row of signalRows) {
      const targetRow = this.page.getByRole('row', { name: row.name });
      await targetRow.locator('input').nth(0).fill(row.vals[0]);
      await targetRow.locator('input').nth(1).fill(row.vals[1]);
    }

    // ROI Signals
    await this.page.getByRole('row', { name: /Center ROI/ }).getByPlaceholder('-+00000.00').fill(data.roi.c);
    await this.page.getByRole('row', { name: /12:00 ROI/ }).getByPlaceholder('-+00000.00').fill(data.roi.t);
    await this.page.getByRole('row', { name: /3:00 ROI/ }).getByPlaceholder('-+00000.00').fill(data.roi.th);
    await this.page.getByRole('row', { name: /6:00 ROI/ }).getByPlaceholder('-+00000.00').fill(data.roi.s);
    await this.page.getByRole('row', { name: /9:00 ROI/ }).getByPlaceholder('-+00000.00').fill(data.roi.n);

    // CTDIvol Correction Section
    await this.fillCTDIvolCorrection(data.ctdivol);
    await this.verifyAllPassStatuses();

    await this.page.locator('div').filter({ hasText: /^Major$/ }).first().click();
    await this.calculateBtn.click();
    await this.okBtn.click();
    await expect(this.page.locator('#divReviewSheetContent')).toContainText('PASS');
    await this.page.getByRole('button', { name: 'Next: Submit' }).click();
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async performClinicalStep(nextBtnName: string) {
    await this.handleViewSupportFiles();
    await this.page.locator('.span1.text-end.score1').selectOption('4');
    await this.page.locator('.span1.text-end.score2').selectOption('4');
    await this.page.locator('.span1.text-end.score4').selectOption('4');
    await this.page
    .locator('div.customDropdown', { hasText: 'Is all necessary exam identification information present?' })
    .locator('select')
    .selectOption('Yes');
    await this.page.locator('.span1.text-end.score6').selectOption('4');

    await this.calculateBtn.click();
    await this.okBtn.click();
    await expect(this.page.locator('#divReviewSheetContent')).toContainText('PASS');
    await this.page.getByRole('button', { name: nextBtnName }).click();
  }

  async performClinicalReviewSubmission(btnName : string) {
    await this.page.getByRole('button', { name: btnName }).waitFor({ state: 'visible' , timeout: 90000 });
    await this.page.getByRole('button', { name: btnName }).click();
  }
}