import { BasePage } from './BasePage';

export class PhantomSiteDataPage extends BasePage {
    async fillSiteData(data: any) {
        // Form Top
        await this.page.locator('#item273').fill(data.item273);
        await this.page.locator('#item268').fill(data.item268);
        await this.page.locator('#item274').fill(data.item274);
        await this.page.getByRole('checkbox', { name: '70kV' }).check();
        await this.page.locator('#item286').fill(data.commonText);
        await this.page.locator('#item287').fill(data.commonText);

        // Section 1
        await this.page.locator('#item2121').selectOption(data.item2121);
        await this.page.locator('#item10201').selectOption(data.item10201);
        await this.page.locator('#item221').fill(data.item221);
        await this.page.locator('#item321').fill(data.item321);
        await this.page.locator('#item421').fill(data.item421);
        await this.page.locator('#item721').fill(data.item721);
        await this.page.locator('#item821').fill(data.item821);
        await this.page.locator('#item921').fill(data.commonText);
        await this.page.locator('select#item1221').selectOption(data.item1221option);
        await this.page.locator('#item10020101').selectOption(data.item10020101);
        await this.page.locator('#item1121').fill(data.item1121);
        await this.page.locator('input#item1221').fill(data.item1221);
        await this.page.locator('#item1321').fill(data.item1321);
        await this.page.locator('#item1521').fill(data.item1521);
        await this.page.locator('#item1621').fill(data.item1621);
        await this.page.locator('#item1721').fill(data.commonText);
        await this.page.locator('#item1821').fill(data.item1821);

        // Section 2
        await this.page.locator('#item2131').selectOption(data.item2131);
        await this.page.locator('#item10301').selectOption(data.item10301);
        await this.page.locator('#item241').fill(data.item241);
        await this.page.locator('#item341').fill(data.item341);
        await this.page.locator('#item441').fill(data.item441);
        await this.page.locator('#item741').fill(data.item741);
        await this.page.locator('#item831').fill(data.item831);
        await this.page.locator('#item931').fill(data.commonText);
        await this.page.locator('select#item1231').selectOption(data.item1231option);
        await this.page.locator('#item10030101').selectOption(data.item10030101);
        await this.page.locator('#item1131').fill(data.item1131);
        await this.page.locator('input#item1231').fill(data.item1231);
        await this.page.locator('#item1331').fill(data.item1331);
        await this.page.locator('#item1531').fill(data.item1531);
        await this.page.locator('#item1631').fill(data.item1631);
        await this.page.locator('#item1731').fill(data.commonText);
        await this.page.locator('#item1831').fill(data.item1831);

        await this.clickNext('CT Phantom Adult Head');
    }
}