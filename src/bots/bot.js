import TelegramBot from "node-telegram-bot-api";

class Bot {
    constructor(request, token) {
        this.request = request;
        this.bot = new TelegramBot(token, {polling: true});
    }

    async sendNotification() { }
}

export default Bot;
