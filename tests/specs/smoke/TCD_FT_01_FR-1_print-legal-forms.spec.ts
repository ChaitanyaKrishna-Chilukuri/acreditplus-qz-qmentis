import { test, expect } from "@playwright/test";
import { LoginPage } from "@/pages/LoginPage";
import { MyApplicationsPage } from "@/pages/my-applications-page";
import environmentDetails from "@data/Staging/smoke/environmentDetails.json";
import printLegalFormsData from "@data/Staging/smoke/PrintLegalForms.json";
import { pageFixture } from "@/utils/pageFixture";

// Test ID: TCD_FT_01_FR-1
// Test Objective: Verify 'Print Legal Forms for Submission' link visibility for submitted applications requiring legal forms

test.describe("TCD_FT_01_FR-1: Print Legal Forms for Submission link visibility", () => {
  let loginPage: LoginPage;
  let myApplicationsPage: MyApplicationsPage;
  const env = process.env.TEST_ENV || "dev";
  const userName = environmentDetails[env].userName;
  const dashboardUrl = environmentDetails[env].dashboard;
  const expectedDetails = printLegalFormsData.expectedDetails;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    myApplicationsPage = new MyApplicationsPage(page);
    // Login as Facility User
    await page.goto(environmentDetails[env].acreditURL);
    await loginPage.login(userName);
    // Ensure navigation to dashboard
    await expect(page).toHaveURL(dashboardUrl);
  });

  test("should display 'Print legal forms for Submission' link for submitted application requiring legal forms", async ({ page }) => {
    // Navigate to My Applications page via UI
    await myApplicationsPage.clickOnMyApplicationsLink();
    await myApplicationsPage.waitForLoad();
    await myApplicationsPage.expectOnMyApplicationsPage();

    // Optionally, sort or filter to find the submitted application (if required by test data)
    // await myApplicationsPage.sortCreatedOnAscending();

    // Validate application exists by expected details (modality, name, etc.)
    if (expectedDetails && expectedDetails.modality && expectedDetails.name) {
      await myApplicationsPage.validateApplicationExists(expectedDetails.modality, expectedDetails.name);
    }

    // Assert 'Print legal forms for Submission' link is visible for the submitted application
    const isVisible = await myApplicationsPage.isPrintLegalFormsLinkVisible();
    await expect(isVisible).toBe(true);

    // Additionally, assert user remains on My Applications page
    await myApplicationsPage.expectOnMyApplicationsPage();
  });
});
