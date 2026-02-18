import { ENV } from '@/config/env';
import { AdminApplicationReviewPage } from '@/pages/B flow/admin-application-review-page';
import { LoginPage } from '@/pages/LoginPage';
import { MyApplicationsPage } from '@/pages/my-applications-page';
import { ViewUploadFormsPage } from '@/pages/B flow/view-upload-forms-workflow';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import modalityInfo from '@data/Staging/smoke/ModalityAndUnit.json';

const selectedModality = modalityInfo.info.modality;

// --- MANUAL TOGGLE ---

const bdata = selectedModality === 'BUAP' 
    ? require('@data/Staging/smoke/BUAP-B-workflow.json')
    : require('@data/Staging/smoke/CTAP-B-workflow.json');
// ---------------------

const baseDir = path.join(process.cwd(), 'test-data/Staging/smoke/');

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