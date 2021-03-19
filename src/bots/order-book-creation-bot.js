import { networks, coinGeckoApi} from "../core";
import Bot from './bot';

class OrderBookCreationBot extends Bot {

    chatId = process.env.ORDER_BOOK_CHAT_ID;

    openBookEmoji = '\ud83d\udcd6';

    constructor(bot) {
        super(bot);
    }

    async sendNotification(request) {
        let { blockchain, walletAddress, txHash, link, amountFrom, amountTo, symbolFrom, symbolTo } = request;

        const network = networks.find(nw => nw.name === blockchain);
        const scannerAddressUrl = network.scannerAddressBaseUrl + walletAddress;
        const scannerTxUrl = network.scannerTxBaseUrl + txHash;

        const priceInfo = await coinGeckoApi.getAllPrices(symbolFrom.toLowerCase());
        const message = `
${this.openBookEmoji} New <a href="${link}">order book</a> swap was created!
 
Created by <a href="${scannerAddressUrl}">\ud83d\udcf6 ${walletAddress}</a> 
in <b>${network.label}</b>

${priceInfo.ethPrice ? this.getFormattedBullets(priceInfo.ethPrice * amountFrom, network) : ''}

<code>${amountFrom} ${symbolFrom} -> ${amountTo} ${symbolTo}</code>
${priceInfo.usdPrice ?
            'USD from amount: ~' + '<b>' + priceInfo.usdPrice * amountFrom + '</b>' + '$' :
            'Can\'t find USD price for token ' + symbolFrom
        }
${priceInfo.ethPrice ?
            'ETH from amount: ~' + '<b>' + priceInfo.ethPrice * amountFrom + '</b>' :
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

export default OrderBookCreationBot;
