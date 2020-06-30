const firstCurrencySelectElement = document.querySelector(".js-firstCurrencySelect");
const secondCurrencySelectElement = document.querySelector(".js-secondCurrencySelect");
const firstCurrencyValueInputElement = document.querySelector(".js-firstCurrencyValueInputElement");
const secondCurrencyValueInputElement = document.querySelector(".js-secondCurrencyValueInputElement");
const calculateButtonElement = document.querySelector(".js-calculateButton");
const exchangeDetailsMessageElement = document.querySelector(".js-message");

const getExchangeData = async (basedCurrency, exchangedCurrency) => {
    const exchangeDataResponse = await fetch(`https://api.exchangeratesapi.io/latest?base=${basedCurrency}`);
    const exchangeData = await exchangeDataResponse.json();
    //handle API EUR-EUR error
    if (basedCurrency === "EUR" && exchangedCurrency === "EUR") {
        return {
            exchangeRate: 1,
            exchangeDate: exchangeData.date
        }
    } else {
        return {
            exchangeRate: exchangeData.rates[exchangedCurrency],
            exchangeDate: exchangeData.date
        }
    }
};

const handleNegativeValue = () => {
    firstCurrencyValueInputElement.value = "";
    secondCurrencyValueInputElement.value = "";
    exchangeDetailsMessageElement.textContent = "Negative value entered";
    exchangeDetailsMessageElement.classList.add("calculatorForm__Message--warning")
    exchangeDetailsMessageElement.classList.remove("calculatorForm__Message--info")
    setTimeout(() => {
        exchangeDetailsMessageElement.classList.remove("calculatorForm__Message--warning")
    }, 1500)
};

const updateFirstCurrencyValue = async () => {
    //Reset old message text//
    exchangeDetailsMessageElement.className = "calculatorForm__Message";
    try{
        const exchangeData = await getExchangeData(firstCurrencySelectElement.value, secondCurrencySelectElement.value);
        firstCurrencyValueInputElement.value = (secondCurrencyValueInputElement.value * exchangeData.exchangeRate).toFixed(2);
    }
    catch{
        console.log("Error")
    }
};

const updateSecondCurrencyValue = async () => {
    //Reset old message text//
    exchangeDetailsMessageElement.className = "calculatorForm__Message";
    try{
        const exchangeData = await getExchangeData(firstCurrencySelectElement.value, secondCurrencySelectElement.value);
        secondCurrencyValueInputElement.value = (firstCurrencyValueInputElement.value * exchangeData.exchangeRate).toFixed(2);
    }
    catch{
        console.log("Error")
    }
};

const showDetailsMessage = () => {
    exchangeDetailsMessageElement.classList.add("calculatorForm__Message--info");
    getExchangeData(firstCurrencySelectElement.value, secondCurrencySelectElement.value)
        .then(exchangeData => {
            exchangeDetailsMessageElement.textContent = `Your calculation is current for ${exchangeData.exchangeDate} and your exchange rate is ${exchangeData.exchangeRate.toFixed(2)}`;
        }).catch(err => console.log(err))
};

const handleCurrencyValueInputChange = (currencyValueInputElement, inputChangeCallback) => {
    if (currencyValueInputElement.value >= 0) {
        inputChangeCallback();
    } else if (currencyValueInputElement.value < 0) {
        handleNegativeValue();
    }
};

firstCurrencySelectElement.addEventListener("change", updateSecondCurrencyValue)

secondCurrencySelectElement.addEventListener("change", updateSecondCurrencyValue)

firstCurrencyValueInputElement.addEventListener("input", handleCurrencyValueInputChange.bind(null, firstCurrencyValueInputElement, updateSecondCurrencyValue))

secondCurrencyValueInputElement.addEventListener("input", handleCurrencyValueInputChange.bind(null, secondCurrencyValueInputElement, updateFirstCurrencyValue))

calculateButtonElement.addEventListener("click", showDetailsMessage)