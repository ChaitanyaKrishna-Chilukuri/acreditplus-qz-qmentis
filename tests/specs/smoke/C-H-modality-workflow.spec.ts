import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import modalityInfo from '@data/Staging/smoke/ModalityAndUnit.json';

// CTAP D flow pages.
import { LoginPage as DLoginPageCTAP } from '@/pages/D flow CTAP/LoginPage';
import { DashboardPage as DDashboardPageCTAP } from '@/pages/D flow CTAP/DashboardPage';
import { InstructionsPage as InstructionsPageCTAP } from '@/pages/D flow CTAP/InstructionsPage';
import { ClinicalFormPage } from '@/pages/D flow CTAP/ClinicalFormPage';
import { PhantomSiteDataPage } from '@/pages/D flow CTAP/PhantomSiteDataPage';
import { PhantomAdultHeadPage } from '@/pages/D flow CTAP/PhantomAdultHeadPage';
import { PhantomAdultAbdomenPage } from '@/pages/D flow CTAP/PhantomAdultAbdomenPage';
import { UploadPage as UploadPageCTAP } from '@/pages/D flow CTAP/Uploadpage';
import { SummaryPage as SummaryPageCTAP } from '@/pages/D flow CTAP/SummaryPage';

// BUAP D flow pages (common pages are now duplicated)
import { LoginPage as DLoginPageBUAP } from '@/pages/D flow BUAP/LoginPage';
import { DashboardPage as DDashboardPageBUAP } from '@/pages/D flow BUAP/DashboardPage';
import { InstructionsPage as InstructionsPageBUAP } from '@/pages/D flow BUAP/InstructionsPage';
import { PatientOutcomeDataPage } from '@/pages/D flow BUAP/PatientOutcomeDataPage';
import { BreastUltrasoundCystAspirationPage } from '@/pages/D flow BUAP/BreastUltrasoundCystAspirationPage';
import { BreastUltrasoundSolidMassPage } from '@/pages/D flow BUAP/BreastUltrasoundSolidMassPage';
import { CNBExamDataFormPage } from '@/pages/D flow BUAP/CNBExamDataFormPage';
import { FNACExamDataFormPage } from '@/pages/D flow BUAP/FNACExamDataFormPage';
import { UploadPage as UploadPageBUAP } from '@/pages/D flow BUAP/Uploadpage';
import { SummaryPage as SummaryPageBUAP } from '@/pages/D flow BUAP/SummaryPage';

// Common E and F flow pages
import { AdminDashboardPage } from '@/pages/E flow/AdminDashboardPage';
import { AdminLogin as EAdminLogin } from '@/pages/E flow/AdminLogin';
import { ViewItemsPopup } from '@/pages/E flow/ViewItemsPopup';
import { AdminLoginPage as FAdminLoginPage } from '@/pages/F flow/AdminLoginPage';
import { SearchPage } from '@/pages/F flow/SearchPage';
import { AssignReviewersPage } from '@/pages/F flow/AssignReviewersPage';

// G-H Flow pages
import { ReviewerLoginPage } from '@/pages/G-H Flow/ReviewerLoginPage';
import { ReviewerHomePage } from '@/pages/G-H Flow/ReviewerHomePage';
import { FinalReportsAndCertification } from '@/pages/G-H Flow/FinalReportsAndCertification';

// CTAP G flow page
import { ReviewSheetPage as ReviewSheetPageCTAP } from '@/pages/G-H Flow/ReviewSheetPage';

// BUAP G flow page
import { BUAPReviewSheetPage } from '@/pages/G flow BUAP/BUAPReviewSheetPage';

// Data files
import ctapData from '@data/Staging/smoke/CTAP-C-H-workflow-data.json';
import buapData from '@data/Staging/smoke/BUAP-C-H-workflow-data.json';

const baseDir = path.join(process.cwd(), 'test-data/Staging/smoke/');

const ctapDataPath = require.resolve('@data/Staging/smoke/CTAP-C-H-workflow-data.json');
const buapDataPath = require.resolve('@data/Staging/smoke/BUAP-C-H-workflow-data.json');

const selectedModality = modalityInfo.info.modality;

const data = selectedModality === 'BUAP' ? buapData : ctapData;
const dataPath = selectedModality === 'BUAP' ? buapDataPath : ctapDataPath;

function updateReviewerEmailsInJson(emails: string[], dataPath: string) {
    try {
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const fileData = JSON.parse(fileContent);

        // Update the reviewer emails field
        fileData.review.reviewerEmails = emails;

        fs.writeFileSync(dataPath, JSON.stringify(fileData, null, 2));
        console.log(`Reviewer emails updated in ${dataPath}`);
    } catch (error) {
        console.error('Error updating JSON file:', error);
    }
}

