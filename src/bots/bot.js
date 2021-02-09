import TelegramBot from "node-telegram-bot-api";

class Bot {
    constructor(token) {
        this.bot = new TelegramBot(token, {polling: true});
    }

    async sendNotification(request) { }

    sendMessage(chatId, message) {
        return this.bot.sendMessage(chatId, message, {disable_web_page_preview: true, parse_mode: 'HTML'});
    }
}

export default Bot;
