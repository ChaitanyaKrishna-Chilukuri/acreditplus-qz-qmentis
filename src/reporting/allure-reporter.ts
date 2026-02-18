export class AllureReporter {
  addStep(stepName: string): void {
    console.log(`[Allure Step] ${stepName}`);
  }

  addAttachment(name: string, content: string, type: string): void {
    console.log(`[Allure Attachment] ${name}`);
  }

  addTestCaseId(id: string): void {
    console.log(`[Allure Test Case ID] ${id}`);
  }
}
