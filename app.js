const TelegramBot = require('node-telegram-bot-api');
const { mongoose, mongooseOptions } = require('./config/mongooseConfig');
const configs = require('./config/config');
const responseMessages = require('./config/responseMessages');
const MainActions = require('./actions/MainActions');
const FloodersActions = require('./actions/FloodersActions');
const EventsActions = require('./actions/EventsActions');
const BotCommands = require('./BotCommands');
const Flooders = require('./models/Flooders');
const MessagesForMonth = require('./models/MessagesForMonth');
const Events = require('./models/Events');
const CommandContext = require('./models/CommandContext');
const MessageUtils = require('./utils/MessageUtils');

const envOptions = configs[configs.env];
const options = envOptions.bot.options;
const Bot = new TelegramBot(configs.token, options);
const mainActions = new MainActions(Bot);
const floodersActions = new FloodersActions(Bot);
const eventsActions = new EventsActions(Bot);
const botCommands = new BotCommands(Bot);


mongoose.connect(envOptions.db.url, mongooseOptions, (err) => {
  if(err) return Bot.sendMessage(configs.adminId, JSON.stringify(err));
});

let usersMessages = {};


if (configs.env === 'production') {
  Bot.setWebHook(`${configs.url}/bot${configs.token}`);
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
  const parsedData = JSON.parse(callbackQuery.data);

  if (parsedData && parsedData.type === 'showEvent') {
    return eventsActions.getEventDetails(parsedData.data);
  }
});

Bot.on('message', (message) => {
  if (MessageUtils.isAdminChat(message.chat.id)) {
    mainActions.checkForContext(message);
  }
  if (!MessageUtils.isCurrentChat(message.chat.id)) return;
  if (message.new_chat_member) {
    if (message.new_chat_member.is_bot) return mainActions.kickBot(message);

    return mainActions.sendGreetingMessage(message);
  }

  if (message.text.includes('@devkz_bot')) {
    return Bot.sendMessage(configs.chatId, responseMessages.BOT_REPLY_MESSAGE_ON_TAGGING);
  }

  if (message.reply_to_message && message.reply_to_message.from.username === 'devkz_bot') {
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