test.setTimeout(60*60*1000);

test(`C-H Workflow for ${data.modality}`, async ({ page, context }) => {
        const reviewerEmails: string[] = [];

        await test.step('1. Testing Package Submission', async () => {
            let loginPage: DLoginPageCTAP | DLoginPageBUAP;
            let dashboard: DDashboardPageCTAP | DDashboardPageBUAP;
            let instructions: InstructionsPageCTAP | InstructionsPageBUAP;
            let upload: UploadPageCTAP | UploadPageBUAP;
            let summary: SummaryPageCTAP | SummaryPageBUAP;

            switch (data.modality) {
                case 'CTAP':
                    loginPage = new DLoginPageCTAP(page);
                    dashboard = new DDashboardPageCTAP(page);
                    instructions = new InstructionsPageCTAP(page);
                    upload = new UploadPageCTAP(page);
                    summary = new SummaryPageCTAP(page);
                    break;
                case 'BUAP':
                    loginPage = new DLoginPageBUAP(page);
                    dashboard = new DDashboardPageBUAP(page);
                    instructions = new InstructionsPageBUAP(page);
                    upload = new UploadPageBUAP(page);
                    summary = new SummaryPageBUAP(page);
                    break;
                default:
                    throw new Error(`Unsupported modality: ${data.modality}`);
            }
            
            await loginPage.login(data.submission.login.user);
            await dashboard.navigateToPackage(data.submission.packageId);
            await instructions.acceptInstructions();

            switch (data.modality) {
                case 'CTAP':
                    const ctapSubmission = data.submission as typeof ctapData.submission;
                    const clinical = new ClinicalFormPage(page);
                    const siteData = new PhantomSiteDataPage(page);
                    const phantomH = new PhantomAdultHeadPage(page);
                    const phantomA = new PhantomAdultAbdomenPage(page);

                    await clinical.fillClinicalData(ctapSubmission.clinical, 'CT Clinical Adult');
                    await clinical.fillClinicalData(ctapSubmission.clinical, 'CT Clinical Adult C-');
                    await clinical.fillClinicalData(ctapSubmission.clinical, 'CT Phantom Site Scanning Data Form');
                    await siteData.fillSiteData(ctapSubmission.phantom);
                    await phantomH.fillPhantomData(ctapSubmission.phantom, 'CT Phantom Adult');
                    await phantomA.fillPhantomData(ctapSubmission.phantom, 'Upload Documents');
                    break;

                case 'BUAP':
                    const buapSubmission = data.submission as any;
                    const patientOutcome = new PatientOutcomeDataPage(page);
                    const cystAspiration = new BreastUltrasoundCystAspirationPage(page);
                    const solidMass = new BreastUltrasoundSolidMassPage(page);

                    await patientOutcome.fillPatientOutcomeData(buapSubmission.patientOutcomeData, modalityInfo.info.examType);
                    await cystAspiration.fillCystAspirationData(buapSubmission.cystAspirationData);
                    await solidMass.fillSolidMassData(buapSubmission.solidMassData, modalityInfo.info.examType);

                    if(modalityInfo.info.examType === 'Biopsy') {
                        const cnbExam = new CNBExamDataFormPage(page);
                        await cnbExam.fillCNBExamData(buapSubmission.cnbExamData);
                    } else if(modalityInfo.info.examType === 'FNAC') {
                        const fnacExam = new FNACExamDataFormPage(page);
                        await fnacExam.fillFNACExamData(buapSubmission.fnacExamData);
                    }
                    break;
                
                default:
                    throw new Error(`Unsupported modality: ${data.modality}`);
            }

            const filePath1 = path.join(baseDir, data.submission.filePath);
            let units: number = modalityInfo.info.unitNum;

            await upload.uploadDocuments(filePath1, units);
            await upload.skipImages();
            await summary.submit();
        });

        await test.step('2. Testing Package Confirmation', async () => {
            const loginPage = new EAdminLogin(page);
            const dashboard = new AdminDashboardPage(page);

            // await loginPage.navigate(data.confirmation.login.url);
            await loginPage.login(data.confirmation.login.username);
            await loginPage.navigate(data.confirmation.login.adminDashboard);
            await dashboard.goToTestingPackages();
            await dashboard.searchPackage(data.confirmation.search.modalityOption, data.confirmation.search.modalityId);

            await page.getByRole('link', { name: 'View Items' }).first().waitFor({ state: 'visible' });

            // 2. Start the listener and click simultaneously
            const [popupPage] = await Promise.all([
                page.waitForEvent('popup'), // 'popup' is often more reliable than context().waitForEvent('page')
                dashboard.openViewItemsPopup() 
            ]);

            // 3. Wait for the new page to be ready
            await popupPage.waitForLoadState('load');

            const itemsPopup = new ViewItemsPopup(popupPage);
            await itemsPopup.updateItems(
                data.confirmation.viewItems.itemOption, 
                data.confirmation.viewItems.unitStatus,
                modalityInfo.info.unitNum
            );
            await popupPage.close();
            await dashboard.signOut();
        });

        await test.step('3. Reviewer Assignment', async () => {
            const adminLoginPage = new FAdminLoginPage(page);
            const searchPage = new SearchPage(page);

            // await adminLoginPage.navigate(data.assignment.urls.loginPage);
            await adminLoginPage.login(data.assignment.adminCredentials.username);

            const examTypes = data.assignment.searchCriteria.examTypes;

            for (const type of examTypes) {
                const currentUrl = page.url();
                if (!currentUrl.includes('Admin/SRWorklist')) {
                    await adminLoginPage.navigate(data.assignment.urls.adminDashboard);
                }
                await searchPage.searchModality(
                    data.assignment.searchCriteria.modalityValue,
                    data.assignment.searchCriteria.modalityId
                );

                const popup = await searchPage.ETstartSR(type);
                const reviewerPage = new AssignReviewersPage(popup);

                const draftPopup = await reviewerPage.checkDraftBox();
                const activePage = draftPopup ? draftPopup : popup;
                const activeReviewerPage = new AssignReviewersPage(activePage);

                reviewerEmails.push(await activeReviewerPage.selectFirstAvailableReviewerEmail('#btnReviewer1'));
                reviewerEmails.push(await activeReviewerPage.selectFirstAvailableReviewerEmail('#btnReviewer2'));

                await activeReviewerPage.completeAssignment();
                if (draftPopup) await draftPopup.close();
                await popup.close();
            }

            updateReviewerEmailsInJson(reviewerEmails, dataPath);

            const finalReviewerPage = new AssignReviewersPage(page);
            await finalReviewerPage.signOut();
        });

        await test.step('4. Review Sheets and Certification', async () => {
            const updatedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
            const login = new ReviewerLoginPage(page);
            const home = new ReviewerHomePage(page);
            const admin = new FinalReportsAndCertification(page);

            for (const email of updatedData.review.reviewerEmails) {
                // await page.goto(updatedData.review.urls.loginPage, { waitUntil: 'commit' });
                await login.login(email);
                await page.goto(updatedData.review.urls.reviewerHome, { waitUntil: 'domcontentloaded' });

                const newPage = await home.searchAndModify(updatedData.review.searchCriteria.modalityValue, updatedData.review.searchCriteria.modalityId);
                
                switch (updatedData.modality) {
                    case 'CTAP':
                        const wizardCTAP = new ReviewSheetPageCTAP(newPage);
                        if (await wizardCTAP.isPhantomReview()) {
                            await wizardCTAP.performPhantomStep(updatedData.review.phantomData);
                        } else {
                            for (const step of updatedData.review.clinicalSteps) {
                                await wizardCTAP.performClinicalStep(step.btn);
                            }
                            await wizardCTAP.performClinicalReviewSubmission('Submit');
                        }
                        break;
                    case 'BUAP':
                        const wizardBUAP = new BUAPReviewSheetPage(newPage);
                        await wizardBUAP.performCystReviewStep(updatedData.review.cystData);
                        await wizardBUAP.performSolidReviewStep(updatedData.review.solidData, modalityInfo.info.examType);
                        if(modalityInfo.info.examType === 'Biopsy') {
                            await wizardBUAP.performCNBReviewStep(updatedData.review.cnbData);
                        } else if(modalityInfo.info.examType === 'FNAC') {
                            await wizardBUAP.performFNACReviewStep(updatedData.review.fnacData);
                        }
                        await wizardBUAP.submitReview();
                        break;
                    default:
                        throw new Error(`Unsupported modality: ${updatedData.modality}`);
                }
                
                await login.signOut();
            }

            await page.waitForTimeout(4 * 60 * 1000); //wait for review sheets to be finalized.
            // Admin Finalization
            // await page.goto(updatedData.review.urls.loginPage, { waitUntil: 'commit' });
            await login.login(updatedData.review.adminEmail);
            await page.goto(updatedData.review.urls.adminHome, { waitUntil: 'commit' });
            await admin.finalize(updatedData.review.searchCriteria.modalityValue, updatedData.review.searchCriteria.modalityId);
            await admin.downloadCert(updatedData.review.searchCriteria.modalityValue, updatedData.review.searchCriteria.modalityId);
            await login.signOut();
            await page.close();
        });
    });
