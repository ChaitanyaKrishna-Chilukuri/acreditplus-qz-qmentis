import { Page, Locator } from '@playwright/test';

export class BUAPModalityPage {
  private page: Page;

  private breastUltrasoundCheckbox: Locator;
  private nextModalityInfoButton: Locator;
  private supervisingPhysicianRow: Locator;
  private supervisingPhysicianDegree: Locator;
  private supervisingPhysicianPhoneFirst: Locator;
  private supervisingPhysicianPhoneSecond: Locator;
  private supervisingPhysicianPhoneThird: Locator;
  private supervisingPhysicianEmail: Locator;
  private supervisingPhysicianConfirmEmail: Locator;
  private technologistRow: Locator;
  private technologistPhoneFirst: Locator;
  private technologistPhoneSecond: Locator;
  private technologistPhoneThird: Locator;
  private technologistEmail: Locator;
  private technologistConfirmEmail: Locator;
  private biopsyCheckbox: Locator;
  private fnacCheckbox: Locator;
  private numberOfUnitsInput: Locator;
  private nextPhysicianQualityButton: Locator;
  private nextRequiredExamsButton: Locator;
  private manufacturerDropdown: Locator;
  private modelNameDropdown: Locator;
  private yearManufacturedInput: Locator;
  private serialNumberInput: Locator;
  private operatingLocationDropdown: Locator;
  private transducerFreqRadio: Locator;
  private transducerFreqInput: Locator;
  private arrayTypeDropdown: Locator;
  private nextPersonnelDetailButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.breastUltrasoundCheckbox = page.getByRole('checkbox', { name: 'Breast Ultrasound' });
    this.nextModalityInfoButton = page.getByRole('button', { name: /Next: Modality Information/i }).nth(1);
    this.supervisingPhysicianRow = page.getByRole('row', { name: /Breast Ultrasound Supervising Physician/i });
    this.supervisingPhysicianDegree = page.getByLabel('Degree');
    this.supervisingPhysicianPhoneFirst = page.locator('#SupervisingPhysician_PhoneNumber_FirstSection');
    this.supervisingPhysicianPhoneSecond = page.locator('#SupervisingPhysician_PhoneNumber_SecondSection');
    this.supervisingPhysicianPhoneThird = page.locator('#SupervisingPhysician_PhoneNumber_ThirdSection');
    this.supervisingPhysicianEmail = page.locator('#SupervisingPhysician_EmailAddress');
    this.supervisingPhysicianConfirmEmail = page.locator('#SupervisingPhysician_ConfirmEmailAddress');
    this.technologistRow = page.getByRole('cell', { name: /First Name MI Last Name/i });
    this.technologistPhoneFirst = page.locator('#Technologist_PhoneNumber_FirstSection');
    this.technologistPhoneSecond = page.locator('#Technologist_PhoneNumber_SecondSection');
    this.technologistPhoneThird = page.locator('#Technologist_PhoneNumber_ThirdSection');
    this.technologistEmail = page.locator('#Technologist_EmailAddress');
    this.technologistConfirmEmail = page.locator('#Technologist_ConfirmEmailAddress');
    this.biopsyCheckbox = page.getByRole('checkbox', { name: 'Core Needle Biopsy' });
    this.fnacCheckbox = page.getByRole('checkbox', { name: 'Fine Needle Aspiration' });
    this.numberOfUnitsInput = page.locator('#NumberOfUnitsAtLocation');
    this.nextPhysicianQualityButton = page.getByRole('button', { name: 'Next: Physician Quality' }).nth(1);
    this.nextRequiredExamsButton = page.getByRole('button', { name: 'Next: Required Examinations' }).nth(1);
    this.manufacturerDropdown = page.getByLabel('Manufacturer');
    this.modelNameDropdown = page.getByLabel('Model Name', { exact: true });
    this.yearManufacturedInput = page.getByRole('textbox', { name: 'Year Manufactured' });
    this.serialNumberInput = page.getByRole('textbox', { name: 'Serial Number' });
    this.operatingLocationDropdown = page.getByLabel('Operating Location');
    this.transducerFreqRadio = page.getByRole('radio', { name: 'Transducer Frequency Single' });
    this.transducerFreqInput = page.locator('#SingleTransducerFrequency');
    this.arrayTypeDropdown = page.getByLabel('Type of Array');
    this.nextPersonnelDetailButton = page.getByRole('button', { name: /Next: Personnel Detail/i }).nth(1);
  }

  async selectBreastUltrasound(): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.breastUltrasoundCheckbox.check();
    await this.nextModalityInfoButton.click();
  }

  async enterBUSupervisingPhysician(units: number, firstName: string, lastName: string, degree: string, phone: { first: string; second: string; third: string }, email: string): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.numberOfUnitsInput.fill(units.toString());
    await this.supervisingPhysicianRow.getByLabel('First Name').fill(firstName);
    await this.supervisingPhysicianRow.getByLabel('Last Name').fill(lastName);
    await this.supervisingPhysicianDegree.selectOption(degree);
    await this.supervisingPhysicianPhoneFirst.fill(phone.first);
    await this.supervisingPhysicianPhoneSecond.fill(phone.second);
    await this.supervisingPhysicianPhoneThird.fill(phone.third);
    await this.supervisingPhysicianEmail.fill(email);
    await this.supervisingPhysicianConfirmEmail.fill(email);
  }

  async enterBUTechnologist(firstName: string, lastName: string, phone: { first: string; second: string; third: string }, email: string, exam: string): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.technologistRow.getByLabel('First Name').first().fill(firstName);
    await this.technologistRow.getByLabel('Last Name').first().fill(lastName);
    await this.technologistPhoneFirst.fill(phone.first);
    await this.technologistPhoneSecond.fill(phone.second);
    await this.technologistPhoneThird.fill(phone.third);
    await this.technologistEmail.fill(email);
    await this.technologistConfirmEmail.fill(email);
    if (exam === 'Biopsy') {
    await this.biopsyCheckbox.check();
    } else if (exam === 'FNAC') {
    await this.fnacCheckbox.check();
    }
    await this.nextPhysicianQualityButton.click();
  }

  async enterBUPhysicianQuality(qualityScore: string): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.page.locator('span').filter({ hasText: 'Yes' }).getByRole('radio').check();
    await this.page.locator('span').filter({ hasText: 'Peer Review' }).getByRole('radio').check();
    await this.page.getByRole('radio').nth(4).check();
    await this.page.getByRole('textbox').fill(qualityScore);
    await this.page.locator('div:nth-child(7) span .choiceItem').first().check();
    await this.nextRequiredExamsButton.click();
  }

  async enterBUUnitDetails(data: any): Promise<void> {
    await this.page.getByRole('button', { name: /Next: BUAP Unit/i }).nth(1).click();
    await this.page.waitForTimeout(3000);
    await this.manufacturerDropdown.selectOption(data.manufacturer);
    await this.modelNameDropdown.selectOption(data.modelName);
    await this.serialNumberInput.fill(data.serialNumber);
    await this.yearManufacturedInput.click();
    await this.yearManufacturedInput.fill(data.yearManufactured);
    await this.operatingLocationDropdown.selectOption(data.operatingLocation);
    await this.transducerFreqRadio.check();
    await this.transducerFreqInput.fill(data.transducerFrequency);
    await this.arrayTypeDropdown.selectOption(data.arrayType);
  }

  async clickNextPersonnelDetail(): Promise<void> {
    await this.nextPersonnelDetailButton.click();
  }
}