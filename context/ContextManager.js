const CommandContext = require('../models/CommandContext');
const Events = require('../models/Events');
const config = require('../config/config');
const responseMessages = require('../config/responseMessages');
const ErrorNotifier = require('../utils/ErrorNotifier');
const ObjectId = require('mongoose').Types.ObjectId;


class ContextManager {
  constructor(bot = {}) {
    this.Bot = bot;
    this.errorNotifier = new ErrorNotifier(bot);
  }

  addEvent(context, messsage) {
    const contextData = {};
    const eventData = {};
    let botMessage = '';

    if (context.stage === 0) {
      eventData.title = messsage.text;
      botMessage = responseMessages.ADD_EVENT.ENTER_DESCRIPTION;
    }
    if (context.stage === 1) {
      eventData.description = messsage.text;
      botMessage = responseMessages.ADD_EVENT.ENTER_DATE;
    }
    if (context.stage === 2) {
      contextData.completed = true;
      eventData.date = messsage.text;
      eventData.ready = true;
      botMessage = responseMessages.ADD_EVENT.EVENT_ADDED;
    }

    contextData.stage = ++context.stage;

    return CommandContext
      .update({ _id: context._id }, contextData)
      .then(() => Events.update({ _id: context.entityId }, eventData))
      .then(() => this.Bot.sendMessage(config.adminId, botMessage))
      .catch((err) => {
        this.errorNotifier.sendDBErrorToAdmin(err);

        return CommandContext
          .update({ _id: context._id }, { stage: contextData.stage - 1, completed: false })
          .then(() => Events.update({ _id: context.entityId }, { ready: false }));
      });
  }
};

module.exports = ContextManager;
