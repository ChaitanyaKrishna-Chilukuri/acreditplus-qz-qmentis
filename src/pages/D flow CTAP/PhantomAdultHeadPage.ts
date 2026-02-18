import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PhantomAdultHeadPage extends BasePage {
    async fillPhantomData(data: any, nextTarget: string) {
        // 1. Explicitly click the form link in the sidebar to ensure navigation
        const formLink = this.page.getByRole('link', { name: 'CT Phantom Adult Head Dose' });
        await formLink.click();

        // 2. Wait for the "Loading..." overlay to disappear
        await this.page.locator('text=Loading...').waitFor({ state: 'hidden' });

        // 3. Now verify the header has updated
        const header = this.page.locator('#aplusPageHeader');
        await expect(header).toContainText('CT Phantom Adult Head Dose', { timeout: 15000 });

        const fillWithWait = async (selector: string, value: string) => {
            const locator = this.page.locator(selector);
            await locator.waitFor({ state: 'visible' });
            await locator.fill(value);
            await expect(locator).toHaveValue(value);
        };

        await fillWithWait('#item321', data.v1);
        await fillWithWait('#item421', data.v2);
        await fillWithWait('#item521', data.v3);
        await fillWithWait('#item621', data.v4);
        await fillWithWait('#item721', data.v6);
        await fillWithWait('#item821', data.v3);
        await fillWithWait('#item921', data.v7);
        await fillWithWait('#item1121', data.v5);
        await fillWithWait('#item1221', data.v5);
        await fillWithWait('#item1321', data.v5);
        await fillWithWait('#item1721', data.v5);
        await fillWithWait('#item1821', data.v5);
        await fillWithWait('#item1921', data.v5);
        await fillWithWait('#item2621', data.v6);

        await this.clickNext(nextTarget);
        
        // Ensure the old page is gone before returning
        await expect(header).not.toContainText('Adult Head Dose');
    }
}