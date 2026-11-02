// ==========================================
// DATE SELECTORS
// ==========================================

const currentYear = new Date().getFullYear();

const yearOptions = [currentYear, currentYear + 1, currentYear + 2];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// Fill Year Selects
function fillYears() {

    const yearSelects = [
        document.getElementById("arrivalYear"),
        document.getElementById("departureYear")
    ];

    yearSelects.forEach(select => {

        yearOptions.forEach(year => {

            const option = document.createElement("option");

            option.value = year;
            option.textContent = year;

            select.appendChild(option);
        });

    });
}


// Fill Month Selects
function fillMonths() {

    const monthSelects = [
        document.getElementById("arrivalMonth"),
        document.getElementById("departureMonth")
    ];

    monthSelects.forEach(select => {

        months.forEach((month, index) => {

            const option = document.createElement("option");

            option.value = index + 1;
            option.textContent = month;

            select.appendChild(option);
        });

    });
}


// Fill Days
function fillDays(yearId, monthId, dayId) {

    const year = parseInt(document.getElementById(yearId).value);
    const month = parseInt(document.getElementById(monthId).value);

    const daySelect = document.getElementById(dayId);

    daySelect.innerHTML = '<option value="">Date</option>';

    if (!year || !month) {
        return;
    }

    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {

        const option = document.createElement("option");

        option.value = day;
        option.textContent = day;

        daySelect.appendChild(option);
    }
}


// ==========================================
// GET SELECTED DATE
// ==========================================

function getSelectedDate(prefix) {

    const year = parseInt(
        document.getElementById(prefix + "Year").value
    );

    const month = parseInt(
        document.getElementById(prefix + "Month").value
    );

    const day = parseInt(
        document.getElementById(prefix + "Day").value
    );

    if (!year || !month || !day) {
        return null;
    }

    return new Date(year, month - 1, day);
}


// ==========================================
// CALCULATE NUMBER OF DAYS
// ==========================================

function calculateDays() {

    const arrival = getSelectedDate("arrival");
    const departure = getSelectedDate("departure");

    if (!arrival || !departure) {
        document.getElementById("summaryDays").textContent = "0 Days";
        return 0;
    }

    const difference =
        departure.getTime() - arrival.getTime();

    const days =
        Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (days <= 0) {

        document.getElementById("summaryDays").textContent =
            "Invalid Dates";

        return 0;
    }

    document.getElementById("summaryDays").textContent =
        days + (days === 1 ? " Day" : " Days");

    return days;
}


// ==========================================
// CALCULATE TRIP PRICE
// ==========================================

