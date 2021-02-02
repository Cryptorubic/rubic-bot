import {BridgeBot} from "../bots";
import InstantTradeBot from "../bots/instant-trade-bot";

export default app => {
    app.post('/bridgeSwaps', async (req, res) => {
        const bot = new BridgeBot(req.body);
        activateBot(bot, res);
    });

    app.post('/instantTrade', async (req, res) => {
        const bot = new InstantTradeBot(req.body);
        activateBot(bot, res);
    });

    app.post('/orderBook', async (req, res) => {

    });
}

async function activateBot(bot, res) {
    try {
        await bot.sendNotification();
        res.send();
    } catch (e) {
        console.log(e);
        res.send();
    }
}
