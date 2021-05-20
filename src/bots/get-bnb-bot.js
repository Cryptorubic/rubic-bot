import { networks, coinGeckoApi} from "../core";
import Bot from './bot';

class GetBnbBot extends Bot {

    providersEmojis = {
        Binance: '\ud83d\udfe0',
        Polygon: '\ud83d\udfe3',
    }

    payTokenEmojis = {
        ETH: '\ud83d\udd37',
        RBC: '\ud83d\udfe9'
    }

    chatId = process.env.GET_BNB_CHAT_ID;

    constructor(bot) {
        super(bot);
    }

    async sendNotification(request) {
        const { transactionHash, walletAddress, amount, toBlockchain, symbol, price } = request;
        const scannerUrl = networks[0].scannerAddressBaseUrl + walletAddress;
        const trackUrl = networks[0].scannerTxBaseUrl + transactionHash;

       const emoji = toBlockchain === 'BSC' ? this.providersEmojis.Binance : this.providersEmojis.Polygon;

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
New get BNB request was created by
<a href="${scannerUrl}">\ud83d\udcf6 ${walletAddress}</a> 

${priceInfo.ethPrice ? this.getFormattedBullets(priceInfo.ethPrice * amount, emoji) : ''} <code>ETH -> ${toBlockchain}</code>

${this.payTokenEmojis[symbol]} paid in <b>${amount}</b> ${symbol}
 
${priceInfo.usdPrice ?
            'USD amount: ~' + '<b>' + priceInfo.usdPrice * amount + '</b>' + '$' :
            'Can\'t find USD price for token ' + symbol
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

export default GetBnbBot;
