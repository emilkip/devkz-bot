const TelegramBot = require('node-telegram-bot-api');
const configs = require('./config');
const Actions = require('./actions');

const options = configs.bot[configs.env].options;
const Bot = new TelegramBot(configs.token, options);

const actions = new Actions(Bot);

if (configs.env === 'production') {
  Bot.setWebHook(`${configs.url}/bot${configs.token}`);
}


Bot.on('message', (message) => {
  if (!message.new_chat_member) return;

  if (message.new_chat_member.is_bot) return actions.kickBot(message);

  return actions.sendGreetingMessage(message);
});
