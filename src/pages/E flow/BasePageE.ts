import { Page } from '@playwright/test';

export class BasePageE {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string) {
        // await this.page.goto(url);
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }
}