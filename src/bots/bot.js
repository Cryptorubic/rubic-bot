class Bot {
    constructor(bot) {
        this.bot = bot;
    }

    async sendNotification(request) { }

    sendMessage(chatId, message) {
        return this.bot.sendMessage(chatId, message, {disable_web_page_preview: true, parse_mode: 'HTML'});
    }
}

export default Bot;
