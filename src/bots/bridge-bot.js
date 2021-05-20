import { networks, coinGeckoApi} from "../core";
import Bot from './bot';

class BridgeBot extends Bot {

    providersEmojis = {
        Rubic: '\ud83d\udfe2',
        Binance: '\ud83d\udfe0',
        Polygon: '\ud83d\udfe3',
        Tron: '\ud83d\udd34'
    }

    chatId = process.env.BRIDGE_CHAT_ID;

    constructor(bot) {
        super(bot);
    }

    async sendNotification(request) {
        const { track, walletAddress, amount, fromBlockchain, toBlockchain, symbol, price } = request;
        const fromNetwork = networks.find(nw => nw.name === fromBlockchain);
        const toNetwork = networks.find(nw => nw.name === toBlockchain);
        const scannerUrl = networks.find(nw => nw.name === fromBlockchain).scannerAddressBaseUrl + walletAddress;

        const trackUrl = fromBlockchain === 'BSC' || toBlockchain === 'BSC' ?
            `https://api.binance.org/bridge/api/v2/swaps/${track}` :
            networks.find(nw => nw.name === fromBlockchain).scannerTxBaseUrl + track;

        let emoji;
        switch (true) {
            case toBlockchain === 'TRX':
                emoji = this.providersEmojis.Tron;
                break;
            case symbol === 'RBC' && (fromBlockchain === 'BSC' || toBlockchain === 'BSC'):
                emoji = this.providersEmojis.Rubic;
                break;
            case fromBlockchain === 'BSC' || toBlockchain === 'BSC':
                emoji = this.providersEmojis.Binance;
                break;
            case fromBlockchain === 'POLYGON' || toBlockchain === 'POLYGON':
                emoji = this.providersEmojis.Polygon;
                break;
        }

        let priceInfo;
        if (price) {
            const usdPriceInEther = await coinGeckoApi.getUsdPriceInEther();
            priceInfo = {
                usdPrice: price,
                ethPrice: price * usdPriceInEther
            }
        } else {
            priceInfo = await coinGeckoApi.getAllPrices(symbol.toLowerCase());
        }

        const message = `
New bridge cross-chain swap was created by
<a href="${scannerUrl}">\ud83d\udcf6 ${walletAddress}</a> 

${priceInfo.ethPrice ? this.getFormattedBullets(priceInfo.ethPrice * amount, emoji) : ''}

<code>${fromNetwork.label} -> ${toNetwork.label}</code>
<b>${amount}</b> ${symbol}
${priceInfo.usdPrice ?
'USD amount: ~' + '<b>' + priceInfo.usdPrice * amount + '</b>' + '$' :
    'Can\'t find USD price for token ' + symbol
}
${priceInfo.ethPrice ?
    'ETH amount: ~' + '<b>' + priceInfo.ethPrice * amount + '</b>' :
    'Can\'t find ETH price for token ' + symbol
}

<a href="${trackUrl}">\ud83d\udcb4 More info</a>
        `;

        return this.sendMessage(this.chatId, message);
    }

    getFormattedBullets(ethValue, emoji) {
        const bulletsNumber = Math.floor(ethValue) + 1;
        return emoji.repeat(bulletsNumber);
    }
}

export default BridgeBot;
