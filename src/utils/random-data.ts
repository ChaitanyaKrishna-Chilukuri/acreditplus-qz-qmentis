export class RandomData {
    static timestamp(): string {
        return new Date()
            .toISOString()
            .replace(/[-:.TZ]/g, '')
            .slice(0, 14);
    }

    static generateFacilityName(): string {
        return `Facility_${this.timestamp()}`;
    }

    static randomStreet(): string {
        return `Street_${Math.floor(Math.random() * 900 + 100)}`;
    }

    static randomCity(): string {
        return `City_${Math.floor(Math.random() * 900 + 100)}`;
    }

    static randomStateOption(): string {
        const states = ['1', '2', '3', '4', '5', '6', '7', '8']; // update with real option values
        return states[Math.floor(Math.random() * states.length)];
    }

    static randomZipCode(): string {
        const five = Math.floor(10000 + Math.random() * 90000); // 5 digits
        const four = Math.floor(1000 + Math.random() * 9000);   // 4 digits
        return `${five}-${four}`;
    }

}
