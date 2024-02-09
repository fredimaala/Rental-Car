
function price(pickupDate, dropoffDate, type, driversAge, licenceAge) {
    const clazz = getClazz(type);
    const days = get_days(pickupDate, dropoffDate);
    const season = getSeason(pickupDate, dropoffDate);

    if (driversAge < 18) {
        return "Driver too young - cannot quote the price";
    }

    if (licenceAge < 1) {
        return "Individuals holding a driver's license for less than a year are ineligible to rent";
    }

    
    if (driversAge <= 21 && clazz !== "Compact") {
        return "Drivers 21 y/o or less can only rent Compact vehicles";
    }

    let rentalprice = driversAge * days;

    if (licenceAge < 2) {
        rentalprice *=1.3;
    }

    if (licenceAge < 3 && season === "High") {
        rentalprice += 15 * days;
    }

    if (clazz === "Racer" && driversAge <= 25 && season === "High") {
        rentalprice *= 1.5;
    }

    if (season === "High") {
        rentalprice *= 1.15;
    }

    if (days > 10 && season === "Low") {
        rentalprice *= 0.9;
    }
    return '$' + rentalprice.toFixed(2);
}

function getClazz(type) {
    switch (type) {
        case "Compact":
            return "Compact";
        case "Electric":
            return "Electric";
        case "Cabrio":
            return "Cabrio";
        case "Racer":
            return "Racer";
        default:
            return "Unknown";
    }
}

function get_days(pickupDate, dropoffDate) {
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

exports.price = price;