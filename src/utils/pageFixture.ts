import { test as base, expect as baseExpect } from '@playwright/test';

// --- Page Object Imports ---- //
import { LoginPage } from '@/pages/LoginPage';
import { ExamPersonnelPage } from '@/pages/A flow/exam-personnel-page';
import { FacilityDetailsPage } from '@/pages/A flow/facility-detail-page';
import { FacilityPage } from '@/pages/A flow/facility-page';
import { MyApplicationsPage } from '@/pages/my-applications-page';
import { PaymentSubmissionPage } from '@/pages/A flow/payment-application-submission-page';
import { SurveyAgreementPage } from '@/pages/A flow/survey-agreement-page';

type pageObjects = {
  examPersonnelPage: ExamPersonnelPage;
  loginPage: LoginPage;
  facilityDetailsPage: FacilityDetailsPage;
  facilityPage: FacilityPage;
  surveyAgreementPage: SurveyAgreementPage;
  paymentSubmissionPage: PaymentSubmissionPage;
  myApplicationsPage: MyApplicationsPage;
};

// Test object export
export const test = base.extend<pageObjects>({
  examPersonnelPage: async ({ page }, use) => {
    await use(new ExamPersonnelPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  facilityDetailsPage: async ({ page }, use) => {
    await use(new FacilityDetailsPage(page));
  },
  facilityPage: async ({ page }, use) => {
    await use(new FacilityPage(page));
  },
  surveyAgreementPage: async ({ page }, use) => {
    await use(new SurveyAgreementPage(page));
  },
  paymentSubmissionPage: async ({ page }, use) => {
    await use(new PaymentSubmissionPage(page));
  },
  myApplicationsPage: async ({ page }, use) => {
    await use(new MyApplicationsPage(page));
  }
});

// Expect function export
export const expect = baseExpect;
