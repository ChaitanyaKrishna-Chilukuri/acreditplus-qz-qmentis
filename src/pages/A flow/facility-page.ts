import { Locator, Page, expect } from '@playwright/test';
import { RandomData } from '@utils/random-data';

export class FacilityPage {
    readonly page: Page;
    readonly facilityLink: Locator;
    readonly facilityTypeRadio: Locator;
    readonly noneOfTheAboveRadio: Locator;
    readonly nextButton: Locator;
    
    readonly facilityNameInput: Locator;
    readonly streetAddressInput: Locator;
    readonly cityInput: Locator;
    readonly stateDropdown: Locator;
    readonly zipInput: Locator;
    readonly sameAsLocationCheckbox: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Locator for Facility link
        this.facilityLink = page.getByRole('link', { name: 'Facility', exact: true });
    
        // Locator for the Facility Type radio button
        this.facilityTypeRadio = page.getByRole('radio', { name: 'Please define which' });

        // Locators
        this.noneOfTheAboveRadio = page.getByRole('radio', { name: 'None of the above:' });
        this.nextButton = page.getByRole('button', { name: 'Next' });

        this.facilityNameInput = page.getByLabel('Facility Name');
        this.streetAddressInput = page.locator("//input[contains(@id,'LocationAddressViewModel_StreetAddress1')]");
        this.cityInput = page.getByLabel('City/Town').nth(0);
        this.stateDropdown = page.getByLabel('State/Province').nth(0);
        this.zipInput = page.getByLabel('Zip').nth(0);
        this.sameAsLocationCheckbox = page.getByRole('checkbox', { name: 'Check if same as location' });
        this.nextButton = page.locator('//input[contains(@name,"next")]');  
    }

    async openFacilityPage() {
        await this.page.waitForTimeout(15000);
        // Wait until the Facility link is visible and clickable
        await this.facilityLink.waitFor({ state: 'visible', timeout : 20000 });
        await this.facilityLink.click();
    }

    async selectFacilityType() {
        
        // Wait until the radio button is visible and enabled
        await this.facilityTypeRadio.waitFor({ state: 'visible', timeout : 20000  });
        await this.facilityTypeRadio.check();
    }

    async fillFacilityInfo() {
        // Fill facility name
        await this.facilityNameInput.fill(RandomData.generateFacilityName());

        // Fill street address
        await this.streetAddressInput.fill(RandomData.randomStreet());

        // Fill city
        await this.cityInput.fill(RandomData.randomCity());

        // Select state
        const state = RandomData.randomStateOption();
        await this.stateDropdown.selectOption(state);

        // Fill zip code
        await this.zipInput.fill(RandomData.randomZipCode());

        // Handle checkbox
        await this.sameAsLocationCheckbox.click();
        await this.page.evaluate(() => {
        const checkbox = document.getElementById('IsMailingAddressSameAsLocationAddress') as HTMLInputElement;
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
        });
        await expect(this.page.locator('#IsMailingAddressSameAsLocationAddress')).toBeChecked();

        // Wait for network idle before proceeding
        await this.page.waitForLoadState('networkidle');

        // Click Next
        await this.nextButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.nextButton.click({ force: true });
    }

    async selectOwnershipNone() {
        // Wait until radio is visible and check it
        await this.noneOfTheAboveRadio.waitFor({ state: 'visible' });
        await this.noneOfTheAboveRadio.check();

        // Wait until Next button is enabled and click
        await this.nextButton.waitFor({ state: 'visible' });
        await this.nextButton.click();
  }
}
