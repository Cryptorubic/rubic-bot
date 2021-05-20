import BridgeBot from "./bridge-bot.js";
import InstantTradeBot from "./instant-trade-bot.js";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import OrderBookCreationBot from "./order-book-creation-bot";
import OrderBookContributionBot from "./order-book-contribution-bot";
import GetBnbBot from "./get-bnb-bot";

dotenv.config();

const telegramInstantTradeBot = new TelegramBot(process.env.INSTANT_TRADE_BOT_TOKEN, {polling: true});
const telegramBridgeBot = new TelegramBot(process.env.BRIDGE_BOT_TOKEN, {polling: true});
const telegramOrderBookBot = new TelegramBot(process.env.ORDER_BOOK_BOT_TOKEN, {polling: true});

const bridgeBot = new BridgeBot(telegramBridgeBot);
const getBnbBot = new GetBnbBot(telegramBridgeBot);
const instantTradesBot = new InstantTradeBot(telegramInstantTradeBot);
const orderBookCreationBot = new OrderBookCreationBot(telegramOrderBookBot);
const orderBookContributionBot = new OrderBookContributionBot(telegramOrderBookBot);


export { bridgeBot, getBnbBot, instantTradesBot, orderBookCreationBot, orderBookContributionBot }
