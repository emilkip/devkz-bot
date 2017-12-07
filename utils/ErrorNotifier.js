const config = require('../config/config');
const responseMessages = require('../config/responseMessages');

class ErrorNotifier {
  constructor(bot = {}) {
    this.Bot = bot;
  }

  sendDBErrorToChat() {
    return this.Bot.sendMessage(config.chatId, responseMessages.DB_ERROR_MESSAGE);
  }

  sendDBErrorToAdmin(err) {
    return this.Bot.sendMessage(config.adminId, JSON.stringify(err));
  }
}

module.exports = ErrorNotifier;
