import { networks, coinGeckoApi} from "../core";
import Bot from './bot';

class InstantTradeBot extends Bot {

    bulletEmoji = '\ud83d\udfe2';

    chatId = process.env.INSTANT_TRADE_CHAT_ID;

    constructor() {
        super(process.env.INSTANT_TRADE_BOT_TOKEN);
    }

    async sendNotification(request) {
        const { walletAddress, txHash, amountFrom, amountTo, symbolFrom, symbolTo } = request;

        const scannerAddressUrl = networks[0].scannerAddressBaseUrl + walletAddress;
        const scannerTxUrl = networks[0].scannerTxBaseUrl + txHash;

        const priceInfo = await coinGeckoApi.getAllPrices(symbolFrom.toLowerCase());

        const message = `
New instant trade swap was created by
<a href="${scannerAddressUrl}">\ud83d\udcf6 ${walletAddress}</a> 

${priceInfo.ethPrice ? this.getFormattedBullets(priceInfo.ethPrice * amountFrom) : ''}

<code>${amountFrom} ${symbolFrom} -> ${amountTo} ${symbolTo}</code>
${priceInfo.usdPrice ?
    'USD amount: ~' + '<b>' + priceInfo.usdPrice * amountFrom + '</b>' + '$' :
    'Can\'t find USD price for token ' + symbolFrom
}
${priceInfo.ethPrice ?
    'ETH amount: ~' + '<b>' + priceInfo.ethPrice * amountFrom + '</b>' :
    'Can\'t find ETH price for token ' + symbolFrom
}

<a href="${scannerTxUrl}">\ud83d\udcb4 More info</a>
        `;

        return this.sendMessage(this.chatId, message);
    }

    getFormattedBullets(ethValue) {
        const bulletsNumber = Math.round(ethValue);
        return this.bulletEmoji.repeat(bulletsNumber);
    }
}

export default InstantTradeBot;
