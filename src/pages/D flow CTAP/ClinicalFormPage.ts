import { BasePage } from './BasePage';

export class ClinicalFormPage extends BasePage {
    async fillClinicalData(data: any, nextTarget: string) {
        await this.page.getByRole('textbox', { name: 'mm/dd/yyyy' }).click();
        await this.page.getByRole('link', { name: '1', exact: true }).click();
        await this.page.locator('#item239').fill(data.commonText);
        await this.page.locator('#item240').fill(data.item240);
        await this.page.locator('#item242').fill(data.item242);
        await this.page.locator('#child132').fill(data.child132);
        await this.page.locator('#item243').fill(data.item243);
        await this.page.getByRole('radio', { name: 'No' }).check();
        await this.page.locator('#item263').selectOption({ label: '1' });
        
        // Scan Parameters
        await this.page.getByRole('row', { name: 'kVIf dose modulation' }).getByPlaceholder('000').fill(data.kv);
        await this.page.getByRole('row', { name: 'mAIf dose modulation' }).getByPlaceholder('000').fill(data.ma);
        await this.page.getByRole('row', { name: 'Time per rotation' }).getByPlaceholder('00.00').fill(data.time);
        await this.page.getByRole('row', { name: 'Effective mAs' }).getByPlaceholder('000.0').fill(data.mas);
        await this.page.locator('#item721').fill(data.item721);
        await this.page.getByRole('row', { name: 'Display FOV' }).getByPlaceholder('00.00').fill(data.fov);
        await this.page.locator('#item921').fill(data.commonText);
        await this.page.getByRole('radio', { name: 'Axial' }).check();
        
        // Reconstruction
        await this.page.getByRole('row', { name: '# Data Channels' }).getByPlaceholder('000').fill(data.channels);
        await this.page.getByRole('textbox', { name: '000.000', exact: true }).fill(data.thick);
        await this.page.getByRole('row', { name: 'Table Increment' }).getByPlaceholder('000.00').fill(data.increment);
        await this.page.getByRole('row', { name: 'Reconstructed Image Width' }).getByPlaceholder('00.000').fill(data.width);
        await this.page.getByRole('row', { name: 'Reconstructed Image Interval' }).getByPlaceholder('00.000').fill(data.interval);
        
        // Dose
        await this.page.locator('#item1721').fill(data.commonText);
        await this.page.getByRole('row', { name: 'CTDIvol' }).getByPlaceholder('000.00').fill(data.ctdivol);
        await this.page.getByRole('textbox', { name: '00000.0000' }).fill(data.dlp);
        await this.page.getByRole('textbox', { name: '0', exact: true }).fill(data.events);
        await this.page.getByRole('row', { name: 'Dose Notification Value' }).getByPlaceholder('000.0').fill(data.doseVal);
        
        await this.clickNext(nextTarget);
    }
}