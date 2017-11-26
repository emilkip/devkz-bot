const TelegramBot = require('node-telegram-bot-api');
const { mongoose, mongooseOptions } = require('./config/mongooseConfig');
const configs = require('./config/config');
const Actions = require('./actions');
const Flooders = require('./models/Flooders');
const MessagesForMonth = require('./models/MessagesForMonth');
const MessageUtils = require('./utils/MessageUtils');

const envOptions = configs[configs.env];
const options = envOptions.bot.options;
const Bot = new TelegramBot(configs.token, options);
const actions = new Actions(Bot);

const isCurrentChat = (chatId) => (chatId === parseInt(configs.chatId));

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
  if (!isCurrentChat(message.chat.id)) return;
  return actions.getTopFloodersAllTime();
});

Bot.onText(/\/top_flooders_month\b/, (message, match) => {
  if (!isCurrentChat(message.chat.id)) return;
  const currentDate = new Date();
  const beginOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  return actions.getTopFloodersCustom(beginOfMonth, configs.messages.TOP_FLOODERS_FOR_MONTH);
});

Bot.onText(/\/top_flooders_day\b/, (message, match) => {
  if (!isCurrentChat(message.chat.id)) return;
  const currentDate = new Date();
  const beginOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  return actions.getTopFloodersCustom(beginOfDay, configs.messages.TOP_FLOODERS_FOR_DAY);
});


Bot.on('message', (message) => {
  if (!isCurrentChat(message.chat.id)) return;
  if (message.new_chat_member) {
    if (message.new_chat_member.is_bot) return actions.kickBot(message);

    return actions.sendGreetingMessage(message);
  }

  if (message.reply_to_message && message.reply_to_message.from.username === 'devkz_bot') {
    return Bot.sendMessage(configs.chatId, configs.messages.BOT_REPLY_MESSAGE);
  }

  usersMessages = MessageUtils.countMessage(message, usersMessages);
  actions.saveMessageToDB(message);
});


function checkUserActions() {
  Object.keys(usersMessages).forEach((userId) => {
    if (usersMessages[userId].count > configs.maxAvailableMessagesCount) {
      actions.restrictUser(configs.chatId, userId);
      Bot.sendMessage(configs.chatId, `${configs.messages.FLOODER_RESTRICT_MESSAGE} ${usersMessages[userId].username}`);

      usersMessages[userId].messages.forEach((message) => {
        Bot.deleteMessage(configs.chatId, message.message_id);
      });
    }
  });
}
