import { networks, coinGeckoApi} from "../core";
import Bot from './bot';

class OrderBookContributionBot extends Bot {

    chatId = process.env.ORDER_BOOK_CHAT_ID;

    greenBook = '\ud83d\udcd7';

    redBook = '\ud83d\udcd5';

    types = {
        contribute: {
            action: 'contribution',
            emoji: this.greenBook,
        },
        withdraw: {
            action: 'withdraw',
            emoji: this.redBook,
        }
    }

    constructor(bot) {
        super(bot);
    }

    async sendNotification(request) {
        let { blockchain, walletAddress, txHash, link, typeName, symbol, amount } = request;

        const network = networks.find(nw => nw.name === blockchain);
        const scannerAddressUrl = network.scannerAddressBaseUrl + walletAddress;
        const scannerTxUrl = network.scannerTxBaseUrl + txHash;
        const priceInfo = await coinGeckoApi.getAllPrices(symbol.toLowerCase());
        const usdPrice = amount && priceInfo.usdPrice * amount;
        const ethPrice = amount && priceInfo.ethPrice * amount;

        const type = this.types[typeName];

        const message = `
${type.emoji} New <a href="${link}">order book</a> ${type.action}!
 
Created by <a href="${scannerAddressUrl}">\ud83d\udcf6 ${walletAddress}</a> 
in <b>${network.label}</b>
${ethPrice? '\n' + this.getFormattedBullets(ethPrice, network) + '\n' : ''}
<code>${amount || ''} ${symbol} ${type.action}</code>
${!amount ? '' :
            (usdPrice ?
                ('USD from amount: ~' + '<b>' + usdPrice + '</b>' + '$' + '\n') :
                ('Can\'t find USD price for token ' + symbol) + '\n')
            +        
            (ethPrice ?
                ('ETH from amount: ~' + '<b>' + usdPrice + '</b>' + '\n'):
                ('Can\'t find ETH price for token ' + symbol) + '\n')
                    
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

export default OrderBookContributionBot;
