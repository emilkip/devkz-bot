const Flooders = require('../models/Flooders');
const MessagesForMonth = require('../models/MessagesForMonth');
const responseMessages = require('../config/responseMessages');
const config = require('../config/config');
const ErrorNotifier = require('../utils/ErrorNotifier');


class FloodersActions {
  constructor(bot = {}) {
    this.Bot = bot;
    this.errorNotifier = new ErrorNotifier(bot);
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
          `\n<b>${responseMessages.TOP_FLOODERS_ALL_TIME}</b>\n\n` +
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
      .sort('-messageCount')
      .limit(10)
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

module.exports = FloodersActions;
