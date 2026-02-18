import { Page, Locator } from '@playwright/test';

export class FacilityDetailsPage {
    readonly page: Page;

    // Locators
    readonly facilityPhoneFirst: Locator;
    readonly facilityPhoneSecond: Locator;
    readonly facilityPhoneThird: Locator;
    readonly facilityFaxFirst: Locator;
    readonly facilityFaxSecond: Locator;
    readonly facilityFaxThird: Locator;
    readonly facilityOwnerTextbox: Locator;
    readonly supervisingPhysicianFirstName: Locator;
    readonly supervisingPhysicianDegree: Locator;
    readonly supervisingPhysicianEmail: Locator;
    readonly supervisingPhysicianConfirmEmail: Locator;
    readonly administratorFirstName: Locator;
    readonly administratorPhoneFirst: Locator;
    readonly administratorPhoneSecond: Locator;
    readonly administratorPhoneThird: Locator;
    readonly administratorConfirmEmail: Locator;
    readonly accountsPayablePhoneFirst: Locator;
    readonly accountsPayablePhoneSecond: Locator;
    readonly accountsPayablePhoneThird: Locator;
    readonly accountsPayableConfirmEmail: Locator;
    readonly practiceSettingDropdown: Locator;
    readonly nextSurveyAgreementButton: Locator;

    constructor(page: Page) {
    this.page = page;

    // Facility Owner
    this.facilityPhoneFirst = page.locator('#FacilityPhoneNumber_FirstSection');
    this.facilityPhoneSecond = page.locator('#FacilityPhoneNumber_SecondSection');
    this.facilityPhoneThird = page.locator('#FacilityPhoneNumber_ThirdSection');
    this.facilityFaxFirst = page.locator('#FacilityFaxNumber_FirstSection');
    this.facilityFaxSecond = page.locator('#FacilityFaxNumber_SecondSection');
    this.facilityFaxThird = page.locator('#FacilityFaxNumber_ThirdSection');
    this.facilityOwnerTextbox = page.getByRole('textbox', { name: 'Facility Owner' });

    // Supervising Physician
    this.supervisingPhysicianFirstName = page.locator('#SupervisingPhysician_FirstName');
    this.supervisingPhysicianDegree = page.locator('#SupervisingPhysician_SelectedDegreeId');
    this.supervisingPhysicianEmail = page.locator('#SupervisingPhysician_EmailAddress');
    this.supervisingPhysicianConfirmEmail = page.locator('#SupervisingPhysician_ConfirmEmailAddress');

    // Administrator
    this.administratorFirstName = page.locator('#Administrator_FirstName');
    this.administratorPhoneFirst = page.locator('#Administrator_PhoneNumber_FirstSection');
    this.administratorPhoneSecond = page.locator('#Administrator_PhoneNumber_SecondSection');
    this.administratorPhoneThird = page.locator('#Administrator_PhoneNumber_ThirdSection');
    this.administratorConfirmEmail = page.locator('#Administrator_ConfirmEmailAddress');

    // Accounts Payable
    this.accountsPayablePhoneFirst = page.locator('#AccountPayableContact_PhoneNumber_FirstSection');
    this.accountsPayablePhoneSecond = page.locator('#AccountPayableContact_PhoneNumber_SecondSection');
    this.accountsPayablePhoneThird = page.locator('#AccountPayableContact_PhoneNumber_ThirdSection');
    this.accountsPayableConfirmEmail = page.locator('#AccountPayableContact_ConfirmEmailAddress');

    // Practice Setting
    this.practiceSettingDropdown = page.locator('#PracticeSetting_SelectedPracticeSettingId');

    // Next button
    this.nextSurveyAgreementButton = page.getByRole('button', { name: 'Next: Survey Agreement' }).nth(1);
  }

  // ------------------------------
  // Facility Owner Information
  // ------------------------------
  async enterPhoneFaxNumber(phone1:string, phone2:string,phone3:string, fax1:string, fax2:string,fax3:string) {
    
    await this.page.waitForTimeout(5000);
    await this.facilityPhoneFirst.fill(phone1);
    await this.facilityPhoneSecond.fill(phone2);
    await this.facilityPhoneThird.fill(phone3);//'8999');

    await this.facilityFaxFirst.fill(fax1);//'654');
    await this.facilityFaxSecond.fill(fax2);//'567');
    await this.facilityFaxThird.fill(fax3);//'8999');
  }

