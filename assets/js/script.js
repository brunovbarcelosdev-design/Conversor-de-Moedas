// Selecionar elementos do DOM
const convertButton = document.querySelector("#convertButton");
const selectOrigem = document.querySelector("#moedaOrigem");
const selectDestino = document.querySelector("#moedaDestino");
const inputValor = document.querySelector("#valor");
const valorOriginal = document.querySelector("#valorOriginal");
const valorConvertido = document.querySelector("#valorConvertido");
const bandeiraOrigem = document.querySelector("#bandeiraorigem");
const bandeiraDestino = document.querySelector("#bandeiradestino");
const nomeOrigem = document.querySelector("#nomeOrigem");
const nomeDestino = document.querySelector("#nomeDestino");
const labelUltimaAtualizacao = document.querySelector("#ultimaAtualizacao");
const invertButton = document.querySelector(".invert-button");
const shortcutItems = document.querySelectorAll(".shortcut-item");

// Cotações padrão caso a API esteja offline
let quotes = {
  BRL: 1.0,
  USD: 5.25,
  EUR: 6.10,
  GBP: 7.20,
  BTC: 370000.0
};

// Bandeiras associadas a moedas
const images = {
  BRL: "./assets/img/real.png",
  USD: "./assets/img/dolar.png",
  EUR: "./assets/img/euro.png",
  GBP: "./assets/img/libra.png",
  BTC: "./assets/img/bitcoin.png"
};

// Nomes de exibição das moedas
const currencyNames = {
  BRL: "Real Brasileiro",
  USD: "Dólar Americano",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  BTC: "Bitcoin"
};

// Configurações de formatação de moeda
const currencyFormats = {
  BRL: { locale: "pt-BR", options: { style: "currency", currency: "BRL" } },
  USD: { locale: "en-US", options: { style: "currency", currency: "USD" } },
  EUR: { locale: "de-DE", options: { style: "currency", currency: "EUR" } },
  GBP: { locale: "en-GB", options: { style: "currency", currency: "GBP" } }
};

// Função para obter cotações em tempo real
async function fetchQuotes() {
  try {
    const response = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL");
    if (!response.ok) throw new Error("Erro ao buscar cotações");
    
    const data = await response.json();
    
    // Atualize nosso objeto de cotações com dados da API.
    quotes.USD = parseFloat(data.USDBRL.bid);
    quotes.EUR = parseFloat(data.EURBRL.bid);
    quotes.GBP = parseFloat(data.GBPBRL.bid);
    quotes.BTC = parseFloat(data.BTCBRL.bid) * 1000; // As taxas de BTC da AwesomeAPI geralmente são retornadas normalizadas.

    // Atualizar tabela de cotações e variação na UI
    updateTable(data);
    
    // Atualizar carimbo de data/hora
    const now = new Date();
    const formattedDate = now.toLocaleDateString("pt-BR") + " " + now.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
    labelUltimaAtualizacao.innerHTML = `Taxa de atualização em: ${formattedDate}`;
  } catch (error) {
    console.error("Usando cotações locais (offline):", error);
    labelUltimaAtualizacao.innerHTML = "Taxa de atualização em: Cotações locais (offline)";
  }
}

