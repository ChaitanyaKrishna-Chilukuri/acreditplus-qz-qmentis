import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "@/pages/LoginPage";
import { MyApplicationsPage } from "@/pages/my-applications-page";
import environmentDetails from "@data/Staging/smoke/environmentDetails.json";
import printLegalFormsData from "@data/Staging/smoke/PrintLegalForms.json";

/**
 * Test Case: TCD_FT_01_FR-1
 * Name: Verify 'Print Legal Forms for Submission' link visibility for submitted applications
 * Objective: Ensure the 'Print Legal Forms for Submission' link is visible when the application is submitted and requires specific documents.
 * Preconditions: Facility User is logged into the ACReditPlus Application System
 * The application has been submitted and requires legal forms.
 * Priority: High
 * Type: Functional
 */

test.describe("TCD_FT_01_FR-1 | My Applications - Print Legal Forms link visibility", () => {
  let page: Page;
  let loginPage: LoginPage;
  let myApplicationsPage: MyApplicationsPage;
  const env = process.env.TEST_ENV || "dev";
  const envConfig = environmentDetails[env];
  const facilityUser = envConfig.userName;
  const baseUrl = envConfig.acreditURL;
  // Use applicationId from PrintLegalForms.json if available, else fallback
  const applicationId = printLegalFormsData?.expectedDetails?.applicationId || "635423";

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    loginPage = new LoginPage(page);
    myApplicationsPage = new MyApplicationsPage(page);
  });

  test("should display 'Print Legal Forms for Submission' link for submitted application requiring legal forms", async () => {
    // Step 1: Navigate to the ACReditPlus login portal
    await page.goto(baseUrl);

    // Step 2: Login as Facility User
    await loginPage.login(facilityUser);

    // Step 3: Navigate to My Applications page
    await myApplicationsPage.clickOnMyApplicationsLink();
    await myApplicationsPage.waitForLoad();
    await myApplicationsPage.expectOnMyApplicationsPage();

    // Step 4: Identify the submitted application that requires legal forms
    // Prefer selecting by applicationId if supported
    await myApplicationsPage.selectApplicationById(applicationId);
    await myApplicationsPage.waitForApplicationDetailsLoad();

    // Step 5: Verify the presence and visibility of the 'Print Legal Forms for Submission' link
    const isPrintLegalFormsVisible = await myApplicationsPage.isPrintLegalFormsLinkVisible();
    expect(isPrintLegalFormsVisible).toBeTruthy();

    // Step 6: User remains on My Applications page (no navigation away)
    await myApplicationsPage.expectOnMyApplicationsPage();
  });
});
