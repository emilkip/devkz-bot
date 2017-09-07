const configs = require('./config');

class Actions {

  constructor(bot = {}) {
    this.Bot = bot;
  }

  kickBot(messageObj) {
    this.Bot.kickChatMember(messageObj.chat.id, messageObj.new_chat_member.id);
    this.Bot.sendMessage(
      messageObj.chat.id,
      configs.messages.botKickMessage
    );
  }

  sendGreetingMessage(messageObj) {
    const messageParams = {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Дисклеймер',
              url: 'http://telegra.ph/Disclaimer-httpstmedevkz-08-10'
            }
          ]
        ]
      }
    };

    return this.Bot.sendMessage(
      messageObj.chat.id,
      configs.getGreetingMessage(messageObj.new_chat_member.username),
      messageParams
    );
  }
}

module.exports = Actions;