// Função para atualizar a tabela de taxas de câmbio dinamicamente      
function updateTable(data) {
  const tableRows = document.querySelectorAll(".tabela-cotacoes tbody tr");
  
  if (tableRows.length >= 4) {
    const updateRow = (row, key, name, symbol) => {
      const bid = parseFloat(data[key].bid);
      const pctChange = parseFloat(data[key].pctChange);
      
      const formattedBid = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(bid);
      
      const variationCell = row.cells[2];
      const sign = pctChange >= 0 ? "+" : "";
      
      row.cells[1].innerHTML = formattedBid;
      variationCell.innerHTML = `${sign}${pctChange.toFixed(2)}%`;
      
      // Atualizar classe de estilo para variação positiva ou negativa
      if (pctChange >= 0) {
        variationCell.className = "variacao positiva";
      } else {
        variationCell.className = "variacao negativa";
      }
    };

    updateRow(tableRows[0], "USDBRL", "Dólar Americano", "USD");
    updateRow(tableRows[1], "EURBRL", "Euro", "EUR");
    updateRow(tableRows[2], "GBPBRL", "Libra Esterlina", "GBP");
    
    // Formatação especial para Bitcoin em tabela
    const btcBid = parseFloat(data.BTCBRL.bid) * 1000;
    const btcPct = parseFloat(data.BTCBRL.pctChange);
    const formattedBtcBid = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(btcBid);
    const btcVarCell = tableRows[3].cells[2];
    
    tableRows[3].cells[1].innerHTML = formattedBtcBid;
    btcVarCell.innerHTML = `${btcPct >= 0 ? "+" : ""}${btcPct.toFixed(2)}%`;
    btcVarCell.className = btcPct >= 0 ? "variacao positiva" : "variacao negativa";
  }
}

// Função para formatar valores corretamente com base na moeda
function formatValue(value, currency) {
  if (currency === "BTC") {
    return `₿ ${value.toFixed(8)}`;
  }
  const config = currencyFormats[currency];
  return new Intl.NumberFormat(config.locale, config.options).format(value);
}

// Lógica de conversão principal
function convertValue() {
  const amount = parseFloat(inputValor.value);
  
  if (isNaN(amount) || amount <= 0) {
    valorOriginal.innerHTML = formatValue(0, selectOrigem.value);
    valorConvertido.innerHTML = formatValue(0, selectDestino.value);
    return;
  }

  const from = selectOrigem.value;
  const to = selectDestino.value;

  // Convert to base currency (BRL) first
  let amountInBRL;
  if (from === "BRL") {
    amountInBRL = amount;
  } else {
    amountInBRL = amount * quotes[from];
  }

  // Converter de BRL para a moeda de destino
  let convertedAmount;
  if (to === "BRL") {
    convertedAmount = amountInBRL;
  } else {
    convertedAmount = amountInBRL / quotes[to];
  }

  // Renderizar valores
  valorOriginal.innerHTML = formatValue(amount, from);
  valorConvertido.innerHTML = formatValue(convertedAmount, to);
}

// Atualizar layout, bandeiras, texto e acionar conversão
function updateCurrencyDetails() {
  const from = selectOrigem.value;
  const to = selectDestino.value;

  // Atualizar sinalizadores
  if (bandeiraOrigem) bandeiraOrigem.src = images[from];
  if (bandeiraDestino) bandeiraDestino.src = images[to];

  // Atualizar nomes
  if (nomeOrigem) nomeOrigem.innerHTML = currencyNames[from];
  if (nomeDestino) nomeDestino.innerHTML = currencyNames[to];

  // Perform conversion
  convertValue();
}

// Função para inverter/trocar moedas'
function swapCurrencies() {
  const temp = selectOrigem.value;
  selectOrigem.value = selectDestino.value;
  selectDestino.value = temp;
  
  updateCurrencyDetails();
}

// Gatilhos de atalho
function applyShortcut(event) {
  const item = event.currentTarget;
  const from = item.dataset.origem || "BRL";
  const to = item.dataset.destino;
  
  selectOrigem.value = from;
  selectDestino.value = to;
  
  updateCurrencyDetails();
}

// Ouvintes de eventos
convertButton.addEventListener("click", convertValue);
selectOrigem.addEventListener("change", updateCurrencyDetails);
selectDestino.addEventListener("change", updateCurrencyDetails);
inputValor.addEventListener("input", convertValue); // Recalculate as user types!
invertButton.addEventListener("click", swapCurrencies);

shortcutItems.forEach(item => {
  item.addEventListener("click", applyShortcut);
});

// Execute a configuração no carregamento da página
window.addEventListener("DOMContentLoaded", () => {
  fetchQuotes();
  updateCurrencyDetails();
});
