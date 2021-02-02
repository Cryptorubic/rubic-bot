import fs from "fs";
import axios from "axios";

export default {
    url: 'https://api.coingecko.com/api/v3/coins/markets',
    tokens: JSON.parse(fs.readFileSync(process.cwd() + '/src/core/coin-gecko/tokens.json', 'utf-8')),
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
