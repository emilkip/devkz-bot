const TelegramBot = require('node-telegram-bot-api');
const configs = require('./config');
const Actions = require('./actions');

const options = configs.bot[configs.env].options;
const Bot = new TelegramBot(configs.token, options);
const actions = new Actions(Bot);

let usersMessages = {};


if (configs.env === 'production') {
  Bot.setWebHook(`${configs.url}/bot${configs.token}`);
}

setInterval(() => {
  checkUserActions();
  usersMessages = {};
}, 3000);


Bot.on('message', (message) => {
  if (message.new_chat_member) {
    if (message.new_chat_member.is_bot) return actions.kickBot(message);

    return actions.sendGreetingMessage(message);
  }

  if (message.reply_to_message && message.reply_to_message.from.username === 'devkz_bot') {
    return Bot.sendMessage(configs.chatId, configs.messages.botReplyMessage);
  }

  countMessage(message);
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
      Bot.sendMessage(configs.chatId, `${configs.messages.flooderRestrictMessage} ${usersMessages[userId].username}`);

      usersMessages[userId].messages.forEach((messageId) => {
        Bot.deleteMessage(configs.chatId, messageId);
      });
    }
  });
}
