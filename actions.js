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

    const hasUsername = typeof messageObj.new_chat_member.username !== 'undefined';
    const name = messageObj.new_chat_member.username ||
      `${messageObj.new_chat_member.first_name} ${messageObj.new_chat_member.last_name}`;

    return this.Bot.sendMessage(
      messageObj.chat.id,
      configs.getGreetingMessage(name, hasUsername),
      messageParams
    );
  }
}

module.exports = Actions;
