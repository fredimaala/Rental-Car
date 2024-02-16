const { price } = require('../Main/rentalPrice');
const { getSeason } = require('../Main/rentalPrice');
const { applyLicenseAgeSurcharge } = require('../Main/rentalPrice');

describe('Rental Price Calculation', () => {
    test('should calculate rental price correctly for a standard case', () => {
        const result = price('2024-02-16', '2024-02-20', 'Compact', 25, 3);
        expect(result).toBe('$125.00');
    });

    test('should handle underage driver and non-compact car', () => {
        const result = price('2024-02-16', '2024-02-20', 'Electric', 20, 2);
        expect(result).toBe("Drivers 21 y/o or less can only rent Compact vehicles");
    });

    test('should handle ineligible license', () => {
        const result = price('2024-02-16', '2024-02-20', 'Compact', 30, 0.5);
        expect(result).toBe("Individuals holding a driver's license for less than a year are ineligible to rent");
    });

    test('should handle high season surcharge correctly for a Racer', () => {
        const result = price('2024-08-01', '2024-08-01', 'Racer', 24, 3);
        expect(result).toBe('$41.40');
    });

    test('should handle low season discount correctly for more than 10 days', () => {
        const result = price('2024-03-01', '2024-03-15', 'Compact', 20, 3);
        expect(result).toBe('$270.00');
    });

    test('should handle driver too young', () => {
        const result = price('2024-02-16', '2024-02-20', 'Compact', 16, 2);
        expect(result).toBe("Driver too young - cannot quote the price");
    });

    test('should handle high season surcharge correctly for a non-Racer', () => {
        const result = price('2024-08-01', '2024-08-10', 'Electric', 30, 2);
        expect(result).toBe('$517.50');
    });

    test('should handle no surcharge for a Compact in low season', () => {
        const result = price('2024-03-01', '2024-03-01', 'Compact', 25, 3);
        expect(result).toBe('$25.00');
    });

    test('should handle no surcharge for a driver with more than 2 years of license', () => {
        const result = price('2024-02-01', '2024-02-01', 'Cabrio', 25, 3);
        expect(result).toBe('$25.00');
    });

    test('should handle no surcharge for a non-high season non-Racer', () => {
        const result = price('2024-02-16', '2024-02-20', 'Electric', 30, 3);
        expect(result).toBe('$150.00');
    });

    test('should handle no discount for less than 10 days in low season', () => {
        const result = price('2024-03-01', '2024-03-05', 'Racer', 30, 5);
        expect(result).toBe('$150.00');
    });
});

describe('getSeason Function', () => {
    test('should return "High" when pickupMonth is within the high season range', () => {
        
        const result = getSeason('2024-03-01', '2024-09-15');
        expect(result).toBe('High');
    });

    test('should return "Low" when pickupMonth is outside the high season range', () => {
        const result = getSeason('2024-11-01', '2025-02-15');
        expect(result).toBe('Low');
    });
});

describe('applyLicenseAgeSurcharge Function', () => {
    test('should apply surcharge when licenceAge is less than 2', () => {
        const result = applyLicenseAgeSurcharge(1, 100);
        expect(result).toBe(130); 
    });

    test('should not apply surcharge when licenceAge is 2 or greater', () => {
        const result = applyLicenseAgeSurcharge(2, 100);
        expect(result).toBe(100); 
    });
});
