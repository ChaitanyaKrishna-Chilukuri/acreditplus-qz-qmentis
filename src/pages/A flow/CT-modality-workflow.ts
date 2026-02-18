import { Page, Locator } from '@playwright/test';

export class CTModalityPage {
  private page: Page;

  // ---------------- Locators ----------------
  private computedTomographyCheckbox: Locator;
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

  private numberOfUnitsInput: Locator;
  private nextPhysicianQualityButton: Locator;

  private roomLocationInput: Locator;
  private manufacturerDropdown: Locator;
  private modelNameDropdown: Locator;
  private yearManufacturedInput: Locator;
  private serialNumberInput: Locator;
  private operatingLocationDropdown: Locator;
  private adultCheckbox: Locator;
  private headNeckCheckbox: Locator;
  private nextExamSelectionButton: Locator;
  

  constructor(page: Page) {
    this.page = page;

    // Modality
    this.computedTomographyCheckbox = page.getByRole('checkbox', { name: 'Computed Tomography' });
    this.nextModalityInfoButton = page.getByRole('button', { name: /Next: Modality Information/i }).nth(1);

    // Supervising Physician
    this.supervisingPhysicianRow = page.getByRole('row', { name: /Computed Tomography Supervising Physician/i });
    this.supervisingPhysicianDegree = page.getByLabel('Degree');
    this.supervisingPhysicianPhoneFirst = page.locator('#SupervisingPhysician_PhoneNumber_FirstSection');
    this.supervisingPhysicianPhoneSecond = page.locator('#SupervisingPhysician_PhoneNumber_SecondSection');
    this.supervisingPhysicianPhoneThird = page.locator('#SupervisingPhysician_PhoneNumber_ThirdSection');
    this.supervisingPhysicianEmail = page.locator('#SupervisingPhysician_EmailAddress');
    this.supervisingPhysicianConfirmEmail = page.locator('#SupervisingPhysician_ConfirmEmailAddress');

    // Technologist
    this.technologistRow = page.getByRole('cell', { name: /First Name MI Last Name/i });
    this.technologistPhoneFirst = page.locator('#Technologist_PhoneNumber_FirstSection');
    this.technologistPhoneSecond = page.locator('#Technologist_PhoneNumber_SecondSection');
    this.technologistPhoneThird = page.locator('#Technologist_PhoneNumber_ThirdSection');
    this.technologistEmail = page.locator('#Technologist_EmailAddress');
    this.technologistConfirmEmail = page.locator('#Technologist_ConfirmEmailAddress');

    // Unit & Physician Quality
    this.numberOfUnitsInput = page.locator('#NumberOfUnitsAtLocation');
    this.nextPhysicianQualityButton = page.getByRole('button', { name: 'Next: Physician Quality' }).nth(1);

    // CT Unit Details
    this.roomLocationInput = page.locator('#RoomLocation');
    this.manufacturerDropdown = page.getByLabel('Manufacturer');
    this.modelNameDropdown = page.getByLabel('Model Name', { exact: true });
    this.yearManufacturedInput = page.getByRole('textbox', { name: 'Year Manufactured' });
    this.serialNumberInput = page.getByRole('textbox', { name: 'Serial Number' });
    this.operatingLocationDropdown = page.getByLabel('Operating Location');
    this.adultCheckbox = page.getByRole('checkbox', { name: 'Adult' });
    this.headNeckCheckbox = page.getByRole('checkbox', { name: 'Head/Neck' });
    this.nextExamSelectionButton = page.getByRole('button', { name: /Next: Exam Selection/i }).nth(1);
  }

  /* ---------------- Modality Selection ---------------- */
  async selectComputedTomography(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.computedTomographyCheckbox.check();
    await this.nextModalityInfoButton.click();
  }

    /* ---------------- Modality Selection ---------------- */
  async selectnextModalityInCMSInfo(): Promise<void> {
    await this.page.waitForTimeout(1000);    
    await this.nextModalityInfoButton.click();
  }

  /* ---------------- Supervising Physician ---------------- */
  async enterCTSupervisingPhysician(
    firstName: string,
    lastName: string,
    degree: string,
    phone: { first: string; second: string; third: string },
    email: string
  ): Promise<void> {

    await this.page.waitForTimeout(1000);
    await this.supervisingPhysicianRow.getByLabel('First Name').fill(firstName);
    await this.supervisingPhysicianRow.getByLabel('Last Name').fill(lastName);
    await this.supervisingPhysicianDegree.selectOption(degree);

    await this.supervisingPhysicianPhoneFirst.fill(phone.first);
    await this.supervisingPhysicianPhoneSecond.fill(phone.second);
    await this.supervisingPhysicianPhoneThird.fill(phone.third);

    await this.supervisingPhysicianEmail.fill(email);
    await this.supervisingPhysicianConfirmEmail.fill(email);
  }

  /* ---------------- Technologist ---------------- */
  async enterCTTechnologist(
    firstName: string,
    lastName: string,
    phone: { first: string; second: string; third: string },
    email: string
  ): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.technologistRow.getByLabel('First Name').fill(firstName);
    await this.technologistRow.getByLabel('Last Name').fill(lastName);

    await this.technologistPhoneFirst.fill(phone.first);
    await this.technologistPhoneSecond.fill(phone.second);
    await this.technologistPhoneThird.fill(phone.third);

    await this.technologistEmail.fill(email);
    await this.technologistConfirmEmail.fill(email);
  }

  /* ---------------- Unit & Physician Quality ---------------- */
  async enterUnitAndPhysicianQuality(units: string, peerReviewOption: string, qualityScore: string): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.numberOfUnitsInput.fill(units);
    await this.nextPhysicianQualityButton.click();

    await this.page.locator('span', { hasText: 'Yes' }).getByRole('radio').check();
    await this.page.locator('span', { hasText: peerReviewOption }).getByRole('radio').check();

    // Need to check on the 
    await this.page.getByRole('radio').nth(4).check();
    await this.page.getByRole('textbox').fill(qualityScore);

    await this.page.locator('div:nth-child(7) span .choiceItem').first().check();
  }

  /* ---------------- CT Unit Details ---------------- */
  async enterCTUnitDetails(
    roomLocation: string,
    manufacturer: string,
    modelName: string,
    yearManufactured: string,
    serialNumber: string,
    operatingLocation: string
  ): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('button', { name: /Next: CTAP Unit/i }).nth(1).click();

    await this.roomLocationInput.fill(roomLocation);
    await this.manufacturerDropdown.selectOption(manufacturer);
    await this.modelNameDropdown.selectOption(modelName);
    await this.yearManufacturedInput.click();
    await this.yearManufacturedInput.fill(yearManufactured);
    await this.serialNumberInput.fill(serialNumber);
    await this.operatingLocationDropdown.selectOption(operatingLocation);

    // Need to handle the code to check for different options
    await this.adultCheckbox.check();
    await this.headNeckCheckbox.check();

    await this.nextExamSelectionButton.click();
  }
}