import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class PatientOutcomeDataPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async fillPatientOutcomeData(data: any, exam: string) {
        // Selection & Dates
        if (data.physicianAndTechnologist) await this.page.getByRole('checkbox', { name: 'Physician and technologist' }).check();
        if (data.yesRadio) await this.page.getByRole('radio', { name: 'Yes' }).check();
        
        await this.page.getByPlaceholder('mm/dd/yyyy').nth(0).fill(data.startDate);
        await this.page.getByPlaceholder('mm/dd/yyyy').nth(1).fill(data.endDate);

        // Main Table Inputs
        const rows = [
            { name: '# of ultrasound-guided breast', value: data.ultrasoundGuidedBreast },
            { name: '# cancers found', value: data.cancersFound },
            { name: '# benign lesions', value: data.benignLesions },
            { name: '# biopsies needing repeat', value: data.biopsiesNeedingRepeat },
            { name: '# complications', value: data.complications }
        ];

        for (const row of rows) {
            const input = this.page.getByRole('row', { name: row.name }).getByTestId('ap-tid-table-item-text-input');
            await input.fill(row.value);
        }

        // Specific Item IDs
        await this.page.getByRole('row', { name: 'Insufficient sample' }).locator('#item1210').fill(data.insufficientSample.item1210);
        await this.page.getByRole('row', { name: 'Discordance with Imaging' }).locator('#item1320').fill(data.discordanceWithImaging.item1320);
        await this.page.getByRole('row', { name: 'Cellular atypia, radial scar' }).locator('#item1420').fill(data.cellularAtypiaRadialScar.item1420);
        
        await this.page.locator('#item1510').fill(data.item1510);
        await this.page.locator('#item1520').fill(data.item1520);
        
        await this.page.getByRole('row', { name: 'Insufficient sample' }).locator('#item1430').fill(data.insufficientSample.item1430);
        await this.page.getByRole('row', { name: 'Discordance with Imaging' }).locator('#item1330').fill(data.item1330);
        await this.page.getByRole('row', { name: 'Cellular atypia, radial scar' }).locator('#item1430').fill(data.cellularAtypiaRadialScar.item1430);
        await this.page.locator('#item1530').fill(data.item1530);

        // Complications
        if(exam === 'Biopsy') {
            await this.page.getByRole('row', { name: 'Hematomas (requiring' }).locator('#item1210').fill(data.hematomas);
            await this.page.getByRole('row', { name: 'Infection' }).locator('#item1320').fill(data.infection);
            await this.page.getByRole('row', { name: 'Pneumothorax' }).locator('#item1420').fill(data.pneumothorax);
        }else if(exam === 'FNAC') {
            await this.page.getByRole('row', { name: 'Hematomas (requiring' }).locator('#item1430').fill(data.hematomas);
            await this.page.getByRole('row', { name: 'Infection' }).locator('#item1330').fill(data.infection);
        }

        await this.page.getByRole('button', { name: 'Next: Breast Ultrasound Cyst' }).nth(1).click();
    }
}