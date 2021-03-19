import {bridgeBot, instantTradesBot, orderBookContributionBot, orderBookCreationBot} from "../bots";

export default app => {
    app.post('/bridgeSwap', async (req, res) => {
        activateBot(bridgeBot, req.body, res);
    });

    app.post('/instantTrade', async (req, res) => {
        activateBot(instantTradesBot, req.body, res);
    });

    app.post('/orderBook/create', async (req, res) => {
        activateBot(orderBookCreationBot, req.body, res);
    });

    app.post('/orderBook/contribute', async (req, res) => {
        activateBot(orderBookContributionBot, req.body, res);
    });
}

async function activateBot(bot, request, res) {
    try {
        await bot.sendNotification(request);
        res.send();
    } catch (e) {
        console.log(e);
        res.send();
    }
}
