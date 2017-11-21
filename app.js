const TelegramBot = require('node-telegram-bot-api');
const { mongoose, mongooseOptions } = require('./config/mongooseConfig');
const configs = require('./config/config');
const Actions = require('./actions');
const Flooders = require('./models/Flooders');
const MessagesForMonth = require('./models/MessagesForMonth');

const envOptions = configs[configs.env];
const options = envOptions.bot.options;
const Bot = new TelegramBot(configs.token, options);
const actions = new Actions(Bot);

mongoose.connect(envOptions.db.url, mongooseOptions);

let usersMessages = {};


if (configs.env === 'production') {
  Bot.setWebHook(`${configs.url}/bot${configs.token}`);
}

setInterval(() => {
  checkUserActions();
  usersMessages = {};
}, 3000);


Bot.onText(/\/top_flooders\b/, (message, match) => {
  return actions.getTopFloodersAllTime();
});

Bot.onText(/\/top_flooders_month\b/, (message, match) => {
  const currentDate = new Date();
  const beginOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  return actions.getTopFloodersCustom(beginOfMonth, configs.messages.TOP_FLOODERS_FOR_MONTH);
});

Bot.onText(/\/top_flooders_day\b/, (message, match) => {
  const currentDate = new Date();
  const beginOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  return actions.getTopFloodersCustom(beginOfDay, configs.messages.TOP_FLOODERS_FOR_DAY);
});


Bot.on('message', (message) => {
  if (message.new_chat_member) {
    if (message.new_chat_member.is_bot) return actions.kickBot(message);

    return actions.sendGreetingMessage(message);
  }

  if (message.reply_to_message && message.reply_to_message.from.username === 'devkz_bot') {
    return Bot.sendMessage(configs.chatId, configs.messages.BOT_REPLY_MESSAGE);
  }

  countMessage(message);
  actions.saveMessageToDB(message);
});

function countMessage(message) {
  if (!usersMessages[message.from.id]) {
    usersMessages[message.from.id] = {
      username: message.from.username || `${message.from.first_name || ''} ${message.from.last_name || ''}`,
      count: 0,
      messages: []
    }
  }
  ++usersMessages[message.from.id].count;
  usersMessages[message.from.id].messages.push(message.message_id);
}

function checkUserActions() {
  Object.keys(usersMessages).forEach((userId) => {
    if (usersMessages[userId].count > configs.maxAvailableMessagesCount) {
      actions.restrictUser(configs.chatId, userId);
      Bot.sendMessage(configs.chatId, `${configs.messages.FLOODER_RESTRICT_MESSAGE} ${usersMessages[userId].username}`);

      usersMessages[userId].messages.forEach((messageId) => {
        Bot.deleteMessage(configs.chatId, messageId);
      });
    }
  });
}
