//DOM Elements declaration//

const firstCurrencySelectElement = document.querySelector(".js-firstCurrencySelect");
const secondCurrencySelectElement = document.querySelector(".js-secondCurrencySelect");
const firstCurrencyValueInputElement = document.querySelector(".js-firstCurrencyValueInputElement");
const secondCurrencyValueInputElement = document.querySelector(".js-secondCurrencyValueInputElement");
const calculateButtonElement = document.querySelector(".js-calculateButton");
const exchangeDetailsMessageElement = document.querySelector(".js-message");

//Async function witch returns rate value and data on the base of basedCurrency and exchangeCurrency frome extern currency convert API//

const getExchangeData = async (basedCurrency, exchangedCurrency) => {
    const exchangeDataPromise = await fetch(`https://api.exchangeratesapi.io/latest?base=${basedCurrency}`);
    const exchangeData = await exchangeDataPromise.json();
    //handle API EUR-EUR error
    if (basedCurrency === "EUR" && exchangedCurrency === "EUR") {
        return {
            exchangeRate: 1,
            exchagneDate: exchangeData.date
        }
    } else {
        return {
            exchangeRate: exchangeData.rates[`${exchangedCurrency}`],
            exchagneDate: exchangeData.date
        }
    }
}

//Function witch shows You alert message and reset input fields, when You put negative value of currency//

const handleNegativeValue = () => {
    firstCurrencyValueInputElement.value = "";
    secondCurrencyValueInputElement.value = "";
    exchangeDetailsMessageElement.textContent = "Negative value entered";
    exchangeDetailsMessageElement.classList.add("calculatorForm__Message--warning")
    exchangeDetailsMessageElement.classList.remove("calculatorForm__Message--info")
    setTimeout(() => {
        exchangeDetailsMessageElement.classList.remove("calculatorForm__Message--warning")
    }, 1500)
}

//Functions witch updates first or second currency value

const updateFirstCurrencyValue = () => {
    //Reset old message text//
    exchangeDetailsMessageElement.className = "calculatorForm__Message";
    getExchangeData(firstCurrencySelectElement.value, secondCurrencySelectElement.value)
        .then(exchangeData => {
            firstCurrencyValueInputElement.value = (secondCurrencyValueInputElement.value * exchangeData.exchangeRate).toFixed(2);
        }).catch(err => console.log(err))
}

const updateSecondCurrencyValue = () => {
    //Reset old message text//
    exchangeDetailsMessageElement.className = "calculatorForm__Message";
    getExchangeData(firstCurrencySelectElement.value, secondCurrencySelectElement.value)
        .then(exchangeData => {
            secondCurrencyValueInputElement.value = (firstCurrencyValueInputElement.value * exchangeData.exchangeRate).toFixed(2);
        }).catch(err => console.log(err))
}

//Function witch shows You details about exchange

const showDetailsMessage = () => {
    exchangeDetailsMessageElement.classList.add("calculatorForm__Message--info");
    getExchangeData(firstCurrencySelectElement.value, secondCurrencySelectElement.value)
        .then(exchangeData => {
            exchangeDetailsMessageElement.textContent = `Your calculation is current for ${exchangeData.exchagneDate} and your exchange rate is ${exchangeData.exchangeRate.toFixed(2)}`;
        }).catch(err => console.log(err))
}

//Function with shows You details about exchange

const handleCurrencyValueInputChange = (currencyValueInputElement) => {
    if (currencyValueInputElement.value >= 0) {
        updateSecondCurrencyValue();
    } else if (currencyValueInputElement.value < 0) {
        handleNegativeValue();
    }
}

//ADD EVENT LISTENERS//

firstCurrencySelectElement.addEventListener("change", updateSecondCurrencyValue)

secondCurrencySelectElement.addEventListener("change", updateSecondCurrencyValue)

firstCurrencyValueInputElement.addEventListener("input", handleCurrencyValueInputChange.bind(null, firstCurrencyValueInputElement))

secondCurrencyValueInputElement.addEventListener("input", handleCurrencyValueInputChange.bind(null, secondCurrencyValueInputElement))

calculateButtonElement.addEventListener("click", showDetailsMessage)