import { networks, coinGeckoApi} from "../core";
import Bot from './bot';

class InstantTradeBot extends Bot {

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
            New instant trade swap was created by ${scannerAddressUrl}\n
            ${amountFrom} ${symbolFrom} -> ${amountTo} ${symbolTo}\n
            ${priceInfo.usdPrice ?
            'USD amount: ~' + priceInfo.usdPrice * amountFrom + '$' :
            'Can\'t find USD price for token ' + symbolFrom
        }\n
            ${priceInfo.ethPrice ?
            'ETH amount: ~' + priceInfo.ethPrice * amountFrom :
            'Can\'t find ETH price for token ' + symbolFrom
        }\n
            Transaction: ${scannerTxUrl}
        `;

        return this.bot.sendMessage(this.chatId, message);
    }
}

export default InstantTradeBot;
