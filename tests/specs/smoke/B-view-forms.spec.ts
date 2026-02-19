import { ENV } from '@/config/env';
import { AdminApplicationReviewPage } from '@/pages/B flow/admin-application-review-page';
import { LoginPage } from '@/pages/LoginPage';
import { MyApplicationsPage } from '@/pages/my-applications-page';
import { ViewUploadFormsPage } from '@/pages/B flow/view-upload-forms-workflow';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import modalityInfo from '@data/Staging/smoke/ModalityAndUnit.json';

// --- NEW IMPORT FOR ENVIRONMENT DETAILS ---
import environmentDetails from '@data/Staging/smoke/environmentDetails.json';
// ------------------------------------------

const selectedModality = modalityInfo.info.modality;

// --- MANUAL TOGGLE ---

const bdata = selectedModality === 'BUAP' 
    ? require('@data/Staging/smoke/BUAP-B-workflow.json')
    : require('@data/Staging/smoke/CTAP-B-workflow.json');
// ---------------------

const baseDir = path.join(process.cwd(), 'test-data/Staging/smoke/');

// --- NEW TEST CASE FOR TCD_FT_01_FR-1: Access View/Upload Forms Page ---
test('TCD_FT_01_FR-1: Access View/Upload Forms Page', async ({ page }, testInfo) => {
    // Step 1: Read acreditURL and credentials from environmentDetails.json for the target environment
    // Determine environment (e.g., 'uat', 'dev') from ENV or testInfo.project.name
    // Fallback to 'dev' if not set
    const envKey = ENV.envKey || process.env.TEST_ENV || 'dev';
    const envDetails = environmentDetails[envKey] || environmentDetails['dev'];
    const acreditURL = envDetails.acreditURL;
    const facilityUser = envDetails.userName;
    const facilityPassword = envDetails.password || ENV.auth.facility_password || undefined;

    const login = new LoginPage(page);
    const viewUpload = new ViewUploadFormsPage(page);

    // Step 2: Navigate to the URL
    await test.step('Navigate to application URL', async () => {
        await page.goto(acreditURL);
    });

    // Step 3: Login with valid credentials (username and password if provided)
    await test.step('Login as Facility User', async () => {
        if (facilityPassword) {
            await login.login(facilityUser, facilityPassword);
        } else {
            await login.login(facilityUser);
        }
    });

    // Step 4: Navigate to the View/Upload Forms landing page
    await test.step('Navigate to View/Upload Forms page', async () => {
        await viewUpload.openViewUploadForms();
    });

    // Step 5: Assert the landing page is displayed by checking a key element
    await test.step('Assert View/Upload Forms page is displayed', async () => {
        // Check for known link: 'View Submitted Application Summary' or 'View/Upload Forms'
        // Prefer robust locator: partial link text or role
        const viewUploadLink = page.getByRole('link', { name: /View\/Upload Forms/i });
        await expect(viewUploadLink).toBeVisible();
        // Optionally, check for heading or another key element
    });

    // Step 6: Leave the user on the View/Upload Forms page (no navigation away)
    // Step 7: Sign out if needed by test cleanup
    await test.step('Sign Out Facility User', async () => {
        // Try to sign out if sign out is available
        try {
            const applications = new MyApplicationsPage(page);
            await applications.signOut();
        } catch (e) {
            // If sign out fails, log and continue
            console.warn('Sign out failed or not needed:', e);
        }
    });
});
// --- END NEW TEST CASE ---

test(`B workflow : View/Upload forms & Application confirmation - ${selectedModality}`, async ({ page }) => {
    const url = ENV.baseUrl;
    const facility_username = ENV.auth.facility_username;
    const admin_username = ENV.auth.admin_username;
    const dashboard = ENV.facility.dashboard;
    
    const login = new LoginPage(page);
    const applications = new MyApplicationsPage(page);
    const viewUpload = new ViewUploadFormsPage(page);
    const adminReview = new AdminApplicationReviewPage(page);

    await test.step('Login as Facility User', async () => {
        await login.goto(url);
        await login.login(facility_username);
    });

    await test.step('Navigate to Facility Dashboard', async () => {
        await page.goto(dashboard);
    });

    await test.step('Navigate to View/Upload Forms', async () => {
        await applications.clickOnMyApplicationsLink();
        await viewUpload.openViewUploadForms();
    });

    let applicationID: string;
    await test.step('Retrieve and Update Application ID', async () => {
        applicationID = await viewUpload.getFacilityID(bdata.modalityType);
        
        if (applicationID) {
            // const baseDir = path.resolve(__dirname, '../test-data/Staging/smoke');
            let fileName = '';

            switch (bdata.modalityType) {
                case 'CTAP':
                    fileName = 'CTAP-C-H-workflow-data.json';
                    break;
                case 'BUAP':
                    fileName = 'BUAP-C-H-workflow-data.json';
                    break;
                default:
                    throw new Error(`Unsupported modality type: ${bdata.modalityType}`);
            }

            const filePath = path.join(baseDir, fileName);

            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const fileData = JSON.parse(fileContent);
                
                fileData.submission.packageId = applicationID;
                fileData.confirmation.search.modalityId = applicationID;
                fileData.assignment.searchCriteria.modalityId = applicationID;
                fileData.review.searchCriteria.modalityId = applicationID;

                fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
                console.log(`Updated ${fileName} with application ID: ${applicationID}`);
            } else {
                console.error(`File not found: ${filePath}`);
            }
        }
    });

    await test.step('Upload File and Send to ACR', async () => {
        const pdfFilePath = path.join(baseDir, bdata.filePath);
        await viewUpload.uploadSurveyFile(pdfFilePath);
        await viewUpload.sendToACR();
        await viewUpload.verifyFilesNotReviewedMessage();
    });


    await test.step('Sign Out Facility User', async () => {
        await applications.signOut();
    });

    await test.step('Login as Admin User', async () => {
        await login.login(admin_username);
    });

    await test.step(`Perform Admin Review for ${bdata.modalityType}`, async () => {
        await adminReview.performAdminReview(bdata.modalityType, applicationID);
    });

    await page.waitForTimeout(3 * 60 * 1000);
    
});
