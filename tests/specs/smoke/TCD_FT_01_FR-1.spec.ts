import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "@/pages/LoginPage";
import { MyApplicationsPage } from "@/pages/my-applications-page";
import { ViewUploadFormsPage } from "@/pages/B flow/view-upload-forms-workflow";
import * as fs from "fs";
import * as path from "path";

// Load environment details (data-driven)
const environmentDetailsPath = path.resolve(__dirname, "../../../test-data/Staging/smoke/environmentDetails.json");
const environmentDetails = JSON.parse(fs.readFileSync(environmentDetailsPath, "utf-8"));

// Select target environment (change as needed)
const ENV = process.env.TEST_ENV || "dev";
const envConfig = environmentDetails[ENV];

// Password from env variable or fallback
const FACILITY_PASSWORD = process.env.ACR_PASSWORD || "TestPassword123!"; // Replace with secure retrieval if needed

/**
 * TCD_FT_01_FR-1: Access View/Upload Forms Page
 * Objective: Verify that the View/Upload Forms page is accessible throughout the accreditation cycle.
 * Preconditions: Facility User must have an active account; System must be operational and accessible via the provided URL
 * Steps:
 *   1. Navigate to the application URL.
 *   2. Login as Facility User.
 *   3. Navigate to My Applications and select the latest/appropriate application.
 *   4. Open the View/Upload Forms page.
 *   5. Assert the View/Upload Forms page loads (key elements, URL check).
 * Expected Result: The View/Upload Forms page is successfully accessed and displayed.
 * Post-conditions: User is on the View/Upload Forms page.
 */
test.describe("TCD_FT_01_FR-1: Access View/Upload Forms Page", () => {
  let page: Page;
  let loginPage: LoginPage;
  let myApplicationsPage: MyApplicationsPage;
  let viewUploadFormsPage: ViewUploadFormsPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myApplicationsPage = new MyApplicationsPage(page);
    viewUploadFormsPage = new ViewUploadFormsPage(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test("should allow Facility User to access the View/Upload Forms page", async () => {
    // Step 1: Navigate to the ACRedit app URL
    await page.goto(envConfig.acreditURL);
    await expect(page).toHaveURL(/ACReditPlus/);

    // Step 2: Login as Facility User
    await loginPage.login(envConfig.userName, FACILITY_PASSWORD);

    // Step 3: Navigate to My Applications
    await myApplicationsPage.waitForLoad();
    await myApplicationsPage.clickOnMyApplicationsLink();
    await myApplicationsPage.waitForLoad();

    // Step 4: Select the latest application (assuming sorted by Created On descending)
    // If a specific application selection is needed, adjust accordingly
    // We'll select the first application row (latest)
    const applicationRows = page.locator('[data-testid^="application-row-"]');
    await expect(applicationRows.first()).toBeVisible({ timeout: 20000 });
    const firstRow = applicationRows.first();
    await firstRow.click();
    await myApplicationsPage.waitForApplicationDetailsLoad();

    // Step 5: Open the View/Upload Forms page via the page object
    await viewUploadFormsPage.openViewUploadForms();

    // Step 6: Assert the View/Upload Forms page loads
    // a) Check for the presence of the View Submitted Application Summary link
    const viewSummaryLink = page.getByRole('link', { name: /View Submitted Application Summary/i });
    await expect(viewSummaryLink).toBeVisible({ timeout: 15000 });

    // b) Assert the URL contains 'ViewUploadForm'
    await expect(page).toHaveURL(/ViewUploadForm/);

    // c) Optionally, check for the page content region
    const uploadFormsContent = page.locator('#AppViewUploadFormContent');
    await expect(uploadFormsContent).toBeVisible({ timeout: 15000 });

    // Post-condition: User is on the View/Upload Forms page
    // (Covered by above assertions)
  });
});
