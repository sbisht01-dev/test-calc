function durYear(first, last) {
    return (Math.abs(last.getTime() - first.getTime()) / (1000 * 3600 * 24 * 365));
}
function sumEq(cfs, durs, guess) {
    var sum_fx = 0;
    var sum_fdx = 0;
    for (var i = 0; i < cfs.length; i++) {
        sum_fx = sum_fx + (cfs[i] / Math.pow(1 + guess, durs[i]));
    }
    for (i = 0; i < cfs.length; i++) {
        sum_fdx = sum_fdx + (-cfs[i] * durs[i] * Math.pow(1 + guess, -1 - durs[i]));
    }
    return sum_fx / sum_fdx;
}

function XIRR(cfs, dts, guess) {
    if (cfs.length != dts.length) throw new Error('Number of cash flows and dates should match');
    var positive, negative;
    Array.prototype.slice.call(cfs).forEach(function (value) {
        if (value > 0) positive = true;
        if (value < 0) negative = true;
    });

    if (!positive || !negative) throw new Error('XIRR requires at least one positive value and one negative value');


    guess = !guess ? guess : 0;

    var limit = 100; //loop limit
    var guess_last;
    var durs = [];

    durs.push(0);
    for (var i = 1; i < dts.length; i++) {
        durs.push(durYear(dts[0], dts[i]));
    }

    do {
        guess_last = guess;
        guess = guess_last - sumEq(cfs, durs, guess_last);
        limit--;

    } while (guess_last.toFixed(5) != guess.toFixed(5) && limit > 0);

    var xirr = guess_last.toFixed(5) != guess.toFixed(5) ? null : guess * 100;

    return Math.round(xirr * 100) / 100;
}

let cashFlow = [-101.504,
    2.225, 2.225, 2.225,
    2.225, 2.225, 2.225, 2.225,
    2.225, 2.225, 2.225, 2.225,
    2.225, 2.225, 2.225, 2.225,
    2.225, 2.225, 2.225, 2.225,
    27.24076712, 26.68057534, 26.10820548, 25.5480137,
];

let dates = [new Date(2024, 6, 31), new Date(2024, 8, 13), new Date(2024, 12, 13),
new Date(2025, 2, 13), new Date(2025, 5, 13), new Date(2025, 8, 13), new Date(2025, 11, 13),
new Date(2026, 2, 13), new Date(2026, 5, 13), new Date(2026, 8, 13), new Date(2026, 11, 13),
new Date(2027, 2, 13), new Date(2027, 5, 13), new Date(2027, 8, 13), new Date(2027, 11, 13),
new Date(2028, 2, 13), new Date(2028, 5, 13), new Date(2028, 8, 13), new Date(2028, 11, 13),
new Date(2029, 2, 13), new Date(2029, 5, 13), new Date(2029, 8, 13), new Date(2029, 11, 13),
new Date(2030, 2, 13)
];
let currentDate = new Date(2024, 1, 14);
let interestDate = 13;
let interestMonth = 0;
let nextInterestPaymentDate;
let monthAdder;
let interestType = "q";

function dateDifference() {
    let date1 = dates[2];
    let date2 = dates[3];
    let timeDiff = Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 24 * 60);
    console.log(timeDiff);
}
function nextInterestDateQuaterly(interestMonth, interestDate, monthAdder) {
    console.log("q");
    if (currentDate > new Date(currentDate.getFullYear(), 11, interestDate) || currentDate < new Date(currentDate.getFullYear(), 2, interestDate)) {
    
        // ****************************************************************************************************************************after dec and before march
        nextInterestPaymentDate = new Date(currentDate.getFullYear() + 1, 2, interestDate);
        return nextInterestPaymentDate;

    } else if (currentDate > new Date(currentDate.getFullYear(), 8, interestDate) && currentDate < new Date(currentDate.getFullYear(), 11, interestDate)) {

        // ****************************************************************************************************************************after sep and before dec
        nextInterestPaymentDate = new Date(currentDate.getFullYear(), 11, interestDate);
        return nextInterestPaymentDate;

    } else if (currentDate > new Date(currentDate.getFullYear(), 5, interestDate) && currentDate < new Date(currentDate.getFullYear(), 8, interestDate)) {

        // ****************************************************************************************************************************after june and before sep
        nextInterestPaymentDate = new Date(currentDate.getFullYear(), 8, interestDate);
        return nextInterestPaymentDate;

    } else if (currentDate > new Date(currentDate.getFullYear(), 2, interestDate) && currentDate < new Date(currentDate.getFullYear(), 5, interestDate)) {

        // ****************************************************************************************************************************after  march and before  june
        nextInterestPaymentDate = new Date(currentDate.getFullYear(), 5, interestDate);
        return nextInterestPaymentDate;
        
    }
}

function createList(array, divName, parentDiv) {
    let attachTo = document.getElementById(parentDiv);
    array.forEach(el => {
        let newDiv = document.createElement("div");
        newDiv.textContent = `${el}`;
        newDiv.classList.add(`${divName}`);
        attachTo.appendChild(newDiv);
    });
}

dateDifference();
if (interestType == "q") {
    //quaterly
    let nextDateOfInterest = nextInterestDateQuaterly(interestDate);
    console.log(nextDateOfInterest);
} else if (interestType == "a") {
    // anually
} else if (interestType == "m") {
    //monthly
} else if (interestType == "h") {
    //half yearly
}

createList(cashFlow, "rate", "cashflows");
createList(dates, "date", "dates");
let cal = XIRR(cashFlow,
    dates, 0.01);

let yield = document.getElementById('xirr');
yield.innerText = `${cal}`;