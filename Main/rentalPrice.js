function price(pickupDate, dropoffDate, type, driversAge, licenceAge) {
    const totalDays = getDays(pickupDate, dropoffDate);
    const season = getSeason(pickupDate, dropoffDate);

    if (isDriverTooYoung(driversAge)) {
        return "Driver too young - cannot quote the price";
    }

    if (isIneligibleLicense(licenceAge)) {
        return "Individuals holding a driver's license for less than a year are ineligible to rent";
    }

    if (isUnderageAndNotCompact(driversAge, type)) {
        return "Drivers 21 y/o or less can only rent Compact vehicles";
    }

    let rentalprice = calculateBasePrice(driversAge, totalDays);

    rentalprice = applyLicenseAgeSurcharge(licenceAge, rentalprice);
    rentalprice = applyHighSeasonSurcharge(licenceAge, season, totalDays, rentalprice);
    rentalprice = applyRacerSurcharge(type, driversAge, season, rentalprice);
    rentalprice = applyHighSeasonMultiplier(season, rentalprice);
    rentalprice = applyLowSeasonDiscount(totalDays, season, rentalprice);

    return '$' + rentalprice.toFixed(2);
}

function getDays(pickupDate, dropoffDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(pickupDate);
    const secondDate = new Date(dropoffDate);

    return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
}

function getSeason(pickupDate, dropoffDate) {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    const start = 3;
    const end = 9;

    const pickupMonth = pickup.getMonth();
    const dropoffMonth = dropoff.getMonth();

    if (
        (pickupMonth >= start && pickupMonth <= end) ||
        (dropoffMonth >= start && dropoffMonth <= end) ||
        (pickupMonth < start && dropoffMonth > end)
    ) {
        return "High";
    } else {
        return "Low";
    }
}

function isDriverTooYoung(driversAge) {
    return driversAge < 18;
}

function isIneligibleLicense(licenceAge) {
    return licenceAge < 1;
}

function isUnderageAndNotCompact(driversAge, type) {
    return driversAge <= 21 && type !== "Compact";
}

function calculateBasePrice(driversAge, days) {
    return driversAge * days;
}

function applyLicenseAgeSurcharge(licenceAge, rentalprice) {
    return licenceAge < 2 ? rentalprice * 1.3 : rentalprice;
}

function applyHighSeasonSurcharge(licenceAge, season, days, rentalprice) {
    return licenceAge < 3 && season === "High" ? rentalprice + 15 * days : rentalprice;
}

function applyRacerSurcharge(type, driversAge, season, rentalprice) {
    return type === "Racer" && driversAge <= 25 && season === "High" ? rentalprice * 1.5 : rentalprice;
}

function applyHighSeasonMultiplier(season, rentalprice) {
    return season === "High" ? rentalprice * 1.15 : rentalprice;
}

function applyLowSeasonDiscount(days, season, rentalprice) {
    return days > 10 && season === "Low" ? rentalprice * 0.9 : rentalprice;
}

exports.price = price;
exports.getSeason = getSeason;
exports.applyLicenseAgeSurcharge = applyLicenseAgeSurcharge;