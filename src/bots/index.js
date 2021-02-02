import BridgeBot from "./bridge-bot.js";
import InstantTradeBot from "./instant-trade-bot.js";
import dotenv from "dotenv";

dotenv.config();

const bridgeBot = new BridgeBot();
const instantTradesBot = new InstantTradeBot();

export { bridgeBot, instantTradesBot }
