import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "@/pages/LoginPage";
import { MyApplicationsPage } from "@/pages/my-applications-page";
import environmentDetails from "@data/Staging/smoke/environmentDetails.json";
import printLegalFormsData from "@data/Staging/smoke/PrintLegalForms.json";
import { pageFixture } from "@/utils/pageFixture";

// Utility to get environment
function getEnv(): string {
  return process.env.ENV ? process.env.ENV.toLowerCase() : "uat";
}

const env = getEnv();
const envConfig = environmentDetails[env];
const facilityUser = envConfig.userName;
const baseUrl = envConfig.acreditURL;

// Test Case: TCD_FT_01_FR-1
// Verify 'Print Legal Forms for Submission' link visibility for submitted applications

test.describe("My Applications - Print Legal Forms Link", () => {
  test("TCD_FT_01_FR-1: Should display 'Print Legal Forms for Submission' link for submitted applications requiring legal forms", async ({ page }) => {
    // --- Setup: Login as Facility User ---
    const loginPage = new LoginPage(page);
    await page.goto(baseUrl);
    await loginPage.login(facilityUser);

    // --- Navigate to My Applications page ---
    const myApplicationsPage = new MyApplicationsPage(page);
    await myApplicationsPage.waitForLoad();
    await myApplicationsPage.expectOnMyApplicationsPage();

    // --- Find a submitted application that requires legal forms ---
    // For this test, we assume the first application with the link is valid.
    // Optionally, you could filter/sort or use test data for a specific application.
    // Sorting by Created On ascending to stabilize order
    await myApplicationsPage.sortCreatedOnAscending();
    await myApplicationsPage.waitForLoad();

    // --- Assertion: Print Legal Forms link is visible ---
    const isVisible = await myApplicationsPage.isPrintLegalFormsLinkVisible();
    expect(isVisible).toBeTruthy();

    // --- Optionally: Click the link and verify popup navigation ---
    // This is only done if the link is visible and popup is stable
    if (isVisible) {
      const [popup] = await Promise.all([
        page.waitForEvent("popup"),
        myApplicationsPage.clickOnPrintLegalForms()
      ]);
      // Wait for the popup to load
      await popup.waitForLoadState("domcontentloaded");
      // Optionally check the URL or title
      const popupUrl = popup.url();
      expect(popupUrl).toContain("/Facility/ApplicationList/ViewLegalForms");
      // Optionally, check for expected content from test data
      const { expectedDetails } = printLegalFormsData;
      if (expectedDetails && expectedDetails.name) {
        await expect(popup.locator("body")).toContainText(expectedDetails.name);
      }
      // Close the popup
      await popup.close();
    }
    // --- Post-condition: User remains on My Applications page ---
    await myApplicationsPage.expectOnMyApplicationsPage();
  });
});
