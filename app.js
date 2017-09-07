const TelegramBot = require('node-telegram-bot-api');
const configs = require('./config');

const options = configs.bot[configs.env].options;
const Bot = new TelegramBot(configs.token, options);

if (configs.env === 'production') {
  Bot.setWebHook(`${configs.url}/bot${configs.token}`);
}


Bot.on('message', (message) => {
  if (message.new_chat_member) {

    const messageParams = {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Дисклеймер',
              url: 'http://telegra.ph/Disclaimer-httpstmedevkz-08-10'
            }
          ]
        ]
      }
    };

    return Bot.sendMessage(
      message.chat.id,
      configs.getGreetingMessage(message.from.username),
      messageParams
    );
  }
});