function calculateTrip() {

    const days = calculateDays();

    if (days <= 0) {

        alert("Please select a valid arrival and departure date.");

        return;
    }


    // Travelers
    const adults =
        parseInt(document.getElementById("adults").value) || 0;

    const children =
        parseInt(document.getElementById("children").value) || 0;

    const travelers = adults + children;


    // Update travelers
    document.getElementById("summaryTravelers").textContent =
        travelers;


    // ======================================
    // DESTINATIONS
    // ======================================

    const destinations =
        document.querySelectorAll(".destination:checked");

    let destinationTotal = 0;

    let destinationList = "";

    destinations.forEach(destination => {

        destinationTotal +=
            parseFloat(destination.dataset.price);

        destinationList +=
            `<li>${destination.value}</li>`;
    });


    if (destinationList === "") {

        destinationList =
            "<li>No destinations selected</li>";
    }

    document.getElementById("summaryDestinations").innerHTML =
        destinationList;


    // ======================================
    // HOTEL
    // ======================================

    const hotel =
        document.querySelector('input[name="hotel"]:checked');

    const hotelPrice =
        hotel ? parseFloat(hotel.value) : 0;

    const hotelName =
        hotel ? hotel.dataset.name : "Not selected";

    document.getElementById("summaryHotel").textContent =
        hotelName;


    // ======================================
    // VEHICLE
    // ======================================

    const vehicle =
        document.querySelector('input[name="vehicle"]:checked');

    const vehiclePrice =
        vehicle ? parseFloat(vehicle.value) : 0;

    const vehicleName =
        vehicle ? vehicle.dataset.name : "Not selected";

    document.getElementById("summaryVehicle").textContent =
        vehicleName;


    // ======================================
    // ACTIVITIES
    // ======================================

    const activities =
        document.querySelectorAll(".activity:checked");

    let activityTotal = 0;

    let activityList = "";

    activities.forEach(activity => {

        activityTotal +=
            parseFloat(activity.dataset.price);

        activityList +=
            `<li>${activity.value}</li>`;
    });


    if (activityList === "") {

        activityList =
            "<li>No experiences selected</li>";
    }

    document.getElementById("summaryActivities").innerHTML =
        activityList;


    // ======================================
    // MEAL PLAN
    // ======================================

    const meal =
        document.querySelector('input[name="meal"]:checked');

    const mealPrice =
        meal ? parseFloat(meal.value) : 0;


    // ======================================
    // PRICE CALCULATION
    // ======================================

    /*
       Hotel:
       price × nights × rooms

       Vehicle:
       price × trip days

       Meal:
       price × travelers × trip days

       Destinations:
       destination price × travelers

       Activities:
       activity price × travelers
    */


    const hotelCost =
        hotelPrice * days;

    const vehicleCost =
        vehiclePrice * days;

    const mealCost =
        mealPrice * travelers * days;

    const destinationCost =
        destinationTotal * travelers;

    const activityCost =
        activityTotal * travelers;


    // FINAL TOTAL
    const total =
        hotelCost +
        vehicleCost +
        mealCost +
        destinationCost +
        activityCost;


    // Display total
    document.getElementById("totalPrice").textContent =
        total.toLocaleString();


    // Scroll to summary
    document.querySelector(".trip-summary").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==========================================
// AUTOMATIC PRICE UPDATE
// ==========================================

function autoCalculate() {

    const arrival = getSelectedDate("arrival");
    const departure = getSelectedDate("departure");

    if (arrival && departure) {

        const days = calculateDays();

        if (days > 0) {

            updatePriceOnly();
        }
    }
}


// ==========================================
// UPDATE PRICE WITHOUT ALERT
// ==========================================

function updatePriceOnly() {

    const arrival = getSelectedDate("arrival");
    const departure = getSelectedDate("departure");

    if (!arrival || !departure) {
        return;
    }

    const difference =
        departure.getTime() - arrival.getTime();

    const days =
        Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (days <= 0) {
        return;
    }


    const adults =
        parseInt(document.getElementById("adults").value) || 0;

    const children =
        parseInt(document.getElementById("children").value) || 0;

    const travelers =
        adults + children;


    // Destinations
    let destinationTotal = 0;

    document
        .querySelectorAll(".destination:checked")
        .forEach(item => {

            destinationTotal +=
                parseFloat(item.dataset.price);
        });


    // Hotel
    const hotel =
        document.querySelector('input[name="hotel"]:checked');

    const hotelPrice =
        hotel ? parseFloat(hotel.value) : 0;


    // Vehicle
    const vehicle =
        document.querySelector('input[name="vehicle"]:checked');

    const vehiclePrice =
        vehicle ? parseFloat(vehicle.value) : 0;


    // Activities
    let activityTotal = 0;

    document
        .querySelectorAll(".activity:checked")
        .forEach(item => {

            activityTotal +=
                parseFloat(item.dataset.price);
        });


    // Meal
    const meal =
        document.querySelector('input[name="meal"]:checked');

    const mealPrice =
        meal ? parseFloat(meal.value) : 0;


    // Calculate
    const hotelCost =
        hotelPrice * days;

    const vehicleCost =
        vehiclePrice * days;

    const destinationCost =
        destinationTotal * travelers;

    const activityCost =
        activityTotal * travelers;

    const mealCost =
        mealPrice * travelers * days;


    const total =
        hotelCost +
        vehicleCost +
        destinationCost +
        activityCost +
        mealCost;


    document.getElementById("totalPrice").textContent =
        total.toLocaleString();

    document.getElementById("summaryDays").textContent =
        days + (days === 1 ? " Day" : " Days");

    document.getElementById("summaryTravelers").textContent =
        travelers;
}


// ==========================================
// SCROLL TO TRIP
// ==========================================

function scrollToTrip() {

    document.getElementById("build-trip").scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// WHATSAPP
// ==========================================

function sendWhatsApp() {

    const total =
        document.getElementById("totalPrice").textContent;

    const days =
        document.getElementById("summaryDays").textContent;

    const travelers =
        document.getElementById("summaryTravelers").textContent;


    const message =
        `Hello Ceylon Journey,%0A%0A` +
        `I would like to request this Sri Lanka trip.%0A%0A` +
        `Duration: ${days}%0A` +
        `Travelers: ${travelers}%0A` +
        `Estimated Total: $${total}%0A%0A` +
        `Please contact me with more details.`;


    window.open(
        `https://wa.me/?text=${message}`,
        "_blank"
    );
}


// ==========================================
// INITIALIZE
// ==========================================

fillYears();
fillMonths();


// ==========================================
// DATE EVENTS
// ==========================================

document.getElementById("arrivalYear")
    .addEventListener("change", function() {

        fillDays(
            "arrivalYear",
            "arrivalMonth",
            "arrivalDay"
        );

        autoCalculate();
    });


document.getElementById("arrivalMonth")
    .addEventListener("change", function() {

        fillDays(
            "arrivalYear",
            "arrivalMonth",
            "arrivalDay"
        );

        autoCalculate();
    });


document.getElementById("arrivalDay")
    .addEventListener("change", autoCalculate);


document.getElementById("departureYear")
    .addEventListener("change", function() {

        fillDays(
            "departureYear",
            "departureMonth",
            "departureDay"
        );

        autoCalculate();
    });


document.getElementById("departureMonth")
    .addEventListener("change", function() {

        fillDays(
            "departureYear",
            "departureMonth",
            "departureDay"
        );

        autoCalculate();
    });


document.getElementById("departureDay")
    .addEventListener("change", autoCalculate);


// ==========================================
// OTHER INPUT EVENTS
// ==========================================

document
    .querySelectorAll(
        ".destination, .activity, input[name='hotel'], input[name='vehicle'], input[name='meal'], #adults, #children"
    )
    .forEach(input => {

        input.addEventListener("change", function() {

            updatePriceOnly();

        });

    });