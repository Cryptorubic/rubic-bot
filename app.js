import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import 'dotenv';

const token = process.env.BRIDGE_BOT_TOKEN;
const chatId = process.env.BRIDGE_CHAT_ID;

const networks = [
    {
        name: 'ETH',
        label: 'Ethereum',
        scanerBaseUrl: 'https://etherscan.io/address/'
    },
    {
        name: 'BSC',
        label: 'Binance Smart Chain',
        scanerBaseUrl: 'https://bscscan.com/address/'
    }
]

const coingeckoApi = {
    url: 'https://api.coingecko.com/api/v3/coins/markets',
    tokens: JSON.parse(fs.readFileSync('./tokens.json', 'utf-8')),
    getTokenId(tokenSymbol) {
        return this.tokens.find(token => token.symbol === tokenSymbol)?.id;
    },
    async getAllPrices(tokenSymbol) {
        const usdPrice = await this.getTokenUSDPrice(tokenSymbol);
        const ethPrice = await this.getTokenETHPrice(tokenSymbol);

        return {
            usdPrice,
            ethPrice
        }
    },
    async getTokenPrice(tokenSymbol, vsCurrencySymbol) {
        const tokenId = this.getTokenId(tokenSymbol);
        if (!tokenId) {
            return
        }

        const response = await axios.get(this.url, { params: {vs_currency: vsCurrencySymbol, ids: tokenId}});
        return response.data?.[0]?.current_price;
    },
    async getTokenUSDPrice(tokenSymbol) {
        return this.getTokenPrice(tokenSymbol, 'usd')
    },
    async getTokenETHPrice(tokenSymbol) {
        return this.getTokenPrice(tokenSymbol, 'eth');
    }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
const bot = new TelegramBot(token, {polling: true});

app.post('/transaction', (req, res) => {
    try {
        const { binanceId, walletAddress, amount, network, symbol, ethSymbol } = req.body;
        const fromNetwork = networks.find(nw => nw.name === network).label;
        const toNetwork = networks.find(nw => nw.name !== network).label;
        const scannerUrl = networks.find(nw => nw.name === network).scanerBaseUrl + walletAddress;

        coingeckoApi.getAllPrices(ethSymbol.toLowerCase()).then(priceInfo => {
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
            bot.sendMessage(chatId, message);
            res.send();
        })
    } catch (e) {
        console.log(e);
        res.send();
    }
});

const port = process.env.NODE_ENV === 'development' ? 8080 : 80;

app.listen(port, () => {
    console.log(`Server runs on ${port} port`);
});
