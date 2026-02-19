import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { MyApplicationsPage } from "@pages/my-applications-page";
import environmentDetails from "@data/Staging/smoke/environmentDetails.json";
import printFormsData from "@data/Staging/smoke/PrintLegalForms.json";
import { pageFixture } from "@utils/pageFixture";

// Utility to get environment-specific credentials
default function getFacilityUserCredentials() {
  // You can set the environment via process.env.TEST_ENV or default to 'dev'
  const env = process.env.TEST_ENV || 'dev';
  return environmentDetails[env];
}

test.describe('TCD_FT_02_FR-2: Verify printing of fax instructions and display of instruction text', () => {
  let loginPage: LoginPage;
  let myApplicationsPage: MyApplicationsPage;
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myApplicationsPage = new MyApplicationsPage(page);
  });

  test('should print fax instructions and display instruction text', async () => {
    const creds = getFacilityUserCredentials();
    // 1. Login as Facility user
    await page.goto(creds.acreditURL);
    await loginPage.login(creds.userName);

    // 2. Navigate to My Applications
    await myApplicationsPage.waitForLoad();
    await myApplicationsPage.clickOnMyApplicationsLink();
    await myApplicationsPage.waitForLoad();

    // 3. Ensure the Print Legal Forms for Submission link is visible
    await expect(
      page.getByRole('link', { name: 'Print legal forms for Submission' })
    ).toBeVisible({ timeout: 10000 });

    // 4. Click the Print Legal Forms for Submission link and capture popup
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Print legal forms for Submission' }).click();
    const popup = await popupPromise;

    // 5. Validate the popup opens successfully
    await expect(popup).not.toBeNull();
    await popup.close();

    // 6. Retrieve the instruction text from My Applications page
    const instructionText = await myApplicationsPage.getInstructionTextContent();
    expect(instructionText.trim()).toBe(printFormsData.expectedDetails.text);

    // 7. Sign out
    await myApplicationsPage.signOut();
  });

  test.afterEach(async () => {
    await page.close();
  });
});
