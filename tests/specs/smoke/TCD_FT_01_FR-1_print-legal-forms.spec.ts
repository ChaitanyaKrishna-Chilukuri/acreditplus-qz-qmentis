import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "@/pages/LoginPage";
import { MyApplicationsPage } from "@/pages/my-applications-page";
import { ActionUtils } from "@/utils/action-utils";
import { AllureReporter } from "@/utils/action-utils";
import environmentDetails from "@data/Staging/smoke/environmentDetails.json";
import printLegalFormsData from "@data/Staging/smoke/PrintLegalForms.json";
import { pageFixture } from "@/utils/pageFixture";

const envKey = process.env.TEST_ENV || "dev";
const env = environmentDetails[envKey];

// Test data for expected link text (if present)
const expectedLinkText = printLegalFormsData?.expectedDetails?.text || "Print legal forms for Submission";

// Utility to find a submitted application that requires legal forms
async function findSubmittedApplicationWithLegalForms(page: Page, myApplicationsPage: MyApplicationsPage) {
  // Wait for the applications list to load
  await myApplicationsPage.waitForLoad();

  // This assumes the page object provides a way to get a list of applications and their statuses.
  // If not, you may need to adjust selectors below to match the grid/table structure.
  // For this example, we look for the first visible 'Print legal forms for Submission' link.
  const printLegalFormsLinks = page.getByRole('link', { name: /Print legal forms for Submission/i });
  const count = await printLegalFormsLinks.count();
  for (let i = 0; i < count; i++) {
    const link = printLegalFormsLinks.nth(i);
    if (await link.isVisible()) {
      return link;
    }
  }
  return null;
}

test.describe("TCD_FT_01_FR-1: Print Legal Forms for Submission link visibility", () => {
  test("should display 'Print Legal Forms for Submission' link for submitted application requiring legal forms", async ({ page }, testInfo) => {
    AllureReporter.startStep("Login as Facility User");
    const loginPage = new LoginPage(page);
    await page.goto(env.acreditURL);
    await loginPage.login(env.userName);
    AllureReporter.endStep();

    AllureReporter.startStep("Navigate to My Applications page");
    const myApplicationsPage = new MyApplicationsPage(page);
    await myApplicationsPage.clickOnMyApplicationsLink();
    await myApplicationsPage.waitForLoad();
    await myApplicationsPage.expectOnMyApplicationsPage();
    AllureReporter.endStep();

    AllureReporter.startStep("Identify a submitted application that requires legal forms");
    const printLegalFormsLink = await findSubmittedApplicationWithLegalForms(page, myApplicationsPage);
    expect(printLegalFormsLink, "Expected at least one 'Print legal forms for Submission' link to be visible for a submitted application requiring legal forms.").not.toBeNull();
    AllureReporter.endStep();

    AllureReporter.startStep("Verify the 'Print Legal Forms for Submission' link is visible and has correct text");
    await expect(printLegalFormsLink!).toBeVisible({ timeout: 10000 });
    await expect(printLegalFormsLink!).toHaveText(/Print legal forms for Submission/i);
    if (expectedLinkText && expectedLinkText !== "Print legal forms for Submission") {
      await expect(printLegalFormsLink!).toHaveText(new RegExp(expectedLinkText, "i"));
    }
    AllureReporter.endStep();

    AllureReporter.startStep("Verify clicking the link opens a new window and user remains on My Applications page");
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      printLegalFormsLink!.click()
    ]);
    await expect(popup).not.toBeNull();
    // Optionally check the popup URL or content
    await expect(page).toHaveURL(/MyApplications/i);
    await myApplicationsPage.expectOnMyApplicationsPage();
    AllureReporter.endStep();

    AllureReporter.startStep("Sign out");
    await myApplicationsPage.signOut();
    AllureReporter.endStep();
  });
});
