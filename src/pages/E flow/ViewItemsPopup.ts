import { Page } from '@playwright/test';

export class ViewItemsPopup {
    private readonly page: Page;
    private readonly itemDropdown = (p: Page) => p.getByRole('cell', { name: '--' }).getByRole('combobox');
    private readonly unitStatusDropdown = (p: Page) => p.locator('select[id^="unitstatus_"]');
    private readonly confirmBtn = (p: Page) => p.getByRole('button', { name: 'Confirm' });
    private readonly yesBtn = (p: Page) => p.getByRole('button', { name: 'Yes' });

    constructor(page: Page) {
        this.page = page;
    }

    async updateItems(itemValue: string, statusValue: string, units: number) {
        await this.itemDropdown(this.page).selectOption(itemValue);
        for(let i = 0; i < units; i++) {
            (await this.unitStatusDropdown(this.page).nth(i).selectOption(statusValue));
        }
        await this.confirmBtn(this.page).click();
        await this.yesBtn(this.page).click();
    }
}