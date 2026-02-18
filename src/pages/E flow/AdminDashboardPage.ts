import { BasePageE } from './BasePageE';

export class AdminDashboardPage extends BasePageE {
    private readonly testingPackagesLink = this.page.getByRole('link', { name: 'Testing Packages', exact: true });
    private readonly modalitySelect = this.page.getByLabel('Modality', { exact: true });
    private readonly modalityIdInput = this.page.getByRole('textbox', { name: 'Modality#' });
    private readonly searchButton = this.page.getByRole('button', { name: 'Search', exact: true });
    private readonly viewItemsLink = this.page.getByRole('link', { name: 'View Items' });
    private readonly signOutLink = this.page.getByRole('link', { name: 'Sign Out' });

    async goToTestingPackages() {
        await this.testingPackagesLink.click();
    }

    async searchPackage(modality: string, id: string) {
        await this.modalitySelect.selectOption(modality);
        await this.modalityIdInput.fill(id);
        await this.searchButton.click();
        await this.viewItemsLink.first().waitFor({ state: 'visible', timeout: 90000 });
    }

    async openViewItemsPopup() {
        await this.viewItemsLink.first().click();
    }

    async clickSearch() {
        await this.searchButton.click();
    }

    async signOut() {
        await this.signOutLink.click();
    }
}