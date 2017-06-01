const rp = require('request-promise');
console.log('Welcome to Crypto Pricer. Matching up latest prices.');

let baseURL = 'https://min-api.cryptocompare.com/data/price?';
const buyPriceTriggers = {
    USD: 205.00
};

let findPricing = (primaryCurrency, secondaryCurrencies, onCompletion) => {
    let requestURL = `${baseURL}fsym=${primaryCurrency}&tsyms=${secondaryCurrencies.join(',')}`;
    rp({
        method: 'GET',
        uri: requestURL,
        headers: {
            'content-type': 'application/json'
        },
        json: true
    }).then((response) => {
        let currenciesFound = [];        
        for(let currency of secondaryCurrencies)
        {
            if(response[currency] !== undefined)
            {
                currenciesFound.push(`${response[currency]} ${currency}`);
            }

            if(buyPriceTriggers[currency] !== undefined && buyPriceTriggers[currency] >= response[currency])
            {
                console.log(`[PURCHASE] ${primaryCurrency}/${currency} now! Buy price trigger - ${buyPriceTriggers[currency]}${currency}:1${primaryCurrency} hit!`);
            }
        }
        console.log(`${new Date().toISOString()} - ${currenciesFound.join(' | ')} for 1 ${primaryCurrency}`);

        onCompletion();
    }, (reject) => {
        console.log('Request failed: ', reject);
    }).catch((e) => {
        console.log(e);
    });
};


let main = () => {
    let nextRequest = () => {
        setTimeout(() => {
            findPricing('ETH', ['USD', 'BTC'], nextRequest);
        }, 5000);
    };

    nextRequest();
};

main();