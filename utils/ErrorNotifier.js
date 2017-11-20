const config = require('../config/config');

class ErrorNotifier {
  constructor(bot = {}) {
    this.Bot = bot;
  }

  sendDBErrorToChat() {
    return this.Bot.sendMessage(config.chatId, config.messages.DB_ERROR_MESSAGE);
  }

  sendDBErrorToAdmin(err) {
    return this.Bot.sendMessage(config.adminId, JSON.stringify(err));
  }
}

module.exports = ErrorNotifier;
