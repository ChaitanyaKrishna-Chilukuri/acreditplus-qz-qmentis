import { expect, Page, test } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { FacilityPage } from '@/pages/A flow/facility-page';
import { FacilityDetailsPage } from '@/pages/A flow/facility-detail-page';
import { SurveyAgreementPage } from '@/pages/A flow/survey-agreement-page';
import { CTModalityPage } from '@/pages/A flow/CT-modality-workflow';
import { ExamPersonnelPage } from '@/pages/A flow/exam-personnel-page';
import { PaymentSubmissionPage } from '@/pages/A flow/payment-application-submission-page';
import { MyApplicationsPage } from '@pages/my-applications-page';
import { BUAPModalityPage } from '@/pages/A flow/BUAPModalityPage';
import environmentDetails from '@data/Staging/smoke/environmentDetails.json';
import modalityInfo from '@data/Staging/smoke/ModalityAndUnit.json';

const selectedModality = modalityInfo.info.modality;

const testDataArray = selectedModality === 'BUAP'
    ? require('@data/Staging/smoke/BUAP-ApplicationSubmission.json')
    : require('@data/Staging/smoke/CTAP-ApplicationSubmission.json');
// ---------------------

test.setTimeout(15 * 60 * 1000);

test(`A Workflow : Facility Creation and Application Submission - ${selectedModality}`, async ({ page }) => {
    
    const data = testDataArray;
    const acreditURL = environmentDetails.dev.acreditURL;
    const userName = environmentDetails.dev.userName;
    const dashboard = environmentDetails.dev.dashboard;

    const loginPage = new LoginPage(page);
    const facilityPage = new FacilityPage(page);
    const facilityDetailPage = new FacilityDetailsPage(page);
    const surveyAgreementPage = new SurveyAgreementPage(page);
    const cTModalityPage = new CTModalityPage(page);
    const bUAPModalityPage = new BUAPModalityPage(page);
    const examPersonnelPage = new ExamPersonnelPage(page);
    const paymentSubmissionPage = new PaymentSubmissionPage(page);
    const myApplicationsPage = new MyApplicationsPage(page);

    await test.step('Login to ACRedit application', async () => {
        await loginPage.goto(acreditURL);
        await loginPage.login(userName);        
    });

    await test.step('Navigate to Facility Dashboard', async () => {
        await page.goto(dashboard);
    });

    await test.step('Create Facility', async () => {
        await facilityPage.openFacilityPage();
        await facilityPage.selectFacilityType();
        await facilityPage.fillFacilityInfo();
    });

    await test.step('Enter Facility Details', async () => {
        await facilityDetailPage.enterPhoneFaxNumber(
            data.facility.phoneNumber.first,
            data.facility.phoneNumber.second,
            data.facility.phoneNumber.third,
            data.facility.faxNumber.first,
            data.facility.faxNumber.second,
            data.facility.faxNumber.third
        );
        await facilityDetailPage.enterFacilityOwner(data.facility.owner.name);
        await facilityDetailPage.enterSupervisingPhysician(
            data.supervisingPhysician.firstName,
            data.supervisingPhysician.lastName, 
            data.supervisingPhysician.degreeValue, 
            data.supervisingPhysician.email
        );
        await facilityDetailPage.enterAdministrator(
            data.administrator.firstName, 
            data.administrator.lastName, 
            data.administrator.degreeValue, 
            data.administrator.email,
            data.administrator.phoneNumber.first,
            data.administrator.phoneNumber.second,
            data.administrator.phoneNumber.third 
        );
        await facilityDetailPage.enterAccountsPayableContact(
            data.accountsPayableContact.firstName, 
            data.accountsPayableContact.lastName, 
            data.accountsPayableContact.email,
            data.accountsPayableContact.phoneNumber.first,
            data.accountsPayableContact.phoneNumber.second,
            data.accountsPayableContact.phoneNumber.third
        );
        await facilityDetailPage.selectPracticeSettingOptions(
            data.practiceSetting.selectedPracticeSettingId,
            data.practiceSetting.interpretingPhysicians,
            data.practiceSetting.facilityType,
            data.practiceSetting.locationType 
        );
        await facilityDetailPage.clickNextSurveyAgreement();
    });

    await test.step('Complete Survey Agreement', async () => {
        await surveyAgreementPage.selectPrintTitleAndGoNext(data.printTitleOption);
    });
     
    await test.step(`Configure Modality: ${data.modalityType}`, async () => {
        if (selectedModality === 'CTAP') {
            await cTModalityPage.selectComputedTomography();
            await cTModalityPage.selectnextModalityInCMSInfo();
            await cTModalityPage.enterCTSupervisingPhysician(
                data.SupervisingPhysicianContact.firstName,
                data.SupervisingPhysicianContact.lastName,
                data.SupervisingPhysicianContact.degree,
                data.SupervisingPhysicianContact.phoneNumber,
                data.SupervisingPhysicianContact.email
            );
            await cTModalityPage.enterCTTechnologist(
                data.TechnologistContact.firstName,
                data.TechnologistContact.lastName,
                data.TechnologistContact.phoneNumber,
                data.TechnologistContact.email
            );
            await cTModalityPage.enterUnitAndPhysicianQuality(
                data.UnitAndPhysician.unit,
                data.UnitAndPhysician.peerReviewOption,
                data.UnitAndPhysician.qualityScore
            );
            await cTModalityPage.enterCTUnitDetails(
                data.CTUnitDetails.roomLocation,
                data.CTUnitDetails.manufacturer,
                data.CTUnitDetails.modelName,
                data.CTUnitDetails.yearManufactured,
                data.CTUnitDetails.serialNumber,
                data.CTUnitDetails.operatingLocation
            );
        } else {
            await bUAPModalityPage.selectBreastUltrasound();
            await bUAPModalityPage.enterBUSupervisingPhysician(
                modalityInfo.info.unitNum,
                data.SupervisingPhysicianContact.firstName,
                data.SupervisingPhysicianContact.lastName,
                data.SupervisingPhysicianContact.degree,
                data.SupervisingPhysicianContact.phoneNumber,
                data.SupervisingPhysicianContact.email
            );
            await bUAPModalityPage.enterBUTechnologist(
                data.TechnologistContact.firstName,
                data.TechnologistContact.lastName,
                data.TechnologistContact.phoneNumber,
                data.TechnologistContact.email,
                modalityInfo.info.examType
            );
            await bUAPModalityPage.enterBUPhysicianQuality(data.UnitAndPhysician.qualityScore);
            for (let i = 0; i < modalityInfo.info.unitNum; i++) {
                await bUAPModalityPage.enterBUUnitDetails(data.BUUnitDetails);
            }
            await bUAPModalityPage.clickNextPersonnelDetail();
        }
    });

    await test.step('Add Exam Personnel', async () => {
        await page.waitForTimeout(3000);
        if (selectedModality === 'CTAP') {
            await examPersonnelPage.selectCTExams();
            await page.waitForTimeout(3000);
        }
        await examPersonnelPage.addInterpretingRadiologist(
            data.InterpretingRadiologist.lastName,
            data.InterpretingRadiologist.firstName,
            data.InterpretingRadiologist.email,
            data.InterpretingRadiologist.degreeMD,
            data.InterpretingRadiologist.degreeDO,
            data.InterpretingRadiologist.degreeOption
        );
        await page.waitForTimeout(3000);
        await examPersonnelPage.addMedicalPhysicist(
            data.MedicoPhysician.lastName,
            data.MedicoPhysician.firstName,
            data.MedicoPhysician.email,
            data.MedicoPhysician.degreeMD,
            data.MedicoPhysician.degreeDO
        );
        await page.waitForTimeout(3000);
        await examPersonnelPage.addTechnologist(
            data.addTechnologist.lastName,
            data.addTechnologist.firstName,
            data.addTechnologist.email,
            data.addTechnologist.degreeMD,
            data.addTechnologist.degreeDO,
            data.addTechnologist.certficateARRT,
            data.addTechnologist.certficateCT,
            data.addTechnologist.certFilterCCI,
            data.addTechnologist.certificateRVS
        );
        await page.waitForTimeout(3000);
        await examPersonnelPage.clickNextPaymentDetail();
        await examPersonnelPage.handleAdditionalPersonalDetails();
    });

    await test.step('Submit Payment and Application', async () => {
        await page.waitForTimeout(3000);
        await paymentSubmissionPage.selectPaymentMethodAndProceed();
        await page.waitForTimeout(3000);
        await paymentSubmissionPage.proceedThroughSummaryAndVerification();
        await page.waitForTimeout(3000);
        await paymentSubmissionPage.submitApplication();
        await page.waitForTimeout(5000);
        await paymentSubmissionPage.verifySubmissionConfirmation();
    });

    await test.step('Sign Out', async () => {
        await page.waitForTimeout(3000);
        await myApplicationsPage.signOut();
    }); 
    await page.close();
});