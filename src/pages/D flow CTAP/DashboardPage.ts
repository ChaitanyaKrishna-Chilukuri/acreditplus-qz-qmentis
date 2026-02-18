import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    async navigateToPackage(packageId: string) {
        await this.page.goto('https://acreditplus-cloud-dev-two.acr.org/ACReditPlus/Facility/Dashboard');
        
        await this.page.getByRole('link', { name: 'My Testing Packages' }).click();

        const pageSizeDropdown = this.page.getByRole('combobox');
        await pageSizeDropdown.waitFor({ state: 'visible', timeout: 300000 });
        
        await pageSizeDropdown.selectOption('50');
        
        // Locate the specific row containing the Package ID
        const packageRow = this.page.locator('tr').filter({ hasText: packageId });
        
        // Target the specific link by its name within that row
        // Based on your logs, 'Modify' is the standard action link
        const modifyLink = packageRow.getByRole('link', { name: 'Modify' });
        
        await expect(modifyLink).toBeVisible();
        await modifyLink.click();
    }
}