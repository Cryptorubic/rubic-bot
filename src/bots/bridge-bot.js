import { networks, coinGeckoApi} from "../core";
import Bot from './bot';

class BridgeBot extends Bot {

    chatId = process.env.BRIDGE_CHAT_ID;

    constructor() {
        super(process.env.BRIDGE_BOT_TOKEN);
    }

    async sendNotification(request) {
        const { binanceId, walletAddress, amount, network, symbol, ethSymbol } = request;
        const fromNetwork = networks.find(nw => nw.name === network).label;
        const toNetwork = networks.find(nw => nw.name !== network).label;
        const scannerUrl = networks.find(nw => nw.name === network).scannerAddressBaseUrl + walletAddress;

        const priceInfo = await coinGeckoApi.getAllPrices(ethSymbol.toLowerCase());

        const message = `
            New bridge cross-chain swap was created by ${scannerUrl}\n
            ${fromNetwork} -> ${toNetwork}\n
            ${amount} ${symbol}\n
            ${priceInfo.usdPrice ?
                'USD amount: ~' + priceInfo.usdPrice * amount + '$' :
                'Can\'t find USD price for token ' + ethSymbol
            }\n
            ${priceInfo.ethPrice ?
                'ETH amount: ~' + priceInfo.ethPrice * amount :
                'Can\'t find ETH price for token ' + ethSymbol
            }\n
            More info: https://api.binance.org/bridge/api/v2/swaps/${binanceId}
        `;

        return this.bot.sendMessage(this.chatId, message);
    }
}

export default BridgeBot;
