const Promise = require('bluebird');
const config = require('./config/config');
const Flooders = require('./models/Flooders');
const MessagesForMonth = require('./models/MessagesForMonth');
const ErrorNotifier = require('./utils/ErrorNotifier');

class Actions {

  constructor(bot = {}) {
    this.Bot = bot;
    this.errorNotifier = new ErrorNotifier(bot);
  }


  kickBot(messageObj) {
    this.Bot.kickChatMember(messageObj.chat.id, messageObj.new_chat_member.id);
    this.Bot.sendMessage(
      messageObj.chat.id,
      config.messages.BOT_KICK_MESSAGE
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
      config.getGreetingMessage(name, hasUsername),
      messageParams
    );
  }


  getTopFloodersAllTime() {
    return Flooders
      .find({})
      .sort({ messageCount: -1 })
      .limit(10)
      .then((flooders) => {
        const formatedTopFlooders = flooders.reduce((acc, flooder, index) => {
          acc += `${index + 1}) ${flooder.name}(${flooder.username || '-'}): <b>${flooder.messageCount}</b>\n`;
          return acc;
        }, '');
        const floodersList = (
          `\n<b>${config.messages.TOP_FLOODERS_ALL_TIME}</b>\n\n` +
          `${formatedTopFlooders}`
        );

        return this.Bot.sendMessage(config.chatId, floodersList, { parse_mode: 'HTML' });
      })
      .catch((err) => {
        this.errorNotifier.sendDBErrorToChat();
        this.errorNotifier.sendDBErrorToAdmin(err);
      });
  }


  getTopFloodersCustom(dateOfBegin, headerMessage) {
    const currentDate = new Date();
    const beginOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    return MessagesForMonth
      .aggregate([
        { $match: { createdAt: { $gt: dateOfBegin } } },
        { $group: {
            _id: '$userId',
            messageCount: { $sum: 1 },
            name: { $addToSet: '$name' },
            username: { $addToSet: '$username' }
        }}
      ])
      .then((flooders) => {
        const formatedTopFlooders = flooders.reduce((acc, flooder, index) => {
          acc += `${index + 1}) ${flooder.name[0]}(${flooder.username[0] || '-'}): <b>${flooder.messageCount}</b>\n`;
          return acc;
        }, '');
        const floodersList = (
          `\n<b>${headerMessage}</b>\n\n` +
          `${formatedTopFlooders}`
        );

        return this.Bot.sendMessage(config.chatId, floodersList, { parse_mode: 'HTML' });
      })
      .catch((err) => {
        this.errorNotifier.sendDBErrorToChat();
        this.errorNotifier.sendDBErrorToAdmin(err);
      });
  }


  saveMessageToDB(message) {
    const name = `${message.from.first_name || ''} ${message.from.last_name || ''}`;
    const messageToSave = new MessagesForMonth({
      userId: message.from.id,
      message: message.text,
      username: message.from.username,
      name
    });

    return messageToSave
      .save()
      .then(() => Flooders.findOne({ userId: message.from.id }))
      .then((foundFlooder) => {
        if (!foundFlooder) {
          return new Flooders({ userId: message.from.id, username: message.from.username, name }).save();
        }
        return Flooders.update({ userId: message.from.id }, { $inc: { messageCount: 1 } });
      })
      .catch((err) => {
        this.errorNotifier.sendDBErrorToAdmin(err);
      });
  }

}

module.exports = Actions;
