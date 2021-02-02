import TelegramBot from "node-telegram-bot-api";

class Bot {
    constructor(token) {
        this.bot = new TelegramBot(token, {polling: true});
    }

    async sendNotification(request) { }
}

export default Bot;
