import { networks, coinGeckoApi} from "../core";
import Bot from './bot';

class BridgeBot extends Bot {

    chatId = process.env.BRIDGE_CHAT_ID;

    constructor() {
        super(process.env.BRIDGE_BOT_TOKEN);
    }

    async sendNotification(request) {
        const { binanceId, walletAddress, amount, network, symbol, ethSymbol } = request;
        const fromNetwork = networks.find(nw => nw.name === network);
        const toNetwork = networks.find(nw => nw.name !== network);
        const scannerUrl = networks.find(nw => nw.name === network).scannerAddressBaseUrl + walletAddress;

        const priceInfo = await coinGeckoApi.getAllPrices(ethSymbol.toLowerCase());

        const message = `
New bridge cross-chain swap was created by
<a href="${scannerUrl}">\ud83d\udcf6 ${walletAddress}</a> 

${priceInfo.ethPrice ? this.getFormattedBullets(priceInfo.ethPrice * amount, fromNetwork) : ''}

<code>${fromNetwork.label} -> ${toNetwork.label}</code>
<b>${amount}</b> ${symbol}
${priceInfo.usdPrice ?
'USD amount: ~' + '<b>' + priceInfo.usdPrice * amount + '</b>' + '$' :
    'Can\'t find USD price for token ' + ethSymbol
}
${priceInfo.ethPrice ?
    'ETH amount: ~' + '<b>' + priceInfo.ethPrice * amount + '</b>' :
    'Can\'t find ETH price for token ' + ethSymbol
}

<a href="https://api.binance.org/bridge/api/v2/swaps/${binanceId}">\ud83d\udcb4 More info</a>
        `;

        return this.sendMessage(this.chatId, message);
    }

    getFormattedBullets(ethValue, network) {
        const bulletsNumber = Math.round(ethValue);
        return network.bridgeEmoji.repeat(bulletsNumber);
    }
}

export default BridgeBot;