  async enterFacilityOwner(ownerName: string) {
    await this.page.waitForTimeout(5000);
    await this.facilityOwnerTextbox.fill(ownerName);
  }

  // ------------------------------
  // Facility Supervising Physician Information
  // ------------------------------
  async enterSupervisingPhysician(firstName: string, lastName: string, degreeValue: string, email: string) {
    await this.page.waitForTimeout(5000);
    await this.supervisingPhysicianFirstName.fill(firstName);
    await this.page.getByRole('row', { name: `Name: ${firstName} First Name MI Last` })
      .getByLabel('Last Name')
      .fill(lastName);
    await this.supervisingPhysicianDegree.selectOption(degreeValue);
    await this.supervisingPhysicianEmail.fill(email);
    await this.supervisingPhysicianConfirmEmail.fill(email);
  }

  // ------------------------------
  // Facility Administrator Information
  // ------------------------------
  async enterAdministrator(firstName: string, lastName: string, degreeValue: string, email: string, adminphone1:string, adminphone2:string,adminphone3:string) {
    await this.page.waitForTimeout(5000);
    await this.administratorFirstName.fill(firstName);
    await this.page.getByRole('row', { name: `Name: ${firstName} First Name MI Last` })
      .getByLabel('Last Name')
      .fill(lastName);

    await this.page.getByRole('row', { name: 'Degree: [ Select ]' })
      .getByLabel('Degree')
      .selectOption(degreeValue);

    // stanadard Data used as a temporary workaround
    await this.page.getByRole('checkbox', { name: 'ARRT (RT)' }).check();
    await this.page.getByRole('checkbox', { name: 'BS (earned after 2011)' }).check();
    await this.page.getByRole('checkbox', { name: 'CCI' }).check();
    await this.page.getByRole('checkbox', { name: 'RVS' }).check();

    await this.administratorPhoneFirst.fill(adminphone1);//'654');
    await this.administratorPhoneSecond.fill(adminphone2);//'567');
    await this.administratorPhoneThird.fill(adminphone3);//'8999');

    await this.page.getByRole('row', { name: 'Email Address: help' })
      .getByLabel('Email Address')
      .fill(email);
    await this.administratorConfirmEmail.fill(email);
  }

  // ------------------------------
  // Facility Accounts Payable Contact Information
  // ------------------------------
  async enterAccountsPayableContact(firstName: string, lastName: string, email: string, apPhone1:string, apPhone2:string, apPhone3:string) {
    await this.page.waitForTimeout(5000);
    await this.page.getByRole('row', { name: 'Name: First Name MI Last Name' })
      .getByLabel('First Name')
      .fill(firstName);
    await this.page.getByRole('row', { name: `Name: ${firstName} First Name MI Last` })
      .getByLabel('Last Name')
      .fill(lastName);

    await this.accountsPayablePhoneFirst.fill(apPhone1);//'654');
    await this.accountsPayablePhoneSecond.fill(apPhone2);//'567');
    await this.accountsPayablePhoneThird.fill(apPhone3);//'8999');

    await this.page.getByRole('row', { name: 'Email Address:', exact: true })
      .getByLabel('Email Address')
      .fill(email);
    await this.accountsPayableConfirmEmail.fill(email);
  }

  // ------------------------------
  // Practice Setting Information
  // ------------------------------
  async selectPracticeSettingOptions(practiceSetting:string, interpretPhys:string, facilitytype:string,  locationtype:string) {
    await this.page.waitForTimeout(5000);
    await this.practiceSettingDropdown.selectOption(practiceSetting);
    await this.page.getByLabel('The interpreting physicians').selectOption(interpretPhys);
    await this.page.getByLabel('The facility type of this').selectOption(facilitytype);
    await this.page.getByLabel('The location type of this').selectOption(locationtype);
  }

  // ------------------------------
  // Click Next: Survey Agreement
  // ------------------------------
  async clickNextSurveyAgreement() {
    await this.page.waitForTimeout(5000);
    await this.nextSurveyAgreementButton.click();
    await this.page.waitForTimeout(5000);
  }
}