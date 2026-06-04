//================= Card do Conversor Principal =================//

const convertButton = document.querySelector("#convertButton");
const currencySelect2 = document.querySelector("#moedaDestino");


function convertvalue() { 
    
    const currencyValueConvert = document. querySelector("#valorOriginal");
    const currencyValueConverted = document.querySelector("#valorConvertido");
    const inputNumberValue = document.querySelector("#valor").value;

    const quotes = {
    "USD": 5.04,
    "EUR": 5.86,
    "GBP": 6.79,
    "BTC": 357765.20
    }

    const coin = currencySelect2.value;
    const price = quotes[coin];
    const result = inputNumberValue / price;

    currencyValueConverted.innerHTML = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: coin
    }).format(result);
    
    currencyValueConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(inputNumberValue );

    if (currencySelect2.value === "BTC") {
    currencyValueConverted.innerHTML =
        (inputNumberValue / quotes.BTC).toFixed(8) + " BTC";
    }
}
convertButton.addEventListener('click', convertvalue);


const shortcutItems = document.querySelectorAll('.shortcut-item');

function replacement (event) {
    const buttonClicked = event.currentTarget;
    const destino = buttonClicked.dataset.destino;
    currencySelect2.value = destino;
    convertvalue();
}
shortcutItems.forEach(item => {
    item.addEventListener("click", replacement);
});
    function changeCurrency () {
        const currencyName = document.getElementById("nomeDestino");
        const currencyImage = document.getElementById("bandeiradestino");
        const images = {
            "USD": "./assets/img/dolar.png",
            "EUR": "./assets/img/euro.png",
            "GBP": "./assets/img/libra.png",
            "BTC": "./assets/img/bitcoin.png"
        }
        currencyImage.src = images[currencySelect2.value];
        const namesCoin = {
            "USD": "Dólar Americano",
            "EUR": "Euro",
            "GBP": "Libra Esterlina",
            "BTC": "Bitcoin"
        }
        currencyName.innerHTML = namesCoin[currencySelect2.value];
        convertvalue()

    }
currencySelect2.addEventListener("change", changeCurrency);

