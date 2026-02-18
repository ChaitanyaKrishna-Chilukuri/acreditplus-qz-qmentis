import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PhantomAdultAbdomenPage extends BasePage {
    async fillPhantomData(data: any, nextTarget: string) {
        // Wait for the header to transition to Abdomen Dose
        const header = this.page.locator('#aplusPageHeader');
        await expect(header).toContainText('CT Phantom Adult Abdomen Dose', { timeout: 15000 });
        
        // Wait for network to settle to ensure no background scripts clear the fields
        await this.page.waitForLoadState('networkidle');

        const fillAndVerify = async (selector: string, value: string) => {
            const locator = this.page.locator(selector);
            await locator.fill(value);
            await expect(locator).toHaveValue(value);
            await this.page.waitForTimeout(500); // Hard wait for stability
        };

        await fillAndVerify('#item321', data.v1);
        await fillAndVerify('#item421', data.v2);
        await fillAndVerify('#item521', data.v3);
        await fillAndVerify('#item621', data.v4);
        await fillAndVerify('#item721', data.v6);
        await fillAndVerify('#item821', data.v3);
        await fillAndVerify('#item921', data.v7);
        await fillAndVerify('#item1121', data.v5);
        await fillAndVerify('#item1221', data.v5);
        await fillAndVerify('#item1321', data.v5);
        await fillAndVerify('#item1721', data.v5);
        await fillAndVerify('#item1821', data.v5);
        await fillAndVerify('#item1921', data.v5);
        await fillAndVerify('#item2621', data.v6);

        // Buffer before navigation
        await this.page.waitForTimeout(1000);
        await this.clickNext(nextTarget);
    }
}