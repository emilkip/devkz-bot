const FloodersActions = require('./actions/FloodersActions');
const configs = require('./config/config');
const responseMessages = require('./config/responseMessages');
const MessageUtils = require('./utils/MessageUtils');
const CommandContext = require('./models/CommandContext');
const Events = require('./models/Events');

class BotCommands {
  constructor(bot = {}) {
    this.Bot = bot;
    this.floodersActions = new FloodersActions(bot);
  }

  topFlooders(message, match) {
    if (!MessageUtils.isCurrentChat(message.chat.id)) return;
    return this.floodersActions.getTopFloodersAllTime();
  }

  topFloodersMonth(message, match) {
    if (!MessageUtils.isCurrentChat(message.chat.id)) return;
    const currentDate = new Date();
    const beginOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return this.floodersActions.getTopFloodersCustom(beginOfMonth, responseMessages.TOP_FLOODERS_FOR_MONTH);
  }

  topFloodersDay(message, match) {
    if (!MessageUtils.isCurrentChat(message.chat.id)) return;
    const currentDate = new Date();
    const beginOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    return this.floodersActions.getTopFloodersCustom(beginOfDay, responseMessages.TOP_FLOODERS_FOR_DAY);
  }

  addEvent(message, match) {
    if (!MessageUtils.isAdmin(message.from.id)) return;

    return Events.create({})
      .then((event) => {
        const context = {
          type: 'addEvent',
          stage: 0,
          entityId: event._id
        };
        return CommandContext.create(context);
      })
      .then((context) => {
        return this.Bot.sendMessage(configs.adminId, responseMessages.ADD_EVENT.ENTER_TITLE);
      })
      .catch((err) => {
        this.Bot.sendMessage(configs.adminId, JSON.stringify(err));
      });
  }
}


module.exports = BotCommands;
