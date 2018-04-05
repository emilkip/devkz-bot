const TelegramBot = require('node-telegram-bot-api');
const { mongoose, mongooseOptions } = require('./config/mongooseConfig');
const configs = require('./config/config');
const responseMessages = require('./config/responseMessages');
const MainActions = require('./actions/MainActions');
const FloodersActions = require('./actions/FloodersActions');
const EventsActions = require('./actions/EventsActions');
const BotCommands = require('./BotCommands');
const MessageUtils = require('./utils/MessageUtils');

const envOptions = configs[configs.env];
const options = envOptions.bot.options;
const Bot = new TelegramBot(configs.token, options);
const mainActions = new MainActions(Bot);
const floodersActions = new FloodersActions(Bot);
const eventsActions = new EventsActions(Bot);
const botCommands = new BotCommands(Bot);


mongoose.connect(envOptions.db.url, mongooseOptions).then(
    () => Bot.sendMessage(configs.adminId, responseMessages.MAINTAIN.DB_CONNECTED),
    (err) => Bot.sendMessage(configs.adminId, JSON.stringify(err))
);

let usersMessages = {};


if (configs.env === 'production') {
  Bot.setWebHook(`${configs.url}/bot${configs.token}`)
    .then((data) => Bot.sendMessage(configs.adminId, `${responseMessages.MAINTAIN.WEBHOOK_INSTALLED}\n\n${JSON.stringify(data)}`))
    .catch((err) => Bot.sendMessage(configs.adminId, JSON.stringify(err)));
}

setInterval(() => {
  checkUserActions();
  usersMessages = {};
}, 3000);


Bot.onText(/\/top_flooders\b/, botCommands.topFlooders.bind(botCommands));
Bot.onText(/\/top_flooders_month\b/, botCommands.topFloodersMonth.bind(botCommands));
Bot.onText(/\/top_flooders_day\b/, botCommands.topFloodersDay.bind(botCommands));
Bot.onText(/\/add_event\b/, botCommands.addEvent.bind(botCommands));
Bot.onText(/\/show_events\b/, botCommands.showEvents.bind(botCommands));

Bot.on('callback_query', (callbackQuery) => {
  const dateOfMessage = callbackQuery.message.date * 1000;
  const dateDelta = new Date().getTime() - dateOfMessage;

  if (dateDelta > configs.inlineKeyboardAccessTime) return;

  const parsedData = JSON.parse(callbackQuery.data);

  if (parsedData && parsedData.type === 'showEvent') {
    const username = callbackQuery.from.username || `${callbackQuery.from.firstName || ''} ${callbackQuery.from.lastName || ''}`;
    return eventsActions.getEventDetails(parsedData.data, username);
  }
});

Bot.on('message', (message) => {
  if (MessageUtils.isAdminChat(message.chat.id)) {
    mainActions.checkForContext(message);
  }
  if (!MessageUtils.isCurrentChat(message.chat.id) || message.forward_date) return;
  if (message.new_chat_member) {
    if (message.new_chat_member.is_bot) return mainActions.kickBot(message);

    return mainActions.sendGreetingMessage(message);
  }

  if (message.reply_to_message && message.reply_to_message.from.username === configs.botUsername) {
    return Bot.sendMessage(configs.chatId, responseMessages.getBotRandomReplyMessage());
  }

  usersMessages = MessageUtils.countMessage(message, usersMessages);
  floodersActions.saveMessageToDB(message);
});


function checkUserActions() {
  Object.keys(usersMessages).forEach((userId) => {
    if (usersMessages[userId].count > configs.maxAvailableMessagesCount) {
      mainActions.restrictUser(configs.chatId, userId);
      Bot.sendMessage(configs.chatId, `${responseMessages.FLOODER_RESTRICT_MESSAGE} ${usersMessages[userId].username}`);

      usersMessages[userId].messages.forEach((message) => {
        Bot.deleteMessage(configs.chatId, message.message_id);
      });
    }
  });
}
