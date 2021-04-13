import { networks, coinGeckoApi} from "../core";
import Bot from './bot';

class InstantTradeBot extends Bot {

    uniSwapEmoji = '\ud83e\udd84';
    oneInchEmoji = '\ud83d\udc34';
    pancakeEmoji = '\ud83e\udd5e';
    quickSwapEmoji = '\ud83d\udc32'

    chatId = process.env.INSTANT_TRADE_CHAT_ID;

    constructor(bot) {
        super(bot);
    }

    async sendNotification(request) {
        let { blockchain, provider, walletAddress, txHash, amountFrom, amountTo, symbolFrom, symbolTo } = request;
        blockchain ||= 'ETH';
        const network = networks.find(nw => nw.name === blockchain);
        const scannerAddressUrl = network.scannerAddressBaseUrl + walletAddress;
        const scannerTxUrl = network.scannerTxBaseUrl + txHash;

        const priceInfo = await coinGeckoApi.getAllPrices(symbolFrom.toLowerCase());
        let providerEmoji = this.oneInchEmoji;

        switch (provider.toLowerCase()) {
            case 'uniswap':
                providerEmoji = this.uniSwapEmoji;
                break;
            case '1inch':
                providerEmoji = this.oneInchEmoji;
                break;
            case 'pancakeswap':
                providerEmoji = this.pancakeEmoji;
                break;
            case 'quickswap':
                providerEmoji = this.quickSwapEmoji;
                break;
        }

        const message = `
New instant trade swap was created by
<a href="${scannerAddressUrl}">\ud83d\udcf6 ${walletAddress}</a> 
with <b>${provider}</b> ${providerEmoji}
in <b>${network.label}</b>

${priceInfo.ethPrice ? this.getFormattedBullets(priceInfo.ethPrice * amountFrom, network) : ''}

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

    getFormattedBullets(ethValue, network) {
        const bulletsNumber = Math.floor(ethValue) + 1;
        return network.bridgeEmoji.repeat(bulletsNumber);
    }
}

export default InstantTradeBot;
