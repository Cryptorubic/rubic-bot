import { networks, coinGeckoApi} from "../core";
import Bot from './bot';

class CryptoTapBot extends Bot {

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
        const { transactionHash, walletAddress, fromAmount, toAmount, toBlockchain, fromTokenSymbol, fromTokenPrice } = request;
        const scannerUrl = networks[0].scannerAddressBaseUrl + walletAddress;
        const trackUrl = networks[0].scannerTxBaseUrl + transactionHash;

       const emoji = toBlockchain === 'BSC' ? this.providersEmojis.Binance : this.providersEmojis.Polygon;
       const toCurrency = toBlockchain === 'BSC' ? 'BNB' : 'MATIC';

        let priceInfo;
        if (fromTokenPrice) {
            const usdPriceInEther = await coinGeckoApi.getUsdPriceInEther();
            priceInfo = {
                usdPrice: fromTokenPrice,
                ethPrice: fromTokenPrice * usdPriceInEther
            }
        } else {
            priceInfo = await coinGeckoApi.getAllPrices(fromTokenSymbol.toLowerCase());
        }

        const message = `
New get ${toCurrency} request was created by
<a href="${scannerUrl}">\ud83d\udcf6 ${walletAddress}</a> 

${priceInfo.ethPrice ? this.getFormattedBullets(priceInfo.ethPrice * fromAmount, emoji) : ''} <code>ETH -> ${toBlockchain}</code>

${this.payTokenEmojis[fromTokenSymbol]} paid in <b>${fromAmount}</b> ${fromTokenSymbol}
about ${toAmount} ${toCurrency} will be received 
 
${priceInfo.usdPrice ?
            'USD amount: ~' + '<b>' + priceInfo.usdPrice * fromAmount + '</b>' + '$' :
            'Can\'t find USD price for token ' + fromAmount
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

export default CryptoTapBot;
