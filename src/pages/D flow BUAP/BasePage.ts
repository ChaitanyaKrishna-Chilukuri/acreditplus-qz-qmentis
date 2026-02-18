import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    
    // Global Navigation
    readonly myTestingPackagesLink: Locator;
    readonly signOutLink: Locator;
    readonly pageHeader: Locator;
    readonly loadingOverlay: Locator;

    // Common Action Buttons
    readonly submitBtn: Locator;
    readonly confirmBtn: Locator;
    readonly yesBtn: Locator;
    readonly saveChangesBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Navigation
        this.myTestingPackagesLink = page.getByRole('link', { name: 'My Testing Packages' });
        this.signOutLink = page.getByRole('link', { name: 'Sign Out' });
        this.pageHeader = page.locator('#aplusPageHeader');
        this.loadingOverlay = page.locator('text=Loading...');

        // Buttons
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
        this.confirmBtn = page.getByRole('button', { name: 'Confirm' });
        this.yesBtn = page.getByRole('button', { name: 'Yes' });
        this.saveChangesBtn = page.getByRole('button', { name: 'Save Changes' });
    }

    async clickNext(target: string) {
        // Updated to use a dynamic locator based on the target name
        await this.page.getByRole('button', { name: `Next: ${target}` }).nth(1).click();
    }

    async waitForLoading() {
        await this.loadingOverlay.waitFor({ state: 'hidden' });
    }
}
