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




// let cashFlow = [
//     -103.5421644,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     2.2225,
//     27.24076712,
//     26.68057534,
//     26.10820548,
//     25.5480137];
// let dates = [
//     new Date(2024,7,3), new Date(2024, 8, 13), new Date(2024, 11, 13), 
//     new Date(2025, 2, 13), new Date(2025, 5, 13), new Date(2025, 8, 13), new Date(2025, 11, 13),
//     new Date(2026, 2, 13), new Date(2026, 5, 13), new Date(2026, 8, 13), new Date(2026, 11, 13),
//     new Date(2027, 2, 13), new Date(2027, 5, 13), new Date(2027, 8, 13), new Date(2027, 11, 13),
//     new Date(2028, 2, 13), new Date(2028, 5, 13), new Date(2028, 8, 13), new Date(2028, 11, 13),
//     new Date(2029, 2, 13), new Date(2029, 5, 13), new Date(2029, 8, 13), new Date(2029, 11, 13),new Date(2030, 11, 13)];

let nextInterestPaymentDate;

function dateDifference(firstDate, secondDate) {
    let date1 = firstDate;
    let date2 = secondDate;
    let timeDiff = Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 24 * 60);
    return Math.floor(timeDiff);
}
function nextInterestDateQuaterly(interestDate, currentDate) {
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

function createListCF(array, divName, parentDiv) {
    let attachTo = document.getElementById(parentDiv);
    array.forEach(el => {
        let newDiv = document.createElement("div");
        newDiv.textContent = `${el}`;
        newDiv.classList.add(`${divName}`);
        attachTo.appendChild(newDiv);
    });
}

function createListDate(array, divName, parentDiv) {
    let attachTo = document.getElementById(parentDiv);
    array.forEach(el => {
        let newDiv = document.createElement("div");
        newDiv.textContent = `${el.getDate()}` +" -"+` ${el.getMonth()+1}` +" -"+` ${el.getFullYear()}`;
        newDiv.classList.add(`${divName}`);
        attachTo.appendChild(newDiv);
    });
}


function generateInterestPaymentDates(interestDate, maturityDate, currentDate) {
    let nextPaymentDate = nextInterestDateQuaterly(interestDate.getDate(), currentDate);
    let interestPaymentDates = [new Date(), nextInterestPaymentDate];
    while (nextPaymentDate <= maturityDate) {
        nextPaymentDate = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 3, nextPaymentDate.getDate());
        interestPaymentDates.push(new Date(nextPaymentDate));
    }
    return interestPaymentDates;
}
let inputPrice = document.getElementById('price');

let price = 102.3;
inputPrice.addEventListener('input', () => {
    price = inputPrice.value;
    console.log(price);
});

let inputCR = document.getElementById('couponrate');
let couponRate = 8.89;
inputCR.addEventListener('input', () => {
    couponRate = inputCR.value;
    console.log(couponRate);
    quarterlyFunction();
})
quarterlyFunction();
const frequencySelect = document.getElementById('frequency');

frequencySelect.addEventListener('change', () => {
    const selectedFrequency = frequencySelect.value;

    switch (selectedFrequency) {
        case 'quarterly':

            quarterlyFunction();
            break;
        case 'annually':
            annuallyFunction();
            break;
        case 'monthly':
            monthlyFunction();
            break;
        case 'halfyearly':
            halfyearlyFunction();
            break;
        default:
            console.error('Invalid frequency selected');
    }
});


function quarterlyFunction() {
    console.log('Quarterly selected');
    const interestDate = new Date(2024, 2, 13);
    const maturityDate = new Date(2030, 2, 13);
    const currentDate = new Date();
    let numberOfRedemptions = 4;
    let cashFlow = [];
    const interestPaymentDates = generateInterestPaymentDates(interestDate, maturityDate, currentDate);
    interestPaymentDates.splice(-1, 1);
    // console.log(interestPaymentDates);
    let lastInterestPaymentDate = new Date(interestPaymentDates[1].getFullYear(), interestPaymentDates[1].getMonth() - 3, interestPaymentDates[1].getDate())
    let dayDiff = dateDifference(new Date(), lastInterestPaymentDate);
    
    let accruedInterest = (100 * couponRate * dayDiff / 365) / 100;

    cashFlow[0] = (-price - accruedInterest);
    for (let i = 1; i < (interestPaymentDates.length - numberOfRedemptions); i++) {
        cashFlow[i] = couponRate / numberOfRedemptions;
       
    }
    let percentage = 100
    for (let i = interestPaymentDates.length - 4; i < (interestPaymentDates.length); i++) {
        cfDateDiff = dateDifference(interestPaymentDates[i], interestPaymentDates[i - 1]);
        cashFlow[i] = 25 + ((percentage / 100) * couponRate * (cfDateDiff) / 365);
        percentage = percentage - 25;
    }


    let ytm = XIRR(cashFlow, interestPaymentDates, 0.01);
    console.log(ytm);

    createListCF(cashFlow, "rate", "cashflows");
    createListDate(interestPaymentDates, "date", "dates");
 
    let yield = document.getElementById('xirr');
    yield.innerText = `${ytm}`;

}

function annuallyFunction() {
    console.log('Annually selected');
}

function monthlyFunction() {
    console.log('Monthly selected');
}

function halfyearlyFunction() {
    console.log('Half-yearly selected');
}