import { Page, Locator } from '@playwright/test';

export class ExamPersonnelPage {
  private page: Page;

  // ---------------- Locators ----------------
  private ctExam1: Locator;
  private ctExam2: Locator;
  private ctExam3: Locator;
  private nextPersonnelDetailButton: Locator;

  private addRadiologistButton: Locator;
  private radiologistLastNameInput: Locator;
  private radiologistFirstNameInput: Locator;
  private radiologistEmailInput: Locator;
  private radiologistSelectLink: Locator;
  private radiologistConfirmButton: Locator;
  private radiologistDegreeDropdown: Locator;

  private addPhysicistButton: Locator;
  private physicistLastNameInput: Locator;
  private physicistFirstNameInput: Locator;
  private physicistEmailInput: Locator;
  private physicistSelectLink: Locator;
  private physicistConfirmButton: Locator;

  private addTechnologistButton: Locator;
  private technologistLastNameInput: Locator;
  private technologistFirstNameInput: Locator;
  private technologistEmailInput: Locator;
  private technologistDegreeDialog: Locator;
  private technologistConfirmButton: Locator;
  private technologistCertificationSelectLink: Locator;
  private technologistCertificationConfirmButton: Locator;

  private nextPaymentDetailButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Exam Selection
    this.ctExam1 = page.locator('#ModulesAndExams_0__Exams_0__IsSelected');
    this.ctExam2 = page.locator('#ModulesAndExams_0__Exams_1__IsSelected');
    this.ctExam3 = page.locator('#ModulesAndExams_0__Exams_2__IsSelected');
    this.nextPersonnelDetailButton = page.getByRole('button', { name: 'Next: Personnel Detail' }).nth(1);

    // Radiologist
    this.addRadiologistButton = page.getByRole('button', { name: 'Add New Interpreting' });
    this.radiologistLastNameInput = page.locator('input[name^="RadiologistPersonnelList"][name$=".LastName"]');
    this.radiologistFirstNameInput = page.locator('input[name^="RadiologistPersonnelList"][name$=".FirstName"]');
    this.radiologistEmailInput = page.locator('input[name^="RadiologistPersonnelList"][name$=".EmailAddress"]');
    this.radiologistSelectLink = page.getByRole('link', { name: 'Select', exact: true });
    this.radiologistConfirmButton = page.getByRole('button', { name: 'Confirm Selection' });
    this.radiologistDegreeDropdown = page.getByRole('combobox');

    // Physicist
    this.addPhysicistButton = page.getByRole('button', { name: 'Add New Medical Physicist/MR' });
    this.physicistLastNameInput = page.locator('input[name^="PhysicistPersonnelList"][name$=".LastName"]');
    this.physicistFirstNameInput = page.locator('input[name^="PhysicistPersonnelList"][name$=".FirstName"]');
    this.physicistEmailInput = page.locator('input[name^="PhysicistPersonnelList"][name$=".EmailAddress"]');
    this.physicistSelectLink = page.getByRole('link', { name: 'Select', exact: true });
    this.physicistConfirmButton = page.getByRole('button', { name: 'Confirm Selection' });

    // Technologist
    this.addTechnologistButton = page.getByRole('button', { name: 'Add New Technologist' });
    this.technologistLastNameInput = page.locator('input[id^="TechnologistPersonnelList"][id$="__LastName"]');
    this.technologistFirstNameInput = page.locator('input[id^="TechnologistPersonnelList"][id$="__FirstName"]');
    this.technologistEmailInput = page.locator('input[id^="TechnologistPersonnelList"][id$="__EmailAddress"]');
    this.technologistDegreeDialog = page.locator('#DegreeDialog_1_7');
    this.technologistConfirmButton = page.getByRole('button', { name: 'Confirm Selection' });
    this.technologistCertificationSelectLink = page.getByRole('link', { name: 'Select', exact: true });
    this.technologistCertificationConfirmButton = page.getByRole('button', { name: 'Confirm Selection' });

    // Next Payment Detail
    this.nextPaymentDetailButton = page.getByRole('button', { name: 'Next: Payment Detail' }).nth(1);
  }

  /* ---------------- Exam Selection ---------------- */
  async selectCTExams(): Promise<void> {
    await this.ctExam1.check();
    await this.ctExam2.check();
    await this.ctExam3.check();
    await this.nextPersonnelDetailButton.click();
  }

  /* =========================
     Interpreting Radiologist
     ========================= */
  async addInterpretingRadiologist(lastName: string, firstName: string,
     email: string, degree1: string, degree2: string, degreeOption: string) {
    await this.addRadiologistButton.click();
    await this.radiologistLastNameInput.fill(lastName);
    await this.radiologistFirstNameInput.fill(firstName);
    await this.radiologistEmailInput.fill(email);

    await this.radiologistSelectLink.click();
    await this.page.getByRole('checkbox', { name: degree1 }).check();
    await this.page.locator('label').filter({ hasText: degree2 }).click();
    await this.radiologistConfirmButton.click();

    await this.radiologistDegreeDropdown.selectOption(degreeOption);
  }

  /* =========================
     Medical Physicist / MR
     ========================= */
  async addMedicalPhysicist(lastName: string, firstName: string, email: string, degree1: string, degree2: string) {
    await this.addPhysicistButton.click();
    await this.physicistLastNameInput.fill(lastName);
    await this.physicistFirstNameInput.fill(firstName);
    await this.physicistEmailInput.fill(email);

    await this.physicistSelectLink.click();
    await this.page.getByRole('checkbox', { name: degree1 }).check();
    await this.page.getByRole('checkbox', { name: degree2 }).check();
    await this.physicistConfirmButton.click();
  }

  /* =========================
     Technologist
     ========================= */
  async addTechnologist(lastName: string, firstName: string, 
    email: string, degree1: string, degree2: string, 
    certficateARRT: string, certficateCT: string, certFilterCCI: string, certificateRVS: string) {
    await this.addTechnologistButton.click();
    await this.technologistLastNameInput.fill(lastName);
    await this.technologistFirstNameInput.fill(firstName);
    await this.technologistEmailInput.fill(email);

    // Degree Selection
    await this.technologistDegreeDialog.click();
    await this.page.getByRole('checkbox', { name: degree1 }).check();
    await this.page.getByRole('checkbox', { name: degree2 }).check();
    await this.technologistConfirmButton.click();

    // Certification Selection
    await this.technologistCertificationSelectLink.click();
    await this.page.getByRole('checkbox', { name: certficateARRT }).check();
    await this.page.getByRole('checkbox', { name: certficateCT }).check();
    await this.page.locator('label').filter({ hasText: certFilterCCI }).click();
    await this.page.getByRole('checkbox', { name: certificateRVS }).check();
    await this.technologistCertificationConfirmButton.click();
  }

  async handleAdditionalPersonalDetails(): Promise<void> {
    //Check NOTA button if visible 
    const radioBtn = this.page.locator(`//input[@type='radio' and @value='27']`);
    await this.page.waitForTimeout(5000);
    if (await radioBtn.isVisible()) {
      await radioBtn.check();
      await this.clickNextPaymentDetail();
    }
  }

  /* =========================
     Next: Payment Detail
     ========================= */
  async clickNextPaymentDetail() {
    await this.nextPaymentDetailButton.click();
  }
}