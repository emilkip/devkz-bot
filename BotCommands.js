const FloodersActions = require('./actions/FloodersActions');
const EventsActions = require('./actions/EventsActions');
const configs = require('./config/config');
const responseMessages = require('./config/responseMessages');
const MessageUtils = require('./utils/MessageUtils');
const CommandContext = require('./models/CommandContext');
const Events = require('./models/Events');


class BotCommands {
  constructor(bot = {}) {
    this.Bot = bot;
    this.floodersActions = new FloodersActions(bot);
    this.eventsActions = new EventsActions(bot);
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
    if (!MessageUtils.isAdminChat(message.chat.id)) return;
    return this.eventsActions.createEvent();
  }

  showEvents(message) {
    if (!MessageUtils.isCurrentChat(message.chat.id)) return;
    return this.eventsActions.getEvents();
  }
}


module.exports = BotCommands;
