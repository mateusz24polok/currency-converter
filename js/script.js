const firstCurrencySelectElement = document.querySelector(".js-firstCurrencySelect");
const secondCurrencySelectElement = document.querySelector(".js-secondCurrencySelect");
const firstCurrencyValueInputElement = document.querySelector(".js-firstCurrencyValueInputElement");
const secondCurrencyValueInputElement = document.querySelector(".js-secondCurrencyValueInputElement");
const calculateButtonElement = document.querySelector(".js-calculateButton");
const exchangeDetailsMessageElement = document.querySelector(".js-message");

const getExchangeData = async (basedCurrency, exchangedCurrency) => {
    const exchangeDataResponse = await fetch(`https://api.exchangeratesapi.io/latest?base=${basedCurrency}`);
    const exchangeData = await exchangeDataResponse.json();
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

const updateCurrencyValue = async (updatedCurrencyValueElement, basedCurrencyValueElement) => {
    exchangeDetailsMessageElement.className = "calculatorForm__Message";
    try {
        const exchangeData = await getExchangeData(firstCurrencySelectElement.value, secondCurrencySelectElement.value);
        if (updatedCurrencyValueElement.value === firstCurrencyValueInputElement.value) {
            firstCurrencyValueInputElement.value = (basedCurrencyValueElement.value * 1 / exchangeData.exchangeRate).toFixed(2);
        } else {
            secondCurrencyValueInputElement.value = (basedCurrencyValueElement.value * exchangeData.exchangeRate).toFixed(2);
        }
    }
    catch{
        console.log("Error")
    }
};

const showDetailsMessage = async () => {
    exchangeDetailsMessageElement.classList.add("calculatorForm__Message--info");
    try {
        const exchangeData = await getExchangeData(firstCurrencySelectElement.value, secondCurrencySelectElement.value);
        exchangeDetailsMessageElement.textContent = `Your calculation is current for ${exchangeData.exchangeDate} and your exchange rate is ${exchangeData.exchangeRate.toFixed(2)}`;
    }
    catch{
        console.log("Error")
    }
};

const handleCurrencyValueInputChange = (currencyValueInputElement, updatedCurrencyValueElement, basedCurrencyValueElement) => {
    if (currencyValueInputElement.value >= 0) {
        updateCurrencyValue(updatedCurrencyValueElement, basedCurrencyValueElement);
    } else if (currencyValueInputElement.value < 0) {
        handleNegativeValue();
    }
};

firstCurrencySelectElement.addEventListener("change", updateCurrencyValue.bind(null, secondCurrencyValueInputElement, firstCurrencyValueInputElement))

secondCurrencySelectElement.addEventListener("change", updateCurrencyValue.bind(null, secondCurrencyValueInputElement, firstCurrencyValueInputElement))

firstCurrencyValueInputElement.addEventListener("input", handleCurrencyValueInputChange.bind(null, firstCurrencyValueInputElement, secondCurrencyValueInputElement, firstCurrencyValueInputElement))

secondCurrencyValueInputElement.addEventListener("input", handleCurrencyValueInputChange.bind(null, secondCurrencyValueInputElement, firstCurrencyValueInputElement, secondCurrencyValueInputElement))

calculateButtonElement.addEventListener("click", showDetailsMessage)