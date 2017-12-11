const Promise = require('bluebird');
const config = require('../config/config');
const responseMessages = require('../config/responseMessages');
const ErrorNotifier = require('../utils/ErrorNotifier');
const ContextManager = require('../context/ContextManager');
const CommandContext = require('../models/CommandContext');


class MainActions {

  constructor(bot = {}) {
    this.Bot = bot;
    this.errorNotifier = new ErrorNotifier(bot);
    this.contextManager = new ContextManager(bot);
  }


  kickBot(messageObj) {
    this.Bot.kickChatMember(messageObj.chat.id, messageObj.new_chat_member.id);
    this.Bot.sendMessage(
      messageObj.chat.id,
      responseMessages.BOT_KICK_MESSAGE
    );
  }


  restrictUser(chatId, userId) {
    const options = {
      until_date: parseInt(Date.now() / 1000) + 300
    };
    return this.Bot.restrictChatMember(chatId, userId, options);
  }


  sendGreetingMessage(messageObj) {
    const messageParams = {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Дисклеймер',
              url: 'http://telegra.ph/Disclaimer-DevKZ-09-21'
            }
          ]
        ]
      }
    };

    const hasUsername = typeof messageObj.new_chat_member.username !== 'undefined';
    const name = messageObj.new_chat_member.username ||
      `${messageObj.new_chat_member.first_name || ''} ${messageObj.new_chat_member.last_name || ''}`;

    return this.Bot.sendMessage(
      messageObj.chat.id,
      responseMessages.getGreetingMessage(name, hasUsername),
      messageParams
    );
  }


  checkForContext(messsage) {
    return CommandContext
      .findOne({ completed: false })
      .then((context) => {
        if (!context) return Promise.resolve();

        return this.contextManager[context.type](context, messsage);
      })
      .catch((err) => this.errorNotifier.sendDBErrorToAdmin(err));
  }

}

module.exports = MainActions;
