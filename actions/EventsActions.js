const responseMessages = require('../config/responseMessages');
const config = require('../config/config');
const ErrorNotifier = require('../utils/ErrorNotifier');
const Events = require('../models/Events');
const CommandContext = require('../models/CommandContext');


class EventsActions {
  constructor(bot = {}) {
    this.Bot = bot;
  }

  createEvent() {
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
        return this.Bot.sendMessage(config.adminId, responseMessages.EVENT.ENTER_TITLE);
      })
      .catch((err) => {
        this.Bot.sendMessage(config.adminId, JSON.stringify(err));
      });
  }

  getEvents(events) {
    const formatEventList = (events) => (
        events.reduce((eventList, event, index) => {
          const date = new Date(event.date);
          const eventItem = `<b>(${index + 1}) ${event.title}</b>\n(${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()})\n\n`;
          eventList.formatedStr += eventItem;

          const callbackData = {
            type: 'showEvent',
            data: event._id.toString()
          };

          eventList.moreInfoBtns.push({
            text: index + 1,
            callback_data: JSON.stringify(callbackData)
          });
          return eventList;
        }, {
          formatedStr: '',
          moreInfoBtns: []
        })
    );

    return Events
      .find({ date: { $gt: new Date() } })
      .then((events) => {
        const formatedList = formatEventList(events);
        const messageParams = {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [formatedList.moreInfoBtns]
          }
        };
        let message = `<b>${responseMessages.EVENT.UPCOMMING_EVENTS}</b>\n\n\n`;

        if (formatedList.formatedStr) {
          message += `${formatedList.formatedStr}\n\n`;
          message += `${responseMessages.EVENT.MORE_DETAILS}`;
        } else {
          message += responseMessages.EVENT.NO_UPCOMMING_EVENTS;
        }

        return this.Bot.sendMessage(config.chatId, message, messageParams);
      });
  }

  getEventDetails(eventId) {
    return Events
      .findById(eventId)
      .then((event) => {
        const messageParams = {
          parse_mode: 'HTML',
        };

        const date = new Date(event.date);
        const formatedEvent = `<b>${event.title}</b> (${date.getDate()}.${date.getMonth()}.${date.getFullYear()})\n\n` +
            `${event.description}`;

          return this.Bot.sendMessage(config.chatId, formatedEvent, messageParams);
      });
  }
}

module.exports = EventsActions;
